/* =====================================================================
   ELZARA — js/cart.js
   Cart logic (localStorage key: elz_cart) + cart page rendering.
   The cart stores only { id, size, color, qty }. Prices are ALWAYS read
   from products.js, so changing a price there updates carts instantly.
   ===================================================================== */
"use strict";

ELZ.cart = {
  key: "elz_cart",
  maxQty: 10,
  get() { return ELZ.store.get(this.key, []); },
  save(c) { ELZ.store.set(this.key, c); ELZ.updateCounts(); },
  clear() { this.save([]); },

  /* Add a product. opts: { size, color, qty, silent } */
  add(id, opts = {}) {
    const p = ELZ.byId(id);
    if (!p || !p.inStock) { ELZ.toast("Sorry, this item is sold out"); return false; }
    const size = opts.size || p.sizes[0], color = opts.color || p.colors[0].name, qty = Math.max(1, opts.qty || 1);
    const cart = this.get(), line = cart.find(i => i.id === id && i.size === size && i.color === color);
    const limit = Math.min(p.stock, this.maxQty);
    if (line) line.qty = Math.min(line.qty + qty, limit); else cart.push({ id, size, color, qty: Math.min(qty, limit) });
    this.save(cart);
    if (!opts.silent) ELZ.toast(`Added to cart — ${p.name} (${size}, ${color})`);
    return true;
  },
  remove(index) { const c = this.get(); c.splice(index, 1); this.save(c); },
  setQty(index, q) {
    const c = this.get(), line = c[index]; if (!line) return;
    const p = ELZ.byId(line.id), limit = p ? Math.min(p.stock, this.maxQty) : this.maxQty;
    if (q < 1) return this.remove(index);
    if (q > limit) ELZ.toast(`Only ${limit} available for this item`);
    line.qty = Math.min(q, limit); this.save(c);
  },

  /* Cart lines joined with live product data (drops products no longer in products.js) */
  detailed() { return this.get().map((l, index) => ({ ...l, index, p: ELZ.byId(l.id) })).filter(l => l.p); },
  count() { return this.detailed().reduce((n, l) => n + l.qty, 0); },
  subtotal() { return this.detailed().reduce((s, l) => s + l.p.price * l.qty, 0); },
  shipping(sub = this.subtotal()) { return sub === 0 || sub >= ELZARA_CONFIG.freeShippingOver ? 0 : ELZARA_CONFIG.shippingFee; },
  total() { const s = this.subtotal(); return s + this.shipping(s); }
};

/* Shared order-summary markup (cart + checkout pages) */
ELZ.summaryRows = () => {
  const sub = ELZ.cart.subtotal(), ship = ELZ.cart.shipping(sub);
  const toFree = ELZARA_CONFIG.freeShippingOver - sub;
  return `<div class="sum-row"><span>Subtotal</span><span>${ELZ.priceTag(sub)}</span></div>
    <div class="sum-row"><span>Shipping</span><span>${ship ? ELZ.priceTag(ship) : "Free"}</span></div>
    ${ship && toFree > 0 ? `<p class="sum-note">Add ${ELZ.priceTag(toFree)} more for free shipping.</p>` : ""}
    <div class="sum-row sum-total"><span>Total</span><span>${ELZ.priceTag(sub + ship)}</span></div>`;
};

/* Cart page */
ELZ.initCart = () => {
  const root = document.getElementById("cart-root");
  if (!root) return;
  const lines = ELZ.cart.detailed();
  if (!lines.length) {
    root.innerHTML = `<div class="empty"><div class="empty__icon">${ELZ.icons.bag}</div><h2>Your cart is empty</h2><p>Explore our latest collections and add something beautiful.</p><a class="btn btn-dark" href="shop.html">Continue Shopping</a></div>`;
    return;
  }
  root.innerHTML = `<div class="cart-layout">
    <div class="cart-list">${lines.map(l => `
      <div class="cart-item">
        <a class="cart-item__img" href="product.html?id=${l.p.id}"><img src="${l.p.image}" alt="${ELZ.esc(l.p.name)}" data-label="${ELZ.esc(l.p.name)}"></a>
        <div class="cart-item__info">
          <a class="cart-item__name" href="product.html?id=${l.p.id}">${ELZ.esc(l.p.name)}</a>
          <p class="muted">${ELZ.esc(l.p.category)} · Size: ${ELZ.esc(l.size)} · Colour: ${ELZ.esc(l.color)}</p>
          <p class="price">${ELZ.priceTag(l.p.price)} ${l.p.discount ? `<s class="price-was">${ELZ.priceTag(l.p.originalPrice)}</s>` : ""}</p>
          <div class="qty"><button type="button" data-cart-dec="${l.index}" aria-label="Decrease quantity">−</button><span>${l.qty}</span><button type="button" data-cart-inc="${l.index}" aria-label="Increase quantity">+</button></div>
        </div>
        <div class="cart-item__side">
          <strong>${ELZ.priceTag(l.p.price * l.qty)}</strong>
          <button class="link-btn" type="button" data-cart-remove="${l.index}">Remove</button>
        </div>
      </div>`).join("")}
      <a class="link-arrow" href="shop.html">← Continue Shopping</a>
    </div>
    <aside class="summary"><h2>Order Summary</h2>${ELZ.summaryRows()}
      <a class="btn btn-dark btn-block" href="checkout.html">Proceed to Checkout</a>
      <a class="btn btn-outline btn-block" href="shop.html">Continue Shopping</a>
      <p class="muted small">Demo store — no real payment is taken.</p>
    </aside></div>`;
  ELZ.checkBrokenImages(root);
};

document.addEventListener("click", e => {
  const dec = e.target.closest("[data-cart-dec]"), inc = e.target.closest("[data-cart-inc]"), rm = e.target.closest("[data-cart-remove]");
  if (!dec && !inc && !rm) return;
  const cart = ELZ.cart.get();
  if (dec) ELZ.cart.setQty(+dec.dataset.cartDec, cart[+dec.dataset.cartDec].qty - 1);
  if (inc) ELZ.cart.setQty(+inc.dataset.cartInc, cart[+inc.dataset.cartInc].qty + 1);
  if (rm) { ELZ.cart.remove(+rm.dataset.cartRemove); ELZ.toast("Item removed from cart"); }
  ELZ.initCart();
});
