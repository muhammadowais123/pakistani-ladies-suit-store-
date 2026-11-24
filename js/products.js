/* =====================================================================
   ELZARA — js/products.js
   ---------------------------------------------------------------------
   THE ONE FILE YOU EDIT FOR: products, prices, images, store settings.
   Every page (home, shop, product, cart, wishlist, checkout, order
   confirmation) reads prices from here. Change a price here → it changes
   everywhere. Discount % is calculated automatically.
   Also contains shared helpers used by all other scripts.
   ===================================================================== */
"use strict";
window.ELZ = window.ELZ || {};

/* ------------------------- STORE SETTINGS ----------------------------- */
const ELZARA_CONFIG = {
  brand: "ELZARA",
  tagline: "Elegance That Defines You.",
  whatsappNumber: "923001234567",          // PLACEHOLDER — digits only, with country code
  whatsappMessage: "Hello ELZARA! I would like to know more about your collection.",
  email: "hello@elzara.example",           // PLACEHOLDER
  phone: "+92 300 1234567",                // PLACEHOLDER
  address: "Gulberg III, Lahore, Pakistan",// PLACEHOLDER
  usdRate: 280,                            // 1 USD = 280 PKR  → edit to update USD prices everywhere
  freeShippingOver: 8000,                  // PKR. Orders above this ship free
  shippingFee: 350,                        // PKR flat fee below that amount
  videoPath: "videos/elzara-fashion.mp4",  // replace this file with your own video
  videoPoster: "images/banners/video-poster.jpg",
  videoLookProductId: "ELZ-012",           // product linked from "Shop This Look"
  promos: [                                // homepage discount slider
    { eyebrow: "Winter Lawn Edit", title: "Up to 30% Off Lawn Suits", text: "Light, breathable prints for every day.", link: "shop.html?cat=Lawn%20Suits", cta: "Shop Lawn" },
    { eyebrow: "Wedding Season", title: "The Festive & Formal Edit", text: "Gharara, peshwas and organza for the season of celebrations.", link: "shop.html?cat=Festive%20Collection", cta: "Shop Festive" },
    { eyebrow: "Delivered Worldwide", title: "Free Shipping Above PKR 8,000", text: "Complimentary delivery across Pakistan, shipping worldwide.", link: "shop.html", cta: "Start Shopping" }
  ]
};

const CATEGORIES = ["Lawn Suits", "Luxury Lawn", "Chiffon Suits", "Embroidered Suits", "Casual Wear", "Formal Wear", "Festive Collection"];

/* Colour names → swatch colours (use these names in product "colors") */
const PALETTE = {
  "Ivory": "#F4EEE2", "Black": "#1A1A1A", "Sage": "#A9B79E", "Blush": "#E8C9C1", "Champagne": "#E6D3B0",
  "Navy": "#1F2A44", "Emerald": "#1F5D4B", "Maroon": "#6B1F2A", "Dusty Rose": "#C99AA0", "Teal": "#2F6F73",
  "Mint": "#BFD8C8", "Peach": "#F0C9AE", "Mustard": "#C9A24B", "Lilac": "#BBA8CC", "Sky": "#A9C4DA",
  "Gold": "#B8975A", "Rust": "#A2553A", "Pearl": "#EDE8E0", "Taupe": "#A79886"
};

/* ------------------------- PRODUCT BUILDER ---------------------------- */
/* Fills in defaults + calculates price/discount. You rarely need to touch this. */
function P(o) {
  const ext = (o.image.match(/\.\w+$/) || [".jpg"])[0];
  const base = o.image.replace(/\.\w+$/, "");
  const p = Object.assign({
    sizes: o.type === "unstitched" ? ["Unstitched"] : ["XS", "S", "M", "L", "XL"],
    rating: 4.6, reviews: 20, stock: 10, isNew: false, bestSeller: false, salePrice: null,
    gallery: [o.image, base + "-2" + ext, base + "-3" + ext]
  }, o);
  p.image = ELZ.imgPath(p.image);
  p.gallery = p.gallery.map(ELZ.imgPath);
  p.colors = p.colors.map(n => ({ name: n, hex: PALETTE[n] || "#cccccc" }));
  p.price = (p.salePrice && p.salePrice < p.originalPrice) ? p.salePrice : p.originalPrice; // price actually charged
  p.discount = p.price < p.originalPrice ? Math.round((1 - p.price / p.originalPrice) * 100) : 0; // auto %
  p.inStock = p.stock > 0;
  return p;
}
/* Image helper: a bare file name lives in images/products/. Full URLs (https://…) also work. */
ELZ.imgPath = f => /^(https?:|data:|images\/|\/)/.test(f) ? f : "images/products/" + f;

