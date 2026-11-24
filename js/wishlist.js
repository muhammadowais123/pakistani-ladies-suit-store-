/* =====================================================================
   ELZARA — js/wishlist.js
   Wishlist logic (localStorage key: elz_wishlist) + wishlist page.
   Stores only product IDs, so prices always come from products.js.
   ===================================================================== */
"use strict";

ELZ.wishlist = {
  key: "elz_wishlist",
  get() { return ELZ.store.get(this.key, []); },
  has(id) { return this.get().includes(id); },
  save(list) { ELZ.store.set(this.key, list); ELZ.updateCounts(); ELZ.syncWishButtons(); },
  toggle(id) {
    const list = this.get(), p = ELZ.byId(id);
    if (!p) return;
    const i = list.indexOf(id);
    if (i > -1) { list.splice(i, 1); ELZ.toast("Removed from wishlist"); }
    else { list.push(id); ELZ.toast(`"${p.name}" saved to wishlist`); }
    this.save(list);
    if (document.body.dataset.page === "wishlist") ELZ.initWishlist();
  },
  remove(id) {
    this.save(this.get().filter(x => x !== id));
    ELZ.toast("Removed from wishlist");
    if (document.body.dataset.page === "wishlist") ELZ.initWishlist();
  },
  /* Move to cart uses the first size/colour. Customers can change both in the cart page via the product link. */
  moveToCart(id) {
    const p = ELZ.byId(id);
    if (!p || !p.inStock) { ELZ.toast("Sorry, this item is sold out"); return; }
    if (ELZ.cart.add(id, { silent: true })) {
      this.save(this.get().filter(x => x !== id));
      ELZ.toast(`Moved to cart (size ${p.sizes[0]}, ${p.colors[0].name})`);
      if (document.body.dataset.page === "wishlist") ELZ.initWishlist();
    }
  }
};

/* Highlight hearts for saved products */
ELZ.syncWishButtons = () => {
  const list = ELZ.wishlist.get();
  document.querySelectorAll("[data-wish]").forEach(b => {
    const on = list.includes(b.dataset.wish);
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on);
    if (b.dataset.wishLabel !== undefined) b.querySelector(".wish-text").textContent = on ? "Saved to Wishlist" : "Add to Wishlist";
  });
};

/* Wishlist page */
ELZ.initWishlist = () => {
  const root = document.getElementById("wishlist-root");
  if (!root) return;
  const items = ELZ.wishlist.get().map(ELZ.byId).filter(Boolean);
  if (!items.length) {
    root.innerHTML = `<div class="empty"><div class="empty__icon">${ELZ.icons.heart}</div><h2>Your wishlist is empty</h2><p>Save the pieces you love and find them here later.</p><a class="btn btn-dark" href="shop.html">Discover the Collection</a></div>`;
    return;
  }
  root.innerHTML = `<p class="muted">${items.length} saved item${items.length > 1 ? "s" : ""}</p>
    <div class="grid-products">${items.map(p => `
      <div class="wish-item">${ELZ.card(p).replace(/<button class="btn btn-outline btn-sm btn-block"[\s\S]*?<\/button>/, "")}
        <div class="wish-item__actions">
          <button class="btn btn-dark btn-sm" data-move-cart="${p.id}" type="button" ${p.inStock ? "" : "disabled"}>Move to Cart</button>
          <button class="btn btn-outline btn-sm" data-wish-remove="${p.id}" type="button">Remove</button>
        </div></div>`).join("")}</div>`;
  ELZ.syncWishButtons();
  ELZ.checkBrokenImages(root);
};

/* Wishlist page click handling */
document.addEventListener("click", e => {
  const mv = e.target.closest("[data-move-cart]"), rm = e.target.closest("[data-wish-remove]");
  if (mv) ELZ.wishlist.moveToCart(mv.dataset.moveCart);
  if (rm) ELZ.wishlist.remove(rm.dataset.wishRemove);
});
