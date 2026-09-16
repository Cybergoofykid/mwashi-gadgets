"use strict";

/*
=========================================================
MWASHI GADGETS
PRODUCT DETAILS + CONFIGURATION + CART
=========================================================
*/

const CART_STORAGE_KEY = "mwashiCart";


/* =====================================================
   PRODUCT ID
===================================================== */

const params = new URLSearchParams(
    window.location.search
);

const productId = Number(
    params.get("id")
);


/* =====================================================
   CART
===================================================== */

let cart = [];

try {

    const storedCart = JSON.parse(
        localStorage.getItem(CART_STORAGE_KEY) || "[]"
    );

    cart = Array.isArray(storedCart)
        ? storedCart
        : [];

} catch (error) {

    console.error("Cart loading error:", error);

    cart = [];

}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart() {

    localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();
}


/* =====================================================
   CART COUNT
===================================================== */

function updateCartCount() {

    const countElement =
        document.getElementById("count");

    if (!countElement) {
        return;
    }

    const total =
        cart.reduce(
            (sum, item) => {

                return sum +
                    Math.max(
                        1,
                        Number(item.quantity) || 1
                    );

            },
            0
        );

    countElement.textContent = total;
}


/* =====================================================
   MONEY
===================================================== */

function formatMoney(amount) {

    return (
        "TZS " +
        Number(amount || 0)
            .toLocaleString("en-TZ")
    );
}


/* =====================================================
   PRODUCT
===================================================== */

let product = null;


/* =====================================================
   SELECTED OPTIONS
===================================================== */

let selectedStorage = null;

let selectedCondition = "new";

let selectedColour = null;

let selectedAccessories = [];


/* =====================================================
   DOM ELEMENTS
===================================================== */

const productName =
    document.getElementById("productName");

const productDescription =
    document.getElementById("productDescription");

const productImage =
    document.getElementById("productImage");

const productPrice =
    document.getElementById("productPrice");

const productStock =
    document.getElementById("productStock");

const storageOptions =
    document.getElementById("storageOptions");

const conditionOptions =
    document.getElementById("conditionOptions");

const colourOptions =
    document.getElementById("colourOptions");

const accessoryOptions =
    document.getElementById("accessoryOptions");

const addToCartBtn =
    document.getElementById("addToCartBtn");

const installmentBtn =
    document.getElementById("installmentBtn");


/* =====================================================
   ACCESSORY PRODUCT CHECK
===================================================== */

function isAccessoryProduct() {

    if (!product) {
        return false;
    }

    const type =
        String(product.type || "")
            .toLowerCase();

    const category =
        String(product.category || "")
            .toLowerCase();

    return (
        type === "accessory" ||
        type.includes("accessor") ||
        category.includes("accessor") ||
        category.includes("audio")
    );
}


/* =====================================================
   ERROR
===================================================== */

function showProductError(message) {

    document.body.innerHTML = `

        <main style="
            max-width:700px;
            margin:100px auto;
            padding:30px;
            text-align:center;
        ">

            <h2>${message}</h2>

            <p>
                Please return to the store
                and try again.
            </p>

            <a
                href="index.html"
                style="
                    display:inline-block;
                    margin-top:20px;
                    padding:12px 20px;
                    background:#111;
                    color:white;
                    text-decoration:none;
                    border-radius:6px;
                "
            >
                Back to Store
            </a>

        </main>

    `;
}


/* =====================================================
   LOAD PRODUCT
===================================================== */

async function loadProduct() {

    updateCartCount();


    if (
        !productId ||
        Number.isNaN(productId)
    ) {

        showProductError(
            "Invalid product."
        );

        return;
    }


    try {

        const sb =
            requireSupabase();


        const {
            data,
            error
        } = await sb
            .from("products")
            .select("*")
            .eq("id", productId)
            .eq("active", true)
            .maybeSingle();


        if (error) {

            console.error(
                "Supabase product error:",
                error
            );

            showProductError(
                "Unable to load this product."
            );

            return;
        }


        if (!data) {

            showProductError(
                "Product not found."
            );

            return;
        }


        product = data;

        initializeProduct();

    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );

        showProductError(
            "Unable to load this product."
        );
    }
}


/* =====================================================
   INITIALIZE PRODUCT
===================================================== */