/* =====================================================================
   PRODUCT CATALOG  — add / edit / remove products here.
   Fields: id, name, category, type ("stitched"|"unstitched"), fabric,
   image (+ optional gallery[]), originalPrice, salePrice (null = no sale),
   description, sizes[], colors[], rating, reviews, stock, isNew, bestSeller
   Images: drop elz-001.jpg, elz-001-2.jpg, elz-001-3.jpg into images/products/
   ===================================================================== */
const PRODUCTS = [
  /* ---------------- LAWN SUITS ---------------- */
  P({ id: "ELZ-001", name: "Mehrab Floral Lawn 3-Piece", category: "Lawn Suits", type: "unstitched", image: "elz-001.jpg",
      fabric: "Printed lawn shirt (3 m) · Printed lawn dupatta (2.5 m) · Dyed cambric trouser (2.5 m)",
      originalPrice: 6990, salePrice: 5490, colors: ["Ivory", "Sage", "Blush"], rating: 4.7, reviews: 86, stock: 18, bestSeller: true,
      description: "A softly romantic floral print on breathable premium lawn, framed by a coordinated dupatta. Light enough for all-day wear, polished enough for gatherings." }),
  P({ id: "ELZ-002", name: "Noor Digital Print Lawn", category: "Lawn Suits", type: "stitched", image: "elz-002.jpg",
      fabric: "Digital-print lawn shirt · Lawn dupatta · Cambric trouser",
      originalPrice: 5990, salePrice: 4690, colors: ["Sky", "Peach", "Ivory"], rating: 4.5, reviews: 54, stock: 22, isNew: true,
      description: "Crisp digital prints with a clean, tailored silhouette. Ready to wear straight out of the box." }),
  P({ id: "ELZ-003", name: "Zeba Block-Print Lawn", category: "Lawn Suits", type: "unstitched", image: "elz-003.jpg",
      fabric: "Block-print lawn shirt · Lawn dupatta · Dyed trouser",
      originalPrice: 4990, salePrice: 4290, colors: ["Mustard", "Rust", "Ivory"], rating: 4.4, reviews: 41, stock: 30,
      description: "Inspired by traditional hand block printing, in warm earthy tones with a timeless repeat pattern." }),
  P({ id: "ELZ-004", name: "Sahar Pastel Lawn Set", category: "Lawn Suits", type: "stitched", image: "elz-004.jpg",
      fabric: "Embroidered-neckline lawn shirt · Voile dupatta · Cotton trouser",
      originalPrice: 7490, salePrice: 5990, colors: ["Mint", "Lilac", "Blush"], rating: 4.6, reviews: 67, stock: 9, bestSeller: true, isNew: true,
      description: "Soft pastel tones with delicate neckline embroidery — a gentle, graceful everyday luxury." }),

  /* ---------------- LUXURY LAWN ---------------- */
  P({ id: "ELZ-005", name: "Gulbahar Luxury Lawn", category: "Luxury Lawn", type: "unstitched", image: "elz-005.jpg",
      fabric: "Embroidered luxury lawn shirt · Silk-blend printed dupatta · Dyed trouser",
      originalPrice: 14500, salePrice: 11900, colors: ["Emerald", "Ivory"], rating: 4.8, reviews: 112, stock: 14, bestSeller: true,
      description: "Rich embroidery on premium lawn with a flowing silk-blend dupatta. A statement suit for the season." }),
  P({ id: "ELZ-006", name: "Mehr-un-Nisa Schiffli Lawn", category: "Luxury Lawn", type: "unstitched", image: "elz-006.jpg",
      fabric: "Schiffli-embroidered lawn shirt · Organza border · Net dupatta · Raw-silk trouser",
      originalPrice: 16900, salePrice: 13500, colors: ["Pearl", "Sage", "Dusty Rose"], rating: 4.9, reviews: 98, stock: 7, bestSeller: true,
      description: "Fine schiffli work with an organza border detail. Airy, graceful and unmistakably luxe." }),
  P({ id: "ELZ-007", name: "Aabish Embroidered Luxury Lawn", category: "Luxury Lawn", type: "stitched", image: "elz-007.jpg",
      fabric: "Embroidered lawn shirt · Embroidered chiffon dupatta · Cambric trouser",
      originalPrice: 18500, salePrice: 14900, colors: ["Navy", "Teal"], rating: 4.6, reviews: 45, stock: 5, isNew: true,
      description: "Deep jewel tones with intricate thread embroidery, tailored in a refined A-line cut." }),

  /* ---------------- CHIFFON SUITS ---------------- */
  P({ id: "ELZ-008", name: "Roshni Chiffon 3-Piece", category: "Chiffon Suits", type: "stitched", image: "elz-008.jpg",
      fabric: "Embroidered chiffon shirt · Chiffon dupatta · Raw-silk trouser",
      originalPrice: 21900, salePrice: 17500, colors: ["Blush", "Champagne", "Emerald"], rating: 4.7, reviews: 73, stock: 11, bestSeller: true,
      description: "Fluid chiffon with delicate sequin-and-thread detailing that catches the light beautifully." }),
  P({ id: "ELZ-009", name: "Nilofar Printed Chiffon", category: "Chiffon Suits", type: "unstitched", image: "elz-009.jpg",
      fabric: "Printed chiffon shirt · Chiffon dupatta · Dyed trouser",
      originalPrice: 12900, salePrice: 9900, colors: ["Sky", "Lilac"], rating: 4.5, reviews: 38, stock: 16,
      description: "Watercolour-inspired prints on feather-light chiffon for effortless daytime elegance." }),
  P({ id: "ELZ-010", name: "Parizaad Embroidered Chiffon", category: "Chiffon Suits", type: "stitched", image: "elz-010.jpg",
      fabric: "Hand-finished embroidered chiffon shirt · Net dupatta · Silk trouser",
      originalPrice: 27500, salePrice: 22000, colors: ["Maroon", "Navy"], rating: 4.8, reviews: 59, stock: 6, isNew: true,
      description: "Heavily embroidered borders on rich chiffon — made for evening events and family celebrations." }),

  /* ---------------- EMBROIDERED SUITS ---------------- */
  P({ id: "ELZ-011", name: "Zarqa Embroidered Organza", category: "Embroidered Suits", type: "unstitched", image: "elz-011.jpg",
      fabric: "Embroidered organza shirt · Embroidered net dupatta · Raw-silk trouser",
      originalPrice: 32500, salePrice: 26500, colors: ["Champagne", "Pearl"], rating: 4.9, reviews: 64, stock: 8, bestSeller: true,
      description: "Delicate organza with all-over zari and thread embroidery for a luminous, heirloom finish." }),
  P({ id: "ELZ-012", name: "Mah-e-Noor Embroidered Suit", category: "Embroidered Suits", type: "stitched", image: "elz-012.jpg",
      fabric: "Embroidered organza shirt · Embroidered dupatta · Raw-silk trouser",
      originalPrice: 36500, salePrice: 29500, colors: ["Ivory", "Champagne", "Black"], rating: 4.9, reviews: 91, stock: 10, bestSeller: true, isNew: true,
      description: "Our signature piece: intricate embroidery, a graceful flare and a dupatta with a hand-finished border." }),
  P({ id: "ELZ-013", name: "Dilnaz Thread-Work Cotton-Net", category: "Embroidered Suits", type: "unstitched", image: "elz-013.jpg",
      fabric: "Thread-work cotton-net shirt · Net dupatta · Dyed trouser",
      originalPrice: 19900, salePrice: 16900, colors: ["Teal", "Rust"], rating: 4.4, reviews: 27, stock: 12,
      description: "Understated thread-work on breathable cotton-net, ideal for daytime functions." }),

  /* ---------------- CASUAL WEAR ---------------- */
  P({ id: "ELZ-014", name: "Aaliya Cotton Co-ord Set", category: "Casual Wear", type: "stitched", image: "elz-014.jpg",
      fabric: "Premium cotton shirt · Cotton trouser",
      originalPrice: 6500, salePrice: null, colors: ["Taupe", "Sage", "Black"], rating: 4.5, reviews: 52, stock: 25, isNew: true,
      description: "A relaxed, modern co-ord in soft cotton. Dress it up with a dupatta or wear it just as it is." }),
  P({ id: "ELZ-015", name: "Sana Linen Kurta", category: "Casual Wear", type: "stitched", image: "elz-015.jpg",
      fabric: "Pure linen kurta",
      originalPrice: 4800, salePrice: 3990, colors: ["Pearl", "Navy"], rating: 4.3, reviews: 36, stock: 30,
      description: "A clean, minimal linen kurta with pintuck detailing. Pair with trousers or a straight shalwar." }),
  P({ id: "ELZ-016", name: "Hoor Khaddar Winter Suit", category: "Casual Wear", type: "unstitched", image: "elz-016.jpg",
      fabric: "Printed khaddar shirt · Wool-blend shawl · Khaddar trouser",
      originalPrice: 7900, salePrice: 6490, colors: ["Maroon", "Mustard"], rating: 4.6, reviews: 48, stock: 20, isNew: true, bestSeller: true,
      description: "Warm, textured khaddar with a coordinated shawl — everyday comfort for the cooler months." }),

  /* ---------------- FORMAL WEAR ---------------- */
  P({ id: "ELZ-017", name: "Mehreen Raw Silk Formal", category: "Formal Wear", type: "stitched", image: "elz-017.jpg",
      fabric: "Raw-silk embroidered shirt · Organza dupatta · Raw-silk trouser",
      originalPrice: 24900, salePrice: 19900, colors: ["Black", "Emerald"], rating: 4.7, reviews: 33, stock: 6,
      description: "Structured raw silk with refined embroidery — a confident choice for dinners and formal evenings." }),
  P({ id: "ELZ-018", name: "Laiba Velvet Shawl Suit", category: "Formal Wear", type: "stitched", image: "elz-018.jpg",
      fabric: "Embroidered velvet shirt · Velvet shawl · Silk trouser",
      originalPrice: 34900, salePrice: 27900, colors: ["Maroon", "Navy"], rating: 4.8, reviews: 29, stock: 4, isNew: true,
      description: "Plush velvet with gold-tone embroidery and a statement shawl for winter weddings." }),
  P({ id: "ELZ-019", name: "Hania Jacquard Formal Set", category: "Formal Wear", type: "unstitched", image: "elz-019.jpg",
      fabric: "Jacquard shirt · Silk dupatta · Jacquard trouser",
      originalPrice: 15900, salePrice: 12900, colors: ["Champagne", "Taupe"], rating: 4.5, reviews: 31, stock: 0,
      description: "Woven jacquard with a subtle sheen. Currently sold out — update stock in products.js when restocked." }),

  /* ---------------- FESTIVE COLLECTION ---------------- */
  P({ id: "ELZ-020", name: "Shaadi Season Gharara Set", category: "Festive Collection", type: "stitched", image: "elz-020.jpg",
      fabric: "Embroidered short shirt · Embellished gharara · Net dupatta",
      originalPrice: 38900, salePrice: 31500, colors: ["Peach", "Mint", "Dusty Rose"], rating: 4.8, reviews: 57, stock: 7, bestSeller: true,
      description: "A modern take on the classic gharara with hand-finished embellishment, made for celebrations." }),
  P({ id: "ELZ-021", name: "Shehnai Festive Edit", category: "Festive Collection", type: "stitched", image: "elz-021.jpg",
      fabric: "Heavily embroidered shirt · Embellished lehnga · Net dupatta",
      originalPrice: 58900, salePrice: 49500, colors: ["Maroon", "Gold"], rating: 4.9, reviews: 41, stock: 3, isNew: true,
      description: "Our most opulent festive piece — rich embroidery, a sweeping flare and a dupatta fit for the dance floor." }),
  P({ id: "ELZ-022", name: "Jashn Festive Chiffon Peshwas", category: "Festive Collection", type: "stitched", image: "elz-022.jpg",
      fabric: "Embroidered chiffon peshwas · Silk trouser · Net dupatta",
      originalPrice: 29900, salePrice: 24500, colors: ["Emerald", "Blush"], rating: 4.6, reviews: 38, stock: 9,
      description: "A flowing peshwas silhouette with embroidered borders and a graceful movement." }),
  P({ id: "ELZ-023", name: "Rang-e-Bahar Festive Lawn", category: "Festive Collection", type: "unstitched", image: "elz-023.jpg",
      fabric: "Embroidered lawn shirt · Printed silk dupatta · Dyed trouser",
      originalPrice: 11900, salePrice: 9500, colors: ["Lilac", "Mustard"], rating: 4.5, reviews: 44, stock: 15, isNew: true,
      description: "Vibrant yet refined festive lawn with embroidered motifs — perfect for mehndi and dholki." }),
  P({ id: "ELZ-024", name: "Nazakat Organza Festive 3-Piece", category: "Festive Collection", type: "unstitched", image: "elz-024.jpg",
      fabric: "Embroidered organza shirt · Organza dupatta · Silk trouser",
      originalPrice: 22900, salePrice: 18900, colors: ["Sky", "Blush"], rating: 4.7, reviews: 26, stock: 13,
      description: "Ethereal organza with fine embroidery and a soft sheen — a graceful festive look." })
];

