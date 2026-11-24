/* =====================================================================
   ELZARA — js/checkout.js
   Demo checkout (no payment gateway) + order confirmation page.
   Orders are saved in localStorage (elz_orders, elz_last_order).
   ===================================================================== */
"use strict";

/* Checkout page */
ELZ.initCheckout = () => {
  const form = document.getElementById("checkout-form");
  if (!form) return;
  const summary = document.getElementById("checkout-summary");
  const lines = ELZ.cart.detailed();

  if (!lines.length) {
    document.getElementById("checkout-root").innerHTML = `<div class="empty"><div class="empty__icon">${ELZ.icons.bag}</div><h2>Your cart is empty</h2><p>Add something to your cart before checking out.</p><a class="btn btn-dark" href="shop.html">Continue Shopping</a></div>`;
    return;
  }

  /* Order summary */
  summary.innerHTML = lines.map(l => `
    <div class="sum-item">
      <img src="${l.p.image}" alt="${ELZ.esc(l.p.name)}" data-label="${ELZ.esc(l.p.name)}">
      <div><strong>${ELZ.esc(l.p.name)}</strong><span class="muted small">Size ${ELZ.esc(l.size)} · ${ELZ.esc(l.color)} · Qty ${l.qty}</span></div>
      <span>${ELZ.priceTag(l.p.price * l.qty)}</span>
    </div>`).join("") + ELZ.summaryRows();
  ELZ.checkBrokenImages(summary);

  /* Validation rules */
  const rules = {
    name: v => v.trim().length >= 3 || "Please enter your full name.",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Please enter a valid email address.",
    phone: v => /^\+?[0-9\s-]{10,16}$/.test(v.trim()) || "Please enter a valid phone number (10–15 digits).",
    city: v => v.trim().length >= 2 || "Please enter your city.",
    address: v => v.trim().length >= 10 || "Please enter your complete delivery address."
  };
  const check = field => {
    const input = form.elements[field], res = rules[field](input.value), err = form.querySelector(`[data-error="${field}"]`);
    err.textContent = res === true ? "" : res;
    input.classList.toggle("is-invalid", res !== true);
    return res === true;
  };
  Object.keys(rules).forEach(f => form.elements[f].addEventListener("blur", () => check(f)));

  form.addEventListener("submit", e => {
    e.preventDefault();
    const ok = Object.keys(rules).map(check).every(Boolean);
    if (!ok) { const bad = form.querySelector(".is-invalid"); if (bad) bad.focus(); return; }

    const now = new Date(), pad = n => String(n).padStart(2, "0");
    const number = `ELZ-${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${Math.floor(1000 + Math.random() * 9000)}`;
    const items = ELZ.cart.detailed().map(l => ({ id: l.p.id, name: l.p.name, image: l.p.image, size: l.size, color: l.color, qty: l.qty, unit: l.p.price }));
    const subtotal = ELZ.cart.subtotal(), shipping = ELZ.cart.shipping(subtotal);
    const order = {
      number, date: now.toISOString(), items, subtotal, shipping, total: subtotal + shipping,
      payment: "Cash on Delivery (demo)",
      customer: { name: form.elements.name.value.trim(), email: form.elements.email.value.trim(), phone: form.elements.phone.value.trim(), city: form.elements.city.value.trim(), address: form.elements.address.value.trim(), notes: form.elements.notes.value.trim() }
    };
    const all = ELZ.store.get("elz_orders", []); all.push(order);
    ELZ.store.set("elz_orders", all);
    ELZ.store.set("elz_last_order", order);
    ELZ.cart.clear();
    window.location.href = "order-confirmation.html";
  });
};

/* Order confirmation page */
ELZ.initConfirmation = () => {
  const root = document.getElementById("confirmation-root");
  if (!root) return;
  const o = ELZ.store.get("elz_last_order", null);
  if (!o) {
    root.innerHTML = `<div class="empty"><h2>No recent order found</h2><p>Place an order and your confirmation will appear here.</p><a class="btn btn-dark" href="shop.html">Start Shopping</a></div>`;
    return;
  }
  const c = o.customer, d = new Date(o.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  root.innerHTML = `
    <div class="confirm">
      <div class="confirm__tick" aria-hidden="true">✓</div>
      <h1>Thank you, ${ELZ.esc(c.name.split(" ")[0])}!</h1>
      <p class="lead">Your order has been placed successfully. A confirmation would be sent to <strong>${ELZ.esc(c.email)}</strong> in a live store.</p>
      <div class="confirm__number"><span>Order Number</span><strong>${ELZ.esc(o.number)}</strong><small>${d}</small></div>
    </div>
    <div class="confirm-grid">
      <section class="panel"><h2>Customer Information</h2>
        <dl class="dl">
          <dt>Name</dt><dd>${ELZ.esc(c.name)}</dd>
          <dt>Email</dt><dd>${ELZ.esc(c.email)}</dd>
          <dt>Phone</dt><dd>${ELZ.esc(c.phone)}</dd>
          <dt>City</dt><dd>${ELZ.esc(c.city)}</dd>
          <dt>Address</dt><dd>${ELZ.esc(c.address)}</dd>
          ${c.notes ? `<dt>Notes</dt><dd>${ELZ.esc(c.notes)}</dd>` : ""}
          <dt>Payment</dt><dd>${ELZ.esc(o.payment)}</dd>
        </dl>
      </section>
      <section class="panel"><h2>Ordered Products</h2>
        ${o.items.map(i => `<div class="sum-item"><img src="${i.image}" alt="${ELZ.esc(i.name)}" data-label="${ELZ.esc(i.name)}"><div><strong>${ELZ.esc(i.name)}</strong><span class="muted small">Size ${ELZ.esc(i.size)} · ${ELZ.esc(i.color)} · Qty ${i.qty}</span></div><span>${ELZ.priceTag(i.unit * i.qty)}</span></div>`).join("")}
        <div class="sum-row"><span>Subtotal</span><span>${ELZ.priceTag(o.subtotal)}</span></div>
        <div class="sum-row"><span>Shipping</span><span>${o.shipping ? ELZ.priceTag(o.shipping) : "Free"}</span></div>
        <div class="sum-row sum-total"><span>Total Amount</span><span>${ELZ.priceTag(o.total)}</span></div>
      </section>
    </div>
    <div class="confirm__actions">
      <a class="btn btn-dark" href="shop.html">Continue Shopping</a>
      <button class="btn btn-outline" type="button" id="print-order">Print Confirmation</button>
    </div>
    <p class="muted small center">This is a demo order — no payment was taken and nothing will be shipped.</p>`;
  ELZ.checkBrokenImages(root);
  document.getElementById("print-order").addEventListener("click", () => window.print());
};
