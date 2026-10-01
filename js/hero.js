```javascript
"use strict";

/*
=========================================================
MWASHI GADGETS
SUPABASE-DRIVEN HERO
=========================================================

The hero catalogue is NOT hard-coded.
It uses products loaded by js/products.js.

Only active Supabase products are considered.
Featured products are preferred, followed by latest
products, then all active products.
=========================================================
*/

let heroProducts = [];
let heroIndex = 0;

function getHeroProducts(products) {
    if (!Array.isArray(products)) {
        return [];
    }

    const active = products.filter(product => {
        return product &&
            product.active !== false &&
            product.image;
    });

    // Prefer featured products.
    const featured = active.filter(product => {
        return product.featured === true;
    });

    // If there are no featured products, use latest products.
    const latest = active.filter(product => {
        return product.latest === true;
    });

    const selected = featured.length > 0
        ? featured
        : (latest.length > 0 ? latest : active);

    return selected.slice(0, 10);
}

function getHeroPrice(product) {
    if (!product) {
        return 0;
    }

    const direct = Number(product.price);

    if (Number.isFinite(direct) && direct > 0) {
        return direct;
    }

    const prices = [];

    function collect(value) {
        if (value === null || value === undefined) {
            return;
        }

        if (typeof value === "number") {
            if (value > 0) {
                prices.push(value);
            }
            return;
        }

        if (typeof value === "string") {
            const number = Number(value);

            if (Number.isFinite(number) && number > 0) {
                prices.push(number);
            }

            return;
        }

        if (Array.isArray(value)) {
            value.forEach(collect);
            return;
        }

        if (typeof value === "object") {
            Object.values(value).forEach(collect);
        }
    }

    collect(product.storage);

    return prices.length ? Math.min(...prices) : 0;
}

function formatHeroPrice(product) {
    const price = getHeroPrice(product);

    if (!price) {
        return "Contact us for price";
    }

    return "From TZS " + price.toLocaleString("en-TZ");
}

function renderHeroProduct(product) {
    const image = document.getElementById("hero-image");
    const name = document.getElementById("hero-name");
    const price = document.getElementById("hero-price");

    if (!image || !name || !price || !product) {
        return;
    }

    image.src = product.image;
    image.alt = product.name || "Mwashi Gadgets product";
    name.textContent = product.name || "Mwashi Gadgets";
    price.textContent = formatHeroPrice(product);
}

function loadHeroProducts(products) {
    heroProducts = getHeroProducts(products);
    heroIndex = 0;

    if (heroProducts.length > 0) {
        renderHeroProduct(heroProducts[0]);
    }
}

// Receive products after js/products.js finishes loading.
window.addEventListener("mwashiProductsLoaded", event => {
    loadHeroProducts(event.detail?.products || []);
});

// Handle cases where products loaded before this script ran.
document.addEventListener("DOMContentLoaded", () => {
    if (Array.isArray(window.products) && window.products.length > 0) {
        loadHeroProducts(window.products);
    }
});

// Automatically rotate hero products every 4 seconds.
setInterval(() => {
    if (heroProducts.length < 2) {
        return;
    }

    heroIndex = (heroIndex + 1) % heroProducts.length;
    renderHeroProduct(heroProducts[heroIndex]);
}, 4000);
```