/* Sample reviews (demo text — replace with real customer reviews later) */
const ELZ_REVIEWS = [
  { name: "Ayesha K.", city: "Lahore", rating: 5, text: "The fabric feels luxurious and the embroidery is beautifully finished. Exactly as pictured." },
  { name: "Hira M.", city: "Karachi", rating: 5, text: "Perfect fit and fast delivery. I received so many compliments at the wedding." },
  { name: "Sana R.", city: "Islamabad", rating: 4, text: "Lovely colours and a soft, breathable lawn. The dupatta is gorgeous." },
  { name: "Mariam A.", city: "Dubai", rating: 5, text: "Shipping to the UAE was smooth and the packaging felt premium. Will order again." },
  { name: "Zainab F.", city: "London", rating: 5, text: "Elegant and true to size. The stitching quality is far above what I expected." },
  { name: "Noor S.", city: "Faisalabad", rating: 4, text: "Beautiful design and great value. The chiffon drapes wonderfully." },
  { name: "Fatima T.", city: "Toronto", rating: 5, text: "Authentic Pakistani craftsmanship. The embroidery detail is stunning in person." },
  { name: "Rabia H.", city: "Multan", rating: 5, text: "Customer service helped me choose a size over WhatsApp. Very kind and quick." }
];

/* =====================================================================
   SHARED HELPERS  (used by every page)
   ===================================================================== */