function initializeProduct() {

    /* Storage */

    if (
        product.storage &&
        typeof product.storage === "object"
    ) {

        const keys =
            Object.keys(product.storage);

        selectedStorage =
            keys.length
                ? keys[0]
                : null;
    }


    /* Colour */

    if (
        Array.isArray(product.colours) &&
        product.colours.length
    ) {

        selectedColour =
            product.colours[0];
    }


    /* Product information */

    if (productName) {

        productName.textContent =
            product.name || "";
    }


    if (productDescription) {

        productDescription.textContent =
            product.description || "";
    }


    if (productImage) {

        productImage.src =
            product.image ||
            "images/logo.PNG";

        productImage.alt =
            product.name || "Product";

        productImage.onerror =
            function () {

                this.src =
                    "images/logo.PNG";
            };
    }


    /* Accessories */

    if (isAccessoryProduct()) {

        hideConfigurationOptions();

        if (installmentBtn) {
            installmentBtn.style.display = "none";
        }

    } else {

        renderStorageOptions();

        renderConditionOptions();

        renderColourOptions();

        renderAccessories();
    }


    updatePrice();

    updateStockState();
}


/* =====================================================
   HIDE CONFIGURATION FOR ACCESSORIES
===================================================== */

function hideConfigurationOptions() {

    const sections = [
        storageOptions,
        conditionOptions,
        colourOptions,
        accessoryOptions
    ];

    sections.forEach(element => {

        if (element) {

            const section =
                element.closest(
                    ".option-section"
                );

            if (section) {
                section.style.display = "none";
            }
        }
    });
}


/* =====================================================
   BASE PRICE
===================================================== */

function getBasePrice() {

    if (
        !product.storage ||
        typeof product.storage !== "object"
    ) {

        return Number(product.price) || 0;
    }


    if (!selectedStorage) {

        return Number(product.price) || 0;
    }


    const storageData =
        product.storage[selectedStorage];


    if (!storageData) {
        return 0;
    }


    if (
        typeof storageData === "object" &&
        storageData !== null
    ) {

        return Number(
            storageData[selectedCondition]
        ) || 0;
    }


    return Number(storageData) || 0;
}


/* =====================================================
   ACCESSORIES TOTAL
===================================================== */

function getAccessoriesTotal() {

    return selectedAccessories.reduce(
        (total, item) => {

            return total +
                (
                    Number(item.price) || 0
                );

        },
        0
    );
}


/* =====================================================
   FINAL PRICE
===================================================== */

function getFinalPrice() {

    return (
        getBasePrice() +
        getAccessoriesTotal()
    );
}


/* =====================================================
   UPDATE PRICE
===================================================== */

function updatePrice() {

    if (!productPrice) {
        return;
    }

    productPrice.textContent =
        formatMoney(
            getFinalPrice()
        );
}


/* =====================================================
   CONDITION EXISTS
===================================================== */

function conditionExists(condition) {

    if (
        !product ||
        !product.storage ||
        !selectedStorage
    ) {

        return false;
    }


    const storageData =
        product.storage[selectedStorage];


    if (
        !storageData ||
        typeof storageData !== "object"
    ) {

        return false;
    }


    return (
        storageData[condition] !== undefined &&
        Number(storageData[condition]) > 0
    );
}


/* =====================================================
   STORAGE OPTIONS
===================================================== */

function renderStorageOptions() {

    if (!storageOptions) {
        return;
    }

    storageOptions.innerHTML = "";


    if (
        !product.storage ||
        typeof product.storage !== "object"
    ) {

        return;
    }


    Object.keys(product.storage)
        .forEach(storage => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "option-btn";

            button.textContent =
                storage;


            if (
                storage === selectedStorage
            ) {

                button.classList.add("active");
            }


            button.addEventListener(
                "click",
                () => {

                    selectedStorage =
                        storage;


                    if (
                        !conditionExists(
                            selectedCondition
                        )
                    ) {

                        selectedCondition =
                            "new";
                    }


                    renderStorageOptions();

                    renderConditionOptions();

                    updatePrice();
                }
            );


            storageOptions.appendChild(
                button
            );

        });
}


/* =====================================================
   CONDITION OPTIONS
===================================================== */

