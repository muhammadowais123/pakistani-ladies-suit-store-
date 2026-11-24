/* =====================================================================
   ELZARA — js/main.js
   Site-wide behaviour: header/footer, navigation, search, currency,
   toasts, modals, WhatsApp/back-to-top, and page-specific setup
   (home, shop, product, about, contact). Must be loaded LAST.
   ===================================================================== */
"use strict";

/* ----------------------------- TOAST ---------------------------------- */
ELZ.toast = msg => {
  let box = document.getElementById("toast-box");
  if (!box) { box = document.createElement("div"); box.id = "toast-box"; box.setAttribute("aria-live", "polite"); document.body.appendChild(box); }
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = msg; box.appendChild(t);
  requestAnimationFrame(() => t.classList.add("show"));
  setTimeout(() => { t.classList.remove("show"); setTimeout(() => t.remove(), 400); }, 2800);
};

/* ----------------------- HEADER COUNTS -------------------------------- */
ELZ.updateCounts = () => {
  const set = (name, n) => document.querySelectorAll(`[data-count="${name}"]`).forEach(el => { el.textContent = n; el.classList.toggle("is-zero", n === 0); });
  set("cart", ELZ.cart.count());
  set("wish", ELZ.wishlist.get().filter(id => ELZ.byId(id)).length);
};

/* ------------------- SHARED HEADER / FOOTER --------------------------- */
const NAV_LINKS = [
  ["Home", "index.html"], ["New Arrivals", "shop.html?filter=new"], ["Women's Collection", "shop.html?collection=women"],
  ["Stitched", "shop.html?type=stitched"], ["Unstitched", "shop.html?type=unstitched"], ["About", "about.html"], ["Contact", "contact.html"]
];

function isActive(href) {
  const [file, query] = href.split("?"), here = location.pathname.split("/").pop() || "index.html";
  if (file !== here) return false;
  return query ? location.search.includes(query) : (file !== "shop.html");
}

function currencySelect() {
  return `<select class="js-currency" aria-label="Currency"><option value="PKR">PKR ₨</option><option value="USD">USD $</option></select>`;
}

