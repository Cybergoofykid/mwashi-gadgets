"use strict";

/* =========================================================
   MWASHI GADGETS
   STOREFRONT APP
   ========================================================= */

/* =========================================================
   CART
   ========================================================= */

let homeCart = [];

try {
    const storedCart = JSON.parse(
        localStorage.getItem("mwashiCart") || "[]"
    );

    homeCart = Array.isArray(storedCart)
        ? storedCart
        : [];
} catch (error) {
    console.error("Cart loading error:", error);
    homeCart = [];
    localStorage.removeItem("mwashiCart");
}


/* =========================================================
   DOM HELPERS
   ========================================================= */

function getProductGrid() {
    return document.getElementById("product-grid");
}

function getCartCountElement() {
    return document.getElementById("cart-count");
}


/* =========================================================
   SANITIZE INPUT
   ========================================================= */

function sanitizeInput(value) {
    if (typeof value !== "string") {
        return "";
    }

    return value
        .replace(/[<>]/g, "")
        .trim();
}


/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {
    const count = homeCart.reduce((total, item) => {
        return total + Math.max(
            1,
            Number(item.quantity) || 1
        );
    }, 0);

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = count;
    });

    const cartCount = getCartCountElement();

    if (cartCount) {
        cartCount.textContent = count;
    }
}


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {
    localStorage.setItem(
        "mwashiCart",
        JSON.stringify(homeCart)
    );

    updateCartCount();
}


/* =========================================================
   GET PRODUCT STARTING PRICE
   ========================================================= */

function getStartingPrice(product) {
    if (!product) {
        return 0;
    }

    /* Direct price */
    const directPrice = Number(product.price);

    if (!isNaN(directPrice) && directPrice > 0) {
        return directPrice;
    }

    /* Collect prices recursively */
    function collectPrices(value, results = []) {

        if (value === null || value === undefined) {
            return results;
        }

        if (typeof value === "number") {
            if (!isNaN(value) && value > 0) {
                results.push(value);
            }

            return results;
        }

        if (typeof value === "string") {
            const number = Number(value);

            if (!isNaN(number) && number > 0) {
                results.push(number);
            }

            return results;
        }

        if (Array.isArray(value)) {
            value.forEach(item => {
                collectPrices(item, results);
            });

            return results;
        }

        if (typeof value === "object") {
            Object.values(value).forEach(item => {
                collectPrices(item, results);
            });
        }

        return results;
    }

    /* New storage pricing */
    const storagePrices = collectPrices(
        product.storage
    );

    if (storagePrices.length > 0) {
        return Math.min(...storagePrices);
    }

    /* Legacy storage pricing */
    const legacyPrices = collectPrices(
        product.storage_prices
    );

    if (legacyPrices.length > 0) {
        return Math.min(...legacyPrices);
    }

    return 0;
}


/* =========================================================
   FORMAT PRICE
   ========================================================= */

function formatPrice(value) {
    const number = Number(value) || 0;

    return "TZS " + number.toLocaleString("en-TZ");
}


/* =========================================================
   ADD PRODUCT TO CART
   ========================================================= */

function add(id) {

    const productList = Array.isArray(window.products)
        ? window.products
        : [];

    const product = productList.find(
        item => String(item.id) === String(id)
    );

    if (!product) {
        console.error("Product not found:", id);
        alert("Product not found.");
        return;
    }

    /* Stock check */
    if (
        product.stock !== undefined &&
        product.stock !== null
    ) {
        const stock = Number(product.stock);

        if (!isNaN(stock) && stock <= 0) {
            alert(
                "Sorry, this product is currently out of stock."
            );

            return;
        }
    }

    /* Get real selling price */
    const productPrice =
        getStartingPrice(product);

    if (!productPrice || productPrice <= 0) {

        console.error(
            "Product has no valid price:",
            product
        );

        alert(
            "This product does not have a valid price yet."
        );

        return;
    }

    /* Check whether product already exists */
    const existing = homeCart.find(
        item => String(item.id) === String(id)
    );

    if (existing) {

        existing.quantity =
            (Number(existing.quantity) || 1) + 1;

        existing.price = productPrice;

    } else {

        homeCart.push({
            ...product,
            price: productPrice,
            quantity: 1
        });
    }

    /* Save */
    saveCart();

    console.log(
        "Product added to cart:",
        product.name,
        productPrice
    );

    alert("Product added to cart.");
}


/* =========================================================
   INSTALLMENT
   ========================================================= */