function renderConditionOptions() {

    if (!conditionOptions) {
        return;
    }

    conditionOptions.innerHTML = "";


    if (
        !product.storage ||
        !selectedStorage
    ) {

        return;
    }


    const storageData =
        product.storage[selectedStorage];


    if (
        !storageData ||
        typeof storageData !== "object"
    ) {

        return;
    }


    /* New */

    if (
        storageData.new !== undefined &&
        Number(storageData.new) > 0
    ) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "option-btn";

        button.textContent =
            "New / Full Box";


        if (
            selectedCondition === "new"
        ) {

            button.classList.add("active");
        }


        button.addEventListener(
            "click",
            () => {

                selectedCondition =
                    "new";

                renderConditionOptions();

                updatePrice();
            }
        );


        conditionOptions.appendChild(
            button
        );
    }


    /* Used */

    if (
        storageData.used !== undefined &&
        Number(storageData.used) > 0
    ) {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "option-btn";

        button.textContent =
            "Used";


        if (
            selectedCondition === "used"
        ) {

            button.classList.add("active");
        }


        button.addEventListener(
            "click",
            () => {

                selectedCondition =
                    "used";

                renderConditionOptions();

                updatePrice();
            }
        );


        conditionOptions.appendChild(
            button
        );
    }
}


/* =====================================================
   COLOUR OPTIONS
===================================================== */

function renderColourOptions() {

    if (!colourOptions) {
        return;
    }

    colourOptions.innerHTML = "";


    if (
        !Array.isArray(product.colours) ||
        !product.colours.length
    ) {

        return;
    }


    product.colours.forEach(colour => {

        const button =
            document.createElement("button");

        button.type = "button";

        button.className =
            "option-btn";

        button.textContent =
            colour;


        if (
            colour === selectedColour
        ) {

            button.classList.add("active");
        }


        button.addEventListener(
            "click",
            () => {

                selectedColour =
                    colour;


                colourOptions
                    .querySelectorAll(
                        ".option-btn"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );
            }
        );


        colourOptions.appendChild(
            button
        );

    });
}


/* =====================================================
   RENDER ACCESSORIES
===================================================== */

function renderAccessories() {

    if (!accessoryOptions) {
        return;
    }

    accessoryOptions.innerHTML = "";

    loadAccessories();
}


/* =====================================================
   LOAD ACCESSORIES
===================================================== */

async function loadAccessories() {

    try {

        const sb =
            requireSupabase();


        const {
            data,
            error
        } = await sb
            .from("products")
            .select("*")
            .eq("active", true)
            .eq("type", "accessory")
            .order("name");


        if (error) {

            console.error(
                "Accessory loading error:",
                error
            );

            return;
        }


        const accessories =
            (data || []).filter(
                item =>
                    Number(item.id) !==
                    Number(product.id)
            );


        if (!accessories.length) {
            return;
        }


        accessories.forEach(item => {

            const card =
                document.createElement("div");

            card.className =
                "accessory-card";


            const price =
                Number(item.price) || 0;


            card.innerHTML = `

                <img
                    src="${item.image || "images/logo.PNG"}"
                    alt="${item.name || "Accessory"}"
                    loading="lazy"
                >

                <h4>
                    ${item.name || ""}
                </h4>

                <p>
                    ${formatMoney(price)}
                </p>

                <button
                    type="button"
                    class="accessory-btn"
                >
                    Add
                </button>

            `;


            const button =
                card.querySelector(
                    ".accessory-btn"
                );


            button.addEventListener(
                "click",
                () => {

                    const exists =
                        selectedAccessories.some(
                            accessory =>
                                Number(accessory.id) ===
                                Number(item.id)
                        );


                    if (exists) {

                        selectedAccessories =
                            selectedAccessories.filter(
                                accessory =>
                                    Number(accessory.id) !==
                                    Number(item.id)
                            );


                        card.classList.remove(
                            "selected"
                        );

                        button.textContent =
                            "Add";

                    } else {

                        selectedAccessories.push({

                            id:
                                item.id,

                            name:
                                item.name,

                            image:
                                item.image,

                            price:
                                price

                        });


                        card.classList.add(
                            "selected"
                        );

                        button.textContent =
                            "Added ✓";
                    }


                    updatePrice();
                }
            );


            accessoryOptions.appendChild(
                card
            );

        });


    } catch (error) {

        console.error(
            "Accessory error:",
            error
        );
    }
}


/* =====================================================
   STOCK
===================================================== */