function renderChrome() {
  const C = ELZARA_CONFIG, nav = NAV_LINKS.map(([t, h]) => `<a href="${h}" class="${isActive(h) ? "active" : ""}">${t}</a>`).join("");
  const header = document.getElementById("site-header");
  if (header) header.innerHTML = `
  <div class="announce"><div class="container announce__in">
    <p>Free shipping on orders above PKR ${C.freeShippingOver.toLocaleString("en-US")} &nbsp;·&nbsp; Worldwide delivery</p>${currencySelect()}
  </div></div>
  <header class="header"><div class="container header__in">
    <button class="icon-btn menu-btn" id="menu-open" aria-label="Open menu" type="button">${ELZ.icons.menu}</button>
    <a class="logo" href="index.html" aria-label="ELZARA home"><span class="logo__name">ELZARA</span><span class="logo__tag">Elegance That Defines You</span></a>
    <nav class="nav" aria-label="Main">${nav}</nav>
    <div class="header__icons">
      <button class="icon-btn" id="search-toggle" aria-label="Search" type="button">${ELZ.icons.search}</button>
      <button class="icon-btn hide-sm" data-modal-open="account-modal" aria-label="Account" type="button">${ELZ.icons.user}</button>
      <a class="icon-btn" href="wishlist.html" aria-label="Wishlist">${ELZ.icons.heart}<span class="count is-zero" data-count="wish">0</span></a>
      <a class="icon-btn" href="cart.html" aria-label="Cart">${ELZ.icons.bag}<span class="count is-zero" data-count="cart">0</span></a>
    </div>
  </div>
  <div class="searchbar" id="searchbar"><div class="container">
    <form id="search-form" role="search"><input id="search-input" type="search" placeholder="Search lawn, chiffon, embroidered…" autocomplete="off" aria-label="Search products"><button class="btn btn-dark btn-sm" type="submit">Search</button></form>
    <div id="search-results" class="search-results"></div>
  </div></div></header>
  <div class="drawer" id="drawer" aria-hidden="true"><div class="drawer__panel">
    <div class="drawer__top"><span class="logo__name">ELZARA</span><button class="icon-btn" id="menu-close" aria-label="Close menu" type="button">${ELZ.icons.close}</button></div>
    <nav class="drawer__nav">${nav}<a href="cart.html">Cart</a><a href="wishlist.html">Wishlist</a><a href="#" data-modal-open="account-modal">Account</a></nav>
    <div class="drawer__cur">Currency ${currencySelect()}</div>
  </div><div class="drawer__backdrop" id="drawer-bg"></div></div>`;

  const footer = document.getElementById("site-footer");
  if (footer) footer.innerHTML = `
  <footer class="footer"><div class="container">
    <div class="footer__grid">
      <div><span class="logo__name light">ELZARA</span><p class="footer__txt">${C.tagline} Premium Pakistani women's fashion — lawn, chiffon and embroidered couture, delivered worldwide.</p></div>
      <div><h4>Shop</h4><ul>${CATEGORIES.map(c => `<li><a href="shop.html?cat=${encodeURIComponent(c)}">${c}</a></li>`).join("")}</ul></div>
      <div><h4>Explore</h4><ul><li><a href="shop.html?filter=new">New Arrivals</a></li><li><a href="shop.html?type=stitched">Stitched</a></li><li><a href="shop.html?type=unstitched">Unstitched</a></li><li><a href="about.html">About ELZARA</a></li><li><a href="contact.html">Contact Us</a></li></ul></div>
      <div><h4>Contact</h4><ul class="footer__contact"><li>${C.address}</li><li>${C.phone}</li><li>${C.email}</li><li><a href="https://wa.me/${C.whatsappNumber}" target="_blank" rel="noopener">Chat on WhatsApp</a></li></ul></div>
    </div>
    <div class="footer__bottom"><p>© ${new Date().getFullYear()} ELZARA. All rights reserved.</p><p class="small">Demo website. Product images are placeholders and not original ELZARA photography.</p></div>
  </div></footer>

  <!-- Account (demo) modal -->
  <div class="modal" id="account-modal" aria-hidden="true"><div class="modal__box small-box" role="dialog" aria-label="Account">
    <button class="modal__close" data-modal-close aria-label="Close" type="button">${ELZ.icons.close}</button>
    <h2>Welcome Back</h2><p class="muted">Customer accounts are not enabled in this demo.</p>
    <form id="account-form" novalidate><label class="field"><span>Email</span><input type="email" placeholder="you@example.com"></label><label class="field"><span>Password</span><input type="password" placeholder="••••••••"></label><button class="btn btn-dark btn-block" type="submit">Sign In</button></form>
  </div></div>
  <a class="whatsapp" href="https://wa.me/${C.whatsappNumber}?text=${encodeURIComponent(C.whatsappMessage)}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${ELZ.icons.whatsapp}</a>
  <button class="to-top" id="to-top" aria-label="Back to top" type="button">${ELZ.icons.up}</button>`;
}