function applyInstallment(id) {

    const productList = Array.isArray(window.products)
        ? window.products
        : [];

    const product = productList.find(
        item => String(item.id) === String(id)
    );

    if (!product) {
        console.error("Product not found:", id);
        return;
    }

    const type =
        String(product.type || "").toLowerCase();

    const category =
        String(product.category || "").toLowerCase();

    const isAccessory =
        type === "accessory" ||
        type.includes("accessor") ||
        category.includes("accessor") ||
        category.includes("audio");

    if (isAccessory) {
        alert(
            "Installment payment is only available for smartphones."
        );

        return;
    }

    localStorage.setItem(
        "installmentProduct",
        JSON.stringify(product)
    );

    window.location.href = "installment.html";
}


/* =========================================================
   OPEN PRODUCT
   ========================================================= */

function openProduct(id) {

    const productList = Array.isArray(window.products)
        ? window.products
        : [];

    const product = productList.find(
        item => String(item.id) === String(id)
    );

    if (!product) {
        console.error("Product not found:", id);
        return;
    }

    window.location.href =
        "product.html?id=" +
        encodeURIComponent(id);
}


/* =========================================================
   DISPLAY PRODUCTS
   ========================================================= */

function displayProducts(list) {

    const grid = getProductGrid();

    if (!grid) {
        return;
    }

    if (!Array.isArray(list) || list.length === 0) {

        grid.innerHTML = `
            <div class="no-products">
                <h3>No products found</h3>
                <p>Try another search or category.</p>
            </div>
        `;

        return;
    }

    const cards = list.map(product => {

        const id = product.id;

        const name =
            sanitizeInput(
                product.name || "Product"
            );

        const brand =
            sanitizeInput(
                product.brand || ""
            );

        const category =
            sanitizeInput(
                product.category || ""
            );

        const image =
            product.image ||
            product.image_url ||
            "images/logo.png";

        const price =
            getStartingPrice(product);

        const stock =
            product.stock !== undefined &&
            product.stock !== null
                ? Number(product.stock)
                : null;

        const isOutOfStock =
            stock !== null &&
            !isNaN(stock) &&
            stock <= 0;

        /* Badge */
        let badge = "";

        if (product.badge) {

            badge = `
                <span class="badge">
                    ${sanitizeInput(product.badge)}
                </span>
            `;

        } else if (isOutOfStock) {

            badge = `
                <span class="badge">
                    OUT OF STOCK
                </span>
            `;
        }

        /* Stock status */
        let stockStatus = "";

        if (stock !== null && !isNaN(stock)) {

            if (stock <= 0) {

                stockStatus = `
                    <p class="stock-status">
                        Out of stock
                    </p>
                `;

            } else if (stock <= 5) {

                stockStatus = `
                    <p class="stock-status">
                        Only ${stock} left
                    </p>
                `;

            } else {

                stockStatus = `
                    <p class="stock-status">
                        In stock
                    </p>
                `;
            }

        } else {

            stockStatus = `
                <p class="stock-status">
                    Available
                </p>
            `;
        }

        /* Card */
        return `
            <article
                class="card"
                data-product-id="${id}"
            >

                ${badge}

                <button
                    class="wishlist"
                    type="button"
                    aria-label="Add ${name} to wishlist"
                    data-action="wishlist"
                    data-id="${id}"
                >
                    ♡
                </button>

                <img
                    class="product-image"
                    src="${image}"
                    alt="${name}"
                    width="260"
                    height="210"
                    loading="lazy"
                    decoding="async"
                >

                <h3>${name}</h3>

                ${
                    brand
                        ? `<p>${brand}</p>`
                        : ""
                }

                ${
                    category
                        ? `<p>${category}</p>`
                        : ""
                }

                <div class="price">
                    ${formatPrice(price)}
                </div>

                ${stockStatus}

                <div class="card-buttons">

                    <button
                        type="button"
                        class="details-btn"
                        data-action="details"
                        data-id="${id}"
                    >
                        View Details
                    </button>

                    <button
                        type="button"
                        class="cart-btn"
                        data-action="cart"
                        data-id="${id}"
                        ${isOutOfStock ? "disabled" : ""}
                    >
                        Add to Cart
                    </button>

                    ${
                        !String(category)
                            .toLowerCase()
                            .includes("access")
                            ? `
                                <button
                                    type="button"
                                    class="installment-btn"
                                    data-action="installment"
                                    data-id="${id}"
                                >
                                    Buy on Installment
                                </button>
                            `
                            : ""
                    }

                </div>

            </article>
        `;
    }).join("");

    grid.innerHTML = cards;
}


/* =========================================================
   FILTER PRODUCTS
   ========================================================= */