function updateStockState() {

    const stock =
        Number(product.stock || 0);


    if (productStock) {

        if (stock <= 0) {

            productStock.textContent =
                "Out of Stock";

            productStock.className =
                "product-stock out-of-stock";

        } else if (stock <= 3) {

            productStock.textContent =
                `Only ${stock} left in stock`;

            productStock.className =
                "product-stock low-stock";

        } else {

            productStock.textContent =
                `In Stock — ${stock} available`;

            productStock.className =
                "product-stock in-stock";
        }
    }


    if (stock <= 0) {

        if (addToCartBtn) {

            addToCartBtn.disabled = true;

            addToCartBtn.textContent =
                "Out of Stock";
        }


        if (installmentBtn) {
            installmentBtn.disabled = true;
        }

    } else {

        if (addToCartBtn) {

            addToCartBtn.disabled = false;

            addToCartBtn.textContent =
                "Add To Cart";
        }


        if (installmentBtn) {
            installmentBtn.disabled = false;
        }
    }
}


/* =====================================================
   ADD TO CART
===================================================== */

if (addToCartBtn) {

    addToCartBtn.addEventListener(
        "click",
        () => {

            if (!product) {

                alert(
                    "Product is still loading. Please wait."
                );

                return;
            }


            const stock =
                Number(product.stock || 0);


            if (stock <= 0) {

                alert(
                    "This product is currently out of stock."
                );

                return;
            }


            const basePrice =
                getBasePrice();


            if (
                !basePrice ||
                basePrice <= 0
            ) {

                alert(
                    "Please select a valid storage and condition."
                );

                return;
            }


            const accessories =
                selectedAccessories.map(
                    item => ({

                        id:
                            item.id,

                        name:
                            item.name,

                        image:
                            item.image,

                        price:
                            Number(item.price) || 0

                    })
                );


            const accessoryTotal =
                accessories.reduce(
                    (sum, item) =>
                        sum +
                        (
                            Number(item.price) || 0
                        ),
                    0
                );


            const finalPrice =
                basePrice +
                accessoryTotal;


            /* =========================================
               PRODUCT CONFIGURATION
            ========================================= */

            const cartItem = {

                id:
                    product.id,

                name:
                    product.name,

                image:
                    product.image,

                storage:
                    selectedStorage,

                condition:
                    selectedCondition,

                colour:
                    selectedColour,

                accessories:
                    accessories,

                base_price:
                    basePrice,

                accessory_total:
                    accessoryTotal,

                price:
                    finalPrice,

                quantity:
                    1
            };


            /* =========================================
               CHECK SAME CONFIGURATION
            ========================================= */

            const existingIndex =
                cart.findIndex(item => {

                    return (
                        String(item.id) ===
                        String(cartItem.id) &&

                        String(item.storage || "") ===
                        String(cartItem.storage || "") &&

                        String(item.condition || "") ===
                        String(cartItem.condition || "") &&

                        String(item.colour || "") ===
                        String(cartItem.colour || "") &&

                        JSON.stringify(
                            item.accessories || []
                        ) ===
                        JSON.stringify(
                            cartItem.accessories || []
                        )
                    );
                });


            /* =========================================
               ADD / INCREASE
            ========================================= */

            if (existingIndex !== -1) {

                cart[existingIndex].quantity =
                    (
                        Number(
                            cart[existingIndex].quantity
                        ) || 1
                    ) + 1;

            } else {

                cart.push(
                    cartItem
                );
            }


            /* =========================================
               SAVE
            ========================================= */

            saveCart();


            /* =========================================
               UPDATE DISPLAY
            ========================================= */

            updatePrice();

            updateCartCount();


            alert(
                "Added to cart successfully!"
            );
        }
    );
}


/* =====================================================
   INSTALLMENT
===================================================== */

if (installmentBtn) {

    installmentBtn.addEventListener(
        "click",
        () => {

            if (!product) {
                return;
            }


            const stock =
                Number(product.stock || 0);


            if (stock <= 0) {

                alert(
                    "This product is out of stock."
                );

                return;
            }


            const finalPrice =
                getFinalPrice();


            if (finalPrice <= 0) {

                alert(
                    "Invalid product price."
                );

                return;
            }


            if (isAccessoryProduct()) {

                alert(
                    "Installment payment is only available for smartphones."
                );

                return;
            }


            const installmentProduct = {

                id:
                    product.id,

                name:
                    product.name,

                image:
                    product.image,

                storage:
                    selectedStorage,

                condition:
                    selectedCondition,

                colour:
                    selectedColour,

                accessories:
                    selectedAccessories,

                price:
                    finalPrice
            };


            localStorage.setItem(
                "installmentProduct",
                JSON.stringify(
                    installmentProduct
                )
            );


            window.location.href =
                `installment.html?id=${product.id}`;
        }
    );
}


/* =====================================================
   START
===================================================== */

loadProduct();