/* ------------------------ GLOBAL BEHAVIOUR ---------------------------- */
function initGlobal() {
  /* Currency selects stay in sync */
  const cur = ELZ.currency();
  document.querySelectorAll(".js-currency").forEach(sel => {
    sel.value = cur;
    sel.addEventListener("change", () => {
      ELZ.store.set("elz_currency", sel.value);
      document.querySelectorAll(".js-currency").forEach(s => { s.value = sel.value; });
      ELZ.refreshPrices();
    });
  });

  /* Mobile drawer */
  const drawer = document.getElementById("drawer"), setDrawer = open => { if (!drawer) return; drawer.classList.toggle("open", open); drawer.setAttribute("aria-hidden", !open); document.body.classList.toggle("no-scroll", open); };
  const mo = document.getElementById("menu-open"), mc = document.getElementById("menu-close"), mb = document.getElementById("drawer-bg");
  if (mo) mo.addEventListener("click", () => setDrawer(true));
  if (mc) mc.addEventListener("click", () => setDrawer(false));
  if (mb) mb.addEventListener("click", () => setDrawer(false));
  if (drawer) drawer.addEventListener("click", e => { if (e.target.closest("a")) setDrawer(false); });

  /* Search bar + live suggestions */
  const bar = document.getElementById("searchbar"), input = document.getElementById("search-input"), results = document.getElementById("search-results"), form = document.getElementById("search-form");
  const st = document.getElementById("search-toggle");
  if (st) st.addEventListener("click", () => { bar.classList.toggle("open"); if (bar.classList.contains("open")) input.focus(); });
  if (input) input.addEventListener("input", () => {
    const words = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) { results.innerHTML = ""; return; }
    const hits = PRODUCTS.filter(p => words.every(w => (p.name + " " + p.category + " " + p.fabric + " " + p.type + " " + p.colors.map(c => c.name).join(" ")).toLowerCase().includes(w)));
    results.innerHTML = hits.length
      ? hits.slice(0, 5).map(p => `<a class="search-hit" href="product.html?id=${p.id}"><img src="${p.image}" alt="" data-label="${ELZ.esc(p.name)}"><span><strong>${ELZ.esc(p.name)}</strong><small>${ELZ.esc(p.category)}</small></span>${ELZ.priceTag(p.price)}</a>`).join("") + `<a class="search-all" href="shop.html?q=${encodeURIComponent(input.value.trim())}">View all ${hits.length} result${hits.length > 1 ? "s" : ""}</a>`
      : `<p class="muted pad">No products found for "${ELZ.esc(input.value)}".</p>`;
    ELZ.checkBrokenImages(results);
  });
  if (form) form.addEventListener("submit", e => { e.preventDefault(); const v = input.value.trim(); if (v) location.href = "shop.html?q=" + encodeURIComponent(v); });

  /* Delegated clicks: wishlist hearts, quick add, modals */
  document.addEventListener("click", e => {
    const w = e.target.closest("[data-wish]"); if (w) { e.preventDefault(); ELZ.wishlist.toggle(w.dataset.wish); return; }
    const q = e.target.closest("[data-quick-add]"); if (q) { ELZ.cart.add(q.dataset.quickAdd); return; }
    const mo = e.target.closest("[data-modal-open]"); if (mo) { e.preventDefault(); openModal(mo.dataset.modalOpen); return; }
    if (e.target.closest("[data-modal-close]") || e.target.classList.contains("modal")) closeModals();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeModals(); if (bar) bar.classList.remove("open"); setDrawer(false); } });

  const acct = document.getElementById("account-form");
  if (acct) acct.addEventListener("submit", e => { e.preventDefault(); closeModals(); ELZ.toast("Accounts are not enabled in this demo"); });

  /* Back to top */
  const top = document.getElementById("to-top");
  if (top) {
    window.addEventListener("scroll", () => top.classList.toggle("show", window.scrollY > 500), { passive: true });
    top.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* Newsletter (demo — saves email locally only) */
  document.querySelectorAll(".js-newsletter").forEach(f => f.addEventListener("submit", e => {
    e.preventDefault();
    const email = f.querySelector("input[type=email]"), msg = f.parentElement.querySelector(".form-msg");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())) { msg.textContent = "Please enter a valid email address."; msg.className = "form-msg error"; return; }
    const list = ELZ.store.get("elz_newsletter", []); list.push(email.value.trim()); ELZ.store.set("elz_newsletter", list);
    msg.textContent = "Thank you for subscribing to ELZARA (demo)."; msg.className = "form-msg ok"; f.reset();
  }));
}

