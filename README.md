# ELZARA — Elegance That Defines You.

Static website: HTML + CSS + vanilla JavaScript. No build step, no frameworks.

## Run locally
- Quick: double-click `index.html`.
- Recommended (VS Code): install the "Live Server" extension → right-click `index.html` → "Open with Live Server".
- Or: open a terminal in this folder and run `python -m http.server 8000`, then visit http://localhost:8000

## Change prices / products (ONE file: `js/products.js`)
Edit `originalPrice` and `salePrice` of any product. Set `salePrice: null` for no discount.
The discount % is calculated automatically, and every page updates. USD rate: `ELZARA_CONFIG.usdRate`.
Add a product: copy a `P({ ... })` block, give it a new unique `id`.

## Replace product images
Put files in `images/products/` named after the product, e.g. for `ELZ-001`:
`elz-001.jpg` (main), `elz-001-2.jpg`, `elz-001-3.jpg` (gallery). Or set `image: "https://…"` / `gallery: [...]` in products.js.
Until a file exists, an elegant "Demo image" placeholder is shown automatically.
Banners: `images/banners/hero.jpg`, `brand-story.jpg`, `about.jpg`, `video-poster.jpg`, and one per category
(`cat-lawn-suits.jpg`, `cat-luxury-lawn.jpg`, `cat-chiffon-suits.jpg`, `cat-embroidered-suits.jpg`, `cat-casual-wear.jpg`, `cat-formal-wear.jpg`, `cat-festive-collection.jpg`).

## Replace the fashion video
Save your MP4 (H.264/AAC) as `videos/elzara-fashion.mp4`. Optional poster: `images/banners/video-poster.jpg`.
The "Shop This Look" product is `videoLookProductId` in `js/products.js`.

## Placeholders to replace
WhatsApp number, email, phone, address (`ELZARA_CONFIG` in products.js) · all demo images · video · sample reviews (`ELZ_REVIEWS`) ·
size chart (product.html) · policies text · map box (contact.html).
Checkout is a demo (Cash on Delivery, stored in browser localStorage only) — no payment gateway.
