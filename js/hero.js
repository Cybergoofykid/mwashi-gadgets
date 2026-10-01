<<<<<<< HEAD
"use strict";

/*
=========================================================
MWASHI GADGETS
SUPABASE-DRIVEN HERO
=========================================================

The hero catalogue is NOT hard-coded.
It uses products loaded by js/products.js.
Only active Supabase products are considered.
=========================================================
*/

let heroProducts = [];
let heroIndex = 0;

function getHeroProducts(products) {
    if (!Array.isArray(products)) {
        return [];
    }

    const active = products.filter(product => {
        return product && product.active !== false && product.image;
    });

    // Prefer featured products; if none exist, use latest products.
    const featured = active.filter(product => product.featured === true);
    const latest = active.filter(product => product.latest === true);

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
        if (value === null || value === undefined) return;

        if (typeof value === "number") {
            if (value > 0) prices.push(value);
            return;
        }

        if (typeof value === "string") {
            const number = Number(value);
            if (Number.isFinite(number) && number > 0) prices.push(number);
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

window.addEventListener("mwashiProductsLoaded", event => {
    loadHeroProducts(event.detail?.products || []);
});

document.addEventListener("DOMContentLoaded", () => {
    // Handles cases where products finished loading before this script ran.
    if (Array.isArray(window.products) && window.products.length > 0) {
        loadHeroProducts(window.products);
    }
});

setInterval(() => {
    if (heroProducts.length < 2) {
        return;
    }

    heroIndex = (heroIndex + 1) % heroProducts.length;
    renderHeroProduct(heroProducts[heroIndex]);
}, 4000);
=======
const heroProducts = [

{
name:"iPhone 17 Pro",
price:"From TZS 3,800,000",
image:"images/apple/17-pro.webp"
},


{
name:"Samsung Galaxy S26 Ultra",
price:"From TZS 2,700,000",
image:"images/samsung/26-ULTRA.webp"
},


{
name:"Google Pixel 10 Pro",
price:"From TZS 2,900,000",
image:"images/pixel/pixel10pro.webp"
}


];


let heroIndex = 0;


function changeHeroProduct(){


const product = heroProducts[heroIndex];


document.getElementById("hero-image").src =
product.image;


document.getElementById("hero-name").textContent =
product.name;


document.getElementById("hero-price").textContent =
product.price;



heroIndex++;


if(heroIndex >= heroProducts.length){

heroIndex=0;

}


}



setInterval(changeHeroProduct,4000);
>>>>>>> 9b90dc5dbddaf105b4e6afdb9327c233a7c59b9a