function openModal(id) { const m = document.getElementById(id); if (m) { m.classList.add("open"); m.setAttribute("aria-hidden", "false"); document.body.classList.add("no-scroll"); } }
function closeModals() { document.querySelectorAll(".modal.open").forEach(m => { m.classList.remove("open"); m.setAttribute("aria-hidden", "true"); }); document.body.classList.remove("no-scroll"); }

/* =========================== HOME PAGE ================================== */
function initHome() {
  /* Categories */
  const cats = document.getElementById("home-categories");
  if (cats) {
    cats.innerHTML = CATEGORIES.map(c => `<a class="cat-card" href="shop.html?cat=${encodeURIComponent(c)}"><img loading="lazy" src="images/banners/cat-${ELZ.slug(c)}.jpg" alt="${c}" data-label="${c}" data-sub="Category image"><span class="cat-card__label"><em>${PRODUCTS.filter(p => p.category === c).length} pieces</em>${c}</span></a>`).join("")
      + `<a class="cat-card cat-card--all" href="shop.html"><span class="cat-card__label"><em>Discover everything</em>View All Collections →</span></a>`;
  }
  /* Best sellers + new arrivals (all driven by flags/data in products.js) */
  const best = document.getElementById("home-best");
  if (best) best.innerHTML = PRODUCTS.filter(p => p.bestSeller).sort((a, b) => b.rating * b.reviews - a.rating * a.reviews).slice(0, 8).map(ELZ.card).join("");
  const fresh = document.getElementById("home-new");
  if (fresh) fresh.innerHTML = PRODUCTS.filter(p => p.isNew).slice(0, 8).map(ELZ.card).join("");

  /* Promo slider */
  const slider = document.getElementById("promo-slider");
  if (slider) {
    const slides = ELZARA_CONFIG.promos;
    slider.innerHTML = slides.map((s, i) => `<div class="promo ${i === 0 ? "active" : ""}"><span class="eyebrow">${ELZ.esc(s.eyebrow)}</span><h2>${ELZ.esc(s.title)}</h2><p>${ELZ.esc(s.text)}</p><a class="btn btn-gold" href="${s.link}">${ELZ.esc(s.cta)}</a></div>`).join("")
      + `<button class="promo-nav prev" aria-label="Previous offer" type="button">‹</button><button class="promo-nav next" aria-label="Next offer" type="button">›</button><div class="promo-dots">${slides.map((_, i) => `<button class="${i === 0 ? "active" : ""}" aria-label="Offer ${i + 1}" type="button"></button>`).join("")}</div>`;
    let idx = 0, timer;
    const els = slider.querySelectorAll(".promo"), dots = slider.querySelectorAll(".promo-dots button");
    const go = n => { idx = (n + els.length) % els.length; els.forEach((e, i) => e.classList.toggle("active", i === idx)); dots.forEach((d, i) => d.classList.toggle("active", i === idx)); };
    const auto = () => { clearInterval(timer); timer = setInterval(() => go(idx + 1), 5500); };
    slider.querySelector(".prev").addEventListener("click", () => { go(idx - 1); auto(); });
    slider.querySelector(".next").addEventListener("click", () => { go(idx + 1); auto(); });
    dots.forEach((d, i) => d.addEventListener("click", () => { go(i); auto(); }));
    slider.addEventListener("mouseenter", () => clearInterval(timer)); slider.addEventListener("mouseleave", auto); auto();
  }

  /* Testimonials */
  const tm = document.getElementById("home-testimonials");
  if (tm) tm.innerHTML = ELZ_REVIEWS.slice(0, 3).map(r => `<figure class="testi"><div class="stars">${ELZ.stars(r.rating)}</div><blockquote>${ELZ.esc(r.text)}</blockquote><figcaption><strong>${ELZ.esc(r.name)}</strong> · ${ELZ.esc(r.city)}</figcaption></figure>`).join("");

  initVideo();
}