ELZ.esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
ELZ.byId = id => PRODUCTS.find(p => p.id === id);
ELZ.slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* Safe localStorage wrapper */
ELZ.store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked */ } }
};

/* Currency: PKR (primary) / USD */
ELZ.currency = () => ELZ.store.get("elz_currency", "PKR");
ELZ.price = pkr => ELZ.currency() === "USD"
  ? "$" + (pkr / ELZARA_CONFIG.usdRate).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  : "PKR " + Math.round(pkr).toLocaleString("en-US");
/* Price element that updates itself when the currency switcher changes */
ELZ.priceTag = pkr => `<span class="js-price" data-pkr="${pkr}">${ELZ.price(pkr)}</span>`;
ELZ.refreshPrices = () => document.querySelectorAll(".js-price").forEach(el => { el.textContent = ELZ.price(+el.dataset.pkr); });

/* Icons (inline SVG) */
const ic = (d, extra = "") => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
ELZ.icons = {
  search: ic('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  user: ic('<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7"/>'),
  heart: ic('<path d="M12 20.5s-7.5-4.6-9.2-9.3C1.7 8 3.6 5 6.8 5c2 0 3.6 1.1 5.2 3 1.6-1.9 3.2-3 5.2-3 3.2 0 5.1 3 4 6.2-1.7 4.7-9.2 9.3-9.2 9.3z"/>'),
  bag: ic('<path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'),
  menu: ic('<path d="M3 6h18M3 12h18M3 18h18"/>'),
  close: ic('<path d="M5 5l14 14M19 5 5 19"/>'),
  up: ic('<path d="M12 19V5M5 12l7-7 7 7"/>'),
  play: ic('<path d="M8 5v14l11-7z" fill="currentColor"/>'),
  trash: ic('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  whatsapp: ic('<path d="M3 21l1.6-4.8A9 9 0 1 1 8 19.4z"/><path d="M9.2 8.6c-.4 1.8.9 4 2.6 5.2 1.3.9 2.6 1.100 3.5.4l.5-.9-1.8-1-.9.7c-.9-.4-1.900-1.3-2.3-2.3l.7-.9-.9-1.8z"/>')
};

/* Star rating text */
ELZ.stars = r => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

/* Fallback image (elegant SVG placeholder) — used when a picture is missing or fails to load.
   Replace demo images with your own photos; this placeholder then never appears. */
ELZ.placeholder = (label = "ELZARA", sub = "Demo image — replace with your photo", wide = false, bare = false) => {
  const tones = ["#EADFCC", "#E2D5BF", "#EFE6D6", "#DFD0B8", "#E8DCC8"];
  let h = 0; for (const ch of label) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const bg = tones[h % tones.length], W = wide ? 1600 : 800, H = wide ? 900 : 1000, cx = W / 2, cy = H / 2 - 40;
  if (bare) { /* quiet dark panel for full-bleed banners that carry their own text */
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#2b2621"/><rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#B8975A" stroke-width="2" opacity=".35"/><text x="${W - 60}" y="${H - 50}" text-anchor="end" font-family="Arial,sans-serif" font-size="18" letter-spacing="3" fill="#8a7d68">DEMO BANNER — REPLACE THIS IMAGE</text></svg>`);
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="${bg}"/>` +
    `<rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#B8975A" stroke-width="2" opacity=".6"/>` +
    `<g fill="none" stroke="#9a7b43" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" opacity=".75" transform="translate(${cx} ${cy})">` +
    `<path d="M0-90c-14 0-14-22 0-22 10 0 12 12 4 16L0-70"/><path d="M0-70 -78 -8c-8 7-4 14 6 14H72c10 0 14-7 6-14z"/></g>` +
    `<text x="${cx}" y="${H - 130}" text-anchor="middle" font-family="Georgia,serif" font-size="${wide ? 40 : 34}" fill="#1d1b19">${ELZ.esc(label).slice(0, 34)}</text>` +
    `<text x="${cx}" y="${H - 86}" text-anchor="middle" font-family="Arial,sans-serif" font-size="${wide ? 22 : 20}" letter-spacing="3" fill="#7a7268">${ELZ.esc(sub).toUpperCase().slice(0, 44)}</text>` +
    `<text x="${cx}" y="82" text-anchor="middle" font-family="Georgia,serif" font-size="30" letter-spacing="10" fill="#B8975A">ELZARA</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};
ELZ.fixImg = img => {
  if (img.dataset.fb) return;
  img.dataset.fb = "1";
  img.src = ELZ.placeholder(img.dataset.label || img.alt || "ELZARA", img.dataset.sub || "Demo image — replace with your photo", img.dataset.ph === "wide" || img.dataset.ph === "bare", img.dataset.ph === "bare");
};
/* Image error handlers must be attached from JS (no inline handlers in HTML) */
document.addEventListener("error", e => { if (e.target && e.target.tagName === "IMG") ELZ.fixImg(e.target); }, true);
ELZ.checkBrokenImages = (root = document) => root.querySelectorAll("img").forEach(i => { if (i.complete && i.naturalWidth === 0 && i.getAttribute("src")) ELZ.fixImg(i); });

/* Product card (shared by home, shop, wishlist, related products) */
ELZ.card = p => `
<article class="p-card" data-id="${p.id}">
  <div class="p-card__media">
    <a href="product.html?id=${p.id}" aria-label="${ELZ.esc(p.name)}"><img loading="lazy" src="${p.image}" alt="${ELZ.esc(p.name)}" data-label="${ELZ.esc(p.name)}"></a>
    <div class="p-card__badges">
      ${p.discount ? `<span class="badge badge-sale">-${p.discount}%</span>` : ""}
      ${p.isNew ? `<span class="badge badge-new">New</span>` : ""}
      ${!p.inStock ? `<span class="badge badge-out">Sold Out</span>` : ""}
    </div>
    <button class="p-card__wish" data-wish="${p.id}" aria-label="Add to wishlist" type="button">${ELZ.icons.heart}</button>
  </div>
  <div class="p-card__body">
    <span class="p-card__cat">${ELZ.esc(p.category)}</span>
    <h3 class="p-card__name"><a href="product.html?id=${p.id}">${ELZ.esc(p.name)}</a></h3>
    <div class="rating" title="${p.rating} / 5"><span class="stars">${ELZ.stars(p.rating)}</span> <small>(${p.reviews})</small></div>
    <div class="price"><span class="price-now">${ELZ.priceTag(p.price)}</span>${p.discount ? `<s class="price-was">${ELZ.priceTag(p.originalPrice)}</s>` : ""}</div>
    <button class="btn btn-outline btn-sm btn-block" data-quick-add="${p.id}" type="button" ${p.inStock ? "" : "disabled"}>${p.inStock ? "Quick Add" : "Sold Out"}</button>
  </div>
</article>`;

/* Reviews helper: picks sample reviews deterministically per product */
ELZ.reviewsFor = (id, n = 3) => {
  const start = parseInt(id.replace(/\D/g, ""), 10) || 0;
  return Array.from({ length: n }, (_, i) => ELZ_REVIEWS[(start + i * 3) % ELZ_REVIEWS.length]);
};