function filterProducts() {

    const productList =
        Array.isArray(window.products)
            ? window.products
            : [];

    const searchElement =
        document.getElementById("search");

    const searchValue =
        searchElement
            ? sanitizeInput(
                searchElement.value
            ).toLowerCase()
            : "";

    const activeButton =
        document.querySelector(
            ".category-btn.active"
        );

    let selectedCategory =
        activeButton
            ? activeButton.textContent
                .trim()
                .toLowerCase()
            : "all";

    /* Remove emojis/symbols */
    selectedCategory =
        selectedCategory
            .replace(/[^\p{L}\p{N}\s]/gu, "")
            .trim();

    const filtered =
        productList.filter(product => {

            const name =
                String(
                    product.name || ""
                ).toLowerCase();

            const brand =
                String(
                    product.brand || ""
                ).toLowerCase();

            const category =
                String(
                    product.category || ""
                ).toLowerCase();

            const searchableText =
                `${name} ${brand} ${category}`;

            /* Search */
            const matchesSearch =
                !searchValue ||
                searchableText.includes(
                    searchValue
                );

            /* Category */
            let matchesCategory = true;

            if (selectedCategory !== "all") {

                if (
                    selectedCategory.includes(
                        "apple"
                    )
                ) {

                    matchesCategory =
                        brand.includes("apple") ||
                        category.includes("apple") ||
                        name.includes("iphone") ||
                        name.includes("ipad");

                } else if (
                    selectedCategory.includes(
                        "samsung"
                    )
                ) {

                    matchesCategory =
                        brand.includes("samsung") ||
                        category.includes("samsung") ||
                        name.includes("samsung") ||
                        name.includes("galaxy");

                } else if (
                    selectedCategory.includes(
                        "pixel"
                    ) ||
                    selectedCategory.includes(
                        "google"
                    )
                ) {

                    matchesCategory =
                        brand.includes("google") ||
                        brand.includes("pixel") ||
                        category.includes("google") ||
                        category.includes("pixel") ||
                        name.includes("pixel");

                } else if (
                    selectedCategory.includes(
                        "audio"
                    )
                ) {

                    matchesCategory =
                        category.includes("audio");

                } else if (
                    selectedCategory.includes(
                        "accessories"
                    )
                ) {

                    matchesCategory =
                        category.includes("accessor");

                } else if (
                    selectedCategory.includes(
                        "tablet"
                    )
                ) {

                    matchesCategory =
                        category.includes("tablet") ||
                        name.includes("ipad") ||
                        name.includes("tablet");
                }
            }

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    displayProducts(filtered);
}


/* =========================================================
   SEARCH DEBOUNCE
   ========================================================= */

let searchTimer = null;

function handleSearch() {

    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
        filterProducts();
    }, 180);
}


/* =========================================================
   EVENT DELEGATION
   ========================================================= */

function setupProductEvents() {

    const grid = getProductGrid();

    if (!grid) {
        return;
    }

    grid.addEventListener("click", event => {

        const button =
            event.target.closest(
                "button[data-action]"
            );

        if (!button) {
            return;
        }

        const action =
            button.dataset.action;

        const id =
            button.dataset.id;

        if (!id) {
            return;
        }

        switch (action) {

            case "details":
                openProduct(id);
                break;

            case "cart":
                add(id);
                break;

            case "installment":
                applyInstallment(id);
                break;

            case "wishlist":
                button.classList.toggle(
                    "active"
                );
                break;
        }
    });
}


/* =========================================================
   CATEGORY BUTTONS
   ========================================================= */

function setupCategoryEvents() {

    const categoryButtons =
        document.querySelectorAll(
            ".category-btn"
        );

    categoryButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                categoryButtons.forEach(btn => {
                    btn.classList.remove(
                        "active"
                    );
                });

                button.classList.add(
                    "active"
                );

                filterProducts();
            }
        );
    });
}


/* =========================================================
   INITIALIZE APP
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

        setupProductEvents();

        setupCategoryEvents();

        const searchElement =
            document.getElementById("search");

        if (searchElement) {

            searchElement.addEventListener(
                "input",
                handleSearch
            );
        }

        if (
            Array.isArray(window.products) &&
            window.products.length > 0
        ) {

            filterProducts();
        }
    }
);


/* =========================================================
   PRODUCT LOAD EVENT
   ========================================================= */

window.addEventListener(
    "mwashiProductsLoaded",
    event => {

        const loadedProducts =
            event.detail &&
            Array.isArray(
                event.detail.products
            )
                ? event.detail.products
                : [];

        if (loadedProducts.length > 0) {
            filterProducts();
        }
    }
);