/* ---------------------- FASHION VIDEO SECTION ------------------------- */
function initVideo() {
  const wrap = document.getElementById("video-wrap");
  if (!wrap) return;
  const C = ELZARA_CONFIG, v = wrap.querySelector("video"), src = v.querySelector("source"), notice = wrap.querySelector(".video-notice"), big = wrap.querySelector(".video-play");
  const showPlaceholder = () => { wrap.classList.add("no-video"); v.removeAttribute("controls"); notice.hidden = false; big.hidden = true; };
  /* Poster: use real poster if it exists, otherwise an elegant placeholder */
  const probe = new Image();
  probe.onload = () => { v.poster = C.videoPoster; };
  probe.onerror = () => { v.poster = ELZ.placeholder("Fashion in Motion", "Video poster — replace", true); };
  probe.src = C.videoPoster;
  src.addEventListener("error", showPlaceholder); v.addEventListener("error", showPlaceholder);
  src.src = C.videoPath; v.load();
  big.addEventListener("click", () => { v.play().catch(showPlaceholder); });
  v.addEventListener("play", () => { big.hidden = true; });
  v.addEventListener("pause", () => { if (!wrap.classList.contains("no-video")) big.hidden = false; });
  v.addEventListener("ended", () => { big.hidden = false; });
  const look = document.getElementById("shop-look"), p = ELZ.byId(C.videoLookProductId);
  if (look && p) { look.href = "product.html?id=" + p.id; look.querySelector("span").textContent = p.name; }
}

/* =========================== SHOP PAGE ================================== */
function initShop() {
  const grid = document.getElementById("shop-grid");
  if (!grid) return;
  const qs = new URLSearchParams(location.search);
  const state = { q: qs.get("q") || "", cat: qs.get("cat") || "", type: qs.get("type") || "", isNew: qs.get("filter") === "new", sort: qs.get("sort") || "featured", max: Infinity };

  const prices = PRODUCTS.map(p => p.price), pmin = Math.floor(Math.min(...prices) / 500) * 500, pmax = Math.ceil(Math.max(...prices) / 500) * 500;
  state.max = pmax;
  const $ = id => document.getElementById(id);
  const search = $("shop-search"), type = $("shop-type"), sort = $("shop-sort"), isNew = $("shop-new"), range = $("shop-price"), rangeOut = $("shop-price-out"), cats = $("shop-cats");
  search.value = state.q; type.value = state.type; sort.value = state.sort; isNew.checked = state.isNew;
  range.min = pmin; range.max = pmax; range.step = 500; range.value = pmax;
  cats.innerHTML = ["", ...CATEGORIES].map(c => `<button type="button" class="chip" data-cat="${c}">${c || "All"}</button>`).join("");

  const headings = () => {
    if (state.q) return ["Search Results", `Showing results for "${state.q}"`];
    if (state.isNew) return ["New Arrivals", "The latest additions to the ELZARA collection."];
    if (state.cat) return [state.cat, `Explore our ${state.cat} collection.`];
    if (state.type === "stitched") return ["Stitched Collection", "Ready-to-wear, perfectly tailored pieces."];
    if (state.type === "unstitched") return ["Unstitched Collection", "Premium fabric, ready for your tailor."];
    if (qs.get("collection") === "women") return ["Women's Collection", "Every ELZARA piece, designed for the modern woman."];
    return ["Shop All", "Discover the complete ELZARA collection."];
  };

  const render = () => {
    const [h, s] = headings(); $("shop-title").textContent = h; $("shop-sub").textContent = s; document.title = h + " — ELZARA";
    const words = state.q.toLowerCase().split(/\s+/).filter(Boolean);
    let list = PRODUCTS.filter(p =>
      (!state.cat || p.category === state.cat) && (!state.type || p.type === state.type) && (!state.isNew || p.isNew) && p.price <= state.max &&
      words.every(w => (p.name + " " + p.category + " " + p.fabric + " " + p.type + " " + p.description + " " + p.colors.map(c => c.name).join(" ")).toLowerCase().includes(w)));
    const sorters = {
      featured: () => 0,
      newest: (a, b) => (b.isNew - a.isNew) || b.id.localeCompare(a.id),
      popular: (a, b) => (b.rating * b.reviews) - (a.rating * a.reviews),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      discount: (a, b) => b.discount - a.discount
    };
    list = list.slice().sort(sorters[state.sort] || sorters.featured);
    $("shop-count").textContent = `${list.length} product${list.length === 1 ? "" : "s"}`;
    grid.innerHTML = list.length ? list.map(ELZ.card).join("") : `<div class="empty wide"><h2>No products found</h2><p>Try a different search or clear your filters.</p><button class="btn btn-dark" id="shop-reset" type="button">Clear Filters</button></div>`;
    cats.querySelectorAll(".chip").forEach(c => c.classList.toggle("active", c.dataset.cat === state.cat));
    rangeOut.innerHTML = ELZ.priceTag(state.max);
    ELZ.syncWishButtons(); ELZ.checkBrokenImages(grid);
  };

  search.addEventListener("input", () => { state.q = search.value.trim(); render(); });
  type.addEventListener("change", () => { state.type = type.value; render(); });
  sort.addEventListener("change", () => { state.sort = sort.value; render(); });
  isNew.addEventListener("change", () => { state.isNew = isNew.checked; render(); });
  range.addEventListener("input", () => { state.max = +range.value; render(); });
  cats.addEventListener("click", e => { const c = e.target.closest(".chip"); if (c) { state.cat = c.dataset.cat; render(); } });
  grid.addEventListener("click", e => {
    if (!e.target.closest("#shop-reset")) return;
    Object.assign(state, { q: "", cat: "", type: "", isNew: false, max: pmax, sort: "featured" });
    search.value = ""; type.value = ""; sort.value = "featured"; isNew.checked = false; range.value = pmax; render();
  });
  render();
}

/* ========================= PRODUCT PAGE ================================= */
function initProduct() {
  const root = document.getElementById("product-root");
  if (!root) return;
  const p = ELZ.byId(new URLSearchParams(location.search).get("id"));
  if (!p) { root.innerHTML = `<div class="container"><div class="empty"><h2>Product not found</h2><p>This piece may no longer be available.</p><a class="btn btn-dark" href="shop.html">Back to Shop</a></div></div>`; return; }
  document.title = p.name + " — ELZARA";
  const needSize = p.sizes.length > 1, sel = { size: needSize ? "" : p.sizes[0], color: p.colors[0].name, qty: 1 };
  const reviews = ELZ.reviewsFor(p.id, 3);
  let related = PRODUCTS.filter(x => x.id !== p.id && x.category === p.category);
  related = related.concat(PRODUCTS.filter(x => x.id !== p.id && x.category !== p.category && x.type === p.type)).slice(0, 4);
  const stockText = !p.inStock ? `<span class="stock out">Sold out</span>` : p.stock <= 5 ? `<span class="stock low">Only ${p.stock} left</span>` : `<span class="stock in">In stock</span>`;

  root.innerHTML = `
  <div class="container">
    <nav class="crumbs"><a href="index.html">Home</a> / <a href="shop.html?cat=${encodeURIComponent(p.category)}">${ELZ.esc(p.category)}</a> / <span>${ELZ.esc(p.name)}</span></nav>
    <div class="pd-layout">
      <div class="pd-gallery">
        <div class="pd-main"><img id="pd-main-img" src="${p.gallery[0]}" alt="${ELZ.esc(p.name)}" data-label="${ELZ.esc(p.name)}" data-sub="Front view — demo image">
          ${p.discount ? `<span class="badge badge-sale">-${p.discount}%</span>` : ""}</div>
        <div class="pd-thumbs">${p.gallery.map((g, i) => `<button type="button" class="${i === 0 ? "active" : ""}" data-thumb="${g}" aria-label="View image ${i + 1}"><img src="${g}" alt="" data-label="${ELZ.esc(p.name)}" data-sub="${["Front view", "Detail view", "Back view"][i] || "View"} — demo image"></button>`).join("")}</div>
      </div>
      <div class="pd-info">
        <span class="eyebrow">${ELZ.esc(p.category)} · ${p.type === "stitched" ? "Stitched" : "Unstitched"}</span>
        <h1>${ELZ.esc(p.name)}</h1>
        <div class="rating"><span class="stars">${ELZ.stars(p.rating)}</span> <a href="#reviews">${p.rating} · ${p.reviews} reviews</a></div>
        <div class="price price-lg"><span class="price-now">${ELZ.priceTag(p.price)}</span>${p.discount ? `<s class="price-was">${ELZ.priceTag(p.originalPrice)}</s><span class="save">Save ${p.discount}%</span>` : ""}</div>
        <p class="pd-desc">${ELZ.esc(p.description)}</p>
        <p class="pd-fabric"><strong>Fabric details:</strong> ${ELZ.esc(p.fabric)}</p>
        <p>${stockText}</p>
        <div class="opt"><div class="opt__label">Colour: <strong id="sel-color">${ELZ.esc(sel.color)}</strong></div>
          <div class="swatches">${p.colors.map((c, i) => `<button type="button" class="swatch ${i === 0 ? "active" : ""}" data-color="${ELZ.esc(c.name)}" title="${ELZ.esc(c.name)}" aria-label="${ELZ.esc(c.name)}"><span class="swatch__dot" data-hex="${c.hex}"></span></button>`).join("")}</div></div>
        <div class="opt"><div class="opt__label">Size: <strong id="sel-size">${needSize ? "Select a size" : ELZ.esc(sel.size)}</strong>${needSize ? ` <button type="button" class="link-btn" data-modal-open="size-guide">Size Guide</button>` : ""}</div>
          <div class="sizes">${p.sizes.map(s => `<button type="button" class="size ${!needSize ? "active" : ""}" data-size="${ELZ.esc(s)}">${ELZ.esc(s)}</button>`).join("")}</div></div>
        <p class="form-msg error" id="pd-error" role="alert"></p>
        <div class="pd-actions">
          <div class="qty"><button type="button" id="qty-dec" aria-label="Decrease quantity">−</button><span id="qty-val">1</span><button type="button" id="qty-inc" aria-label="Increase quantity">+</button></div>
          <button class="btn btn-dark grow" id="pd-add" type="button" ${p.inStock ? "" : "disabled"}>${p.inStock ? "Add to Cart" : "Sold Out"}</button>
          <button class="btn btn-outline wish-btn" data-wish="${p.id}" data-wish-label type="button">${ELZ.icons.heart}<span class="wish-text">Add to Wishlist</span></button>
        </div>
        <div class="pd-acc">
          <details open><summary>Fabric &amp; Care</summary><p>${ELZ.esc(p.fabric)}. Dry clean recommended for embroidered pieces. Colours may vary slightly by screen.</p></details>
          <details><summary>Delivery &amp; Returns</summary><p>Free delivery above PKR ${ELZARA_CONFIG.freeShippingOver.toLocaleString("en-US")}; flat PKR ${ELZARA_CONFIG.shippingFee} otherwise. Worldwide shipping available. Easy exchange within 7 days of delivery (demo policy).</p></details>
        </div>
      </div>
    </div>
    <section class="pd-reviews" id="reviews"><h2>Customer Reviews</h2>
      <div class="rev-summary"><strong>${p.rating}</strong><div><span class="stars">${ELZ.stars(p.rating)}</span><p class="muted small">Based on ${p.reviews} reviews</p></div></div>
      <div class="rev-list">${reviews.map(r => `<article class="rev"><div class="stars">${ELZ.stars(r.rating)}</div><p>${ELZ.esc(r.text)}</p><span class="muted small">${ELZ.esc(r.name)} · ${ELZ.esc(r.city)}</span></article>`).join("")}</div>
      <p class="muted small">Sample reviews shown for demonstration purposes.</p></section>
    <section class="pd-related"><div class="section-head"><span class="eyebrow">You May Also Love</span><h2>Related Products</h2></div>
      <div class="grid-products">${related.map(ELZ.card).join("")}</div></section>
  </div>`;

  /* Swatch colours are set from JS (keeps CSS out of the markup) */
  root.querySelectorAll(".swatch__dot").forEach(d => { d.style.background = d.dataset.hex; });

  const main = document.getElementById("pd-main-img"), err = document.getElementById("pd-error");
  root.addEventListener("click", e => {
    const th = e.target.closest("[data-thumb]"), co = e.target.closest("[data-color]"), si = e.target.closest("[data-size]");
    if (th) { main.dataset.fb = ""; main.src = th.dataset.thumb; main.dataset.sub = th.querySelector("img").dataset.sub; root.querySelectorAll("[data-thumb]").forEach(b => b.classList.toggle("active", b === th)); }
    if (co) { sel.color = co.dataset.color; document.getElementById("sel-color").textContent = sel.color; root.querySelectorAll(".swatch").forEach(b => b.classList.toggle("active", b === co)); }
    if (si && needSize) { sel.size = si.dataset.size; err.textContent = ""; document.getElementById("sel-size").textContent = sel.size; root.querySelectorAll(".size").forEach(b => b.classList.toggle("active", b === si)); }
  });
  const limit = Math.min(p.stock, ELZ.cart.maxQty), qv = document.getElementById("qty-val");
  document.getElementById("qty-dec").addEventListener("click", () => { sel.qty = Math.max(1, sel.qty - 1); qv.textContent = sel.qty; });
  document.getElementById("qty-inc").addEventListener("click", () => { sel.qty = Math.min(limit, sel.qty + 1); qv.textContent = sel.qty; });
  document.getElementById("pd-add").addEventListener("click", () => {
    if (!sel.size) { err.textContent = "Please select a size before adding to cart."; return; }
    ELZ.cart.add(p.id, { size: sel.size, color: sel.color, qty: sel.qty });
  });
  ELZ.syncWishButtons(); ELZ.checkBrokenImages(root);
}

/* ========================= CONTACT PAGE ================================= */
function initContact() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const f = form.elements, msg = document.getElementById("contact-msg");
    const ok = f.name.value.trim().length >= 2 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.value.trim()) && f.message.value.trim().length >= 10;
    if (!ok) { msg.textContent = "Please enter your name, a valid email and a message (10+ characters)."; msg.className = "form-msg error"; return; }
    const inbox = ELZ.store.get("elz_messages", []); inbox.push({ name: f.name.value.trim(), email: f.email.value.trim(), subject: f.subject.value, message: f.message.value.trim(), date: new Date().toISOString() });
    ELZ.store.set("elz_messages", inbox);
    msg.textContent = "Thank you — your message has been received (demo: stored in your browser only)."; msg.className = "form-msg ok"; form.reset();
  });
  const wa = document.getElementById("contact-wa");
  if (wa) wa.href = `https://wa.me/${ELZARA_CONFIG.whatsappNumber}?text=${encodeURIComponent(ELZARA_CONFIG.whatsappMessage)}`;
  document.querySelectorAll("[data-cfg]").forEach(el => { el.textContent = ELZARA_CONFIG[el.dataset.cfg]; });
}

/* ============================== BOOT ==================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderChrome();
  initGlobal();
  ELZ.updateCounts();
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "shop") initShop();
  if (page === "product") initProduct();
  if (page === "contact") initContact();
  if (page === "cart") ELZ.initCart();
  if (page === "wishlist") ELZ.initWishlist();
  if (page === "checkout") ELZ.initCheckout();
  if (page === "confirmation") ELZ.initConfirmation();
  ELZ.syncWishButtons();
  ELZ.refreshPrices();
  ELZ.checkBrokenImages();
});
