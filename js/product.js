// ===============================
// GET PRODUCT FROM URL
// ===============================

const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

const product = products.find(p => p.id === productId);

if (!product) {
    document.body.innerHTML = "<h2>Product not found.</h2>";
    throw new Error("Product not found");
}


// ===============================
// HELPERS
// ===============================

function updateCartCount() {

    const cart =
        JSON.parse(localStorage.getItem("cart")) || [];

    const count =
        document.getElementById("count");

    if (count) {

        count.textContent =
            cart.reduce(
                (total, item) =>
                    total + (Number(item.qty) || 0),
                0
            );
    }
}


function formatMoney(amount) {

    return "TZS " +
        Number(amount || 0).toLocaleString("en-TZ");
}


// ===============================
// INITIALIZE CART COUNT
// ===============================

updateCartCount();


// ===============================
// SELECTED OPTIONS
// ===============================

let selectedStorage =
    product.storage
        ? Object.keys(product.storage)[0]
        : null;

let selectedCondition = "new";

let selectedColour =
    product.colours &&
    product.colours.length
        ? product.colours[0]
        : null;

let selectedAccessories = [];


// ===============================
// PRODUCT INFORMATION
// ===============================

const productName =
    document.getElementById("productName");

const productDescription =
    document.getElementById("productDescription");

const productImage =
    document.getElementById("productImage");


if (productName) {

    productName.textContent =
        product.name;
}


if (productDescription) {

    productDescription.textContent =
        product.description || "";
}


if (productImage) {

    productImage.src =
        product.image;

    productImage.alt =
        product.name;
}


// ===============================
// GET BASE PRICE
// ===============================

function getBasePrice() {

    // Products without storage
    if (!product.storage) {

        return Number(product.price) || 0;
    }


    const storageData =
        product.storage[selectedStorage];


    if (!storageData) {

        return 0;
    }


    // New / Used structure
    if (
        typeof storageData === "object" &&
        storageData !== null
    ) {

        return Number(
            storageData[selectedCondition]
        ) || 0;
    }


    // Legacy price structure
    return Number(storageData) || 0;
}


// ===============================
// ACCESSORIES TOTAL
// ===============================

function getAccessoriesTotal() {

    return selectedAccessories.reduce(
        (total, item) => {

            return total +
                Number(item.price || 0);

        },
        0
    );
}


// ===============================
// FINAL PRICE
// ===============================

function getFinalPrice() {

    return (
        getBasePrice() +
        getAccessoriesTotal()
    );
}


// ===============================
// UPDATE PRICE
// ===============================

function updatePrice() {

    const price =
        getFinalPrice();

    const productPrice =
        document.getElementById("productPrice");

    if (productPrice) {

        productPrice.textContent =
            formatMoney(price);
    }
}


// ===============================
// CONDITION VALIDATION
// ===============================

function conditionExists(condition) {

    if (!product.storage) {
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


// ===============================
// STORAGE OPTIONS
// ===============================

const storageOptions =
    document.getElementById("storageOptions");


function renderStorageOptions() {

    if (
        !storageOptions ||
        !product.storage
    ) {

        return;
    }


    storageOptions.innerHTML = "";


    Object.keys(product.storage).forEach(
        storage => {

            const button =
                document.createElement("button");

            button.type = "button";

            button.className =
                "option-btn";

            button.textContent =
                storage;


            if (
                storage ===
                selectedStorage
            ) {

                button.classList.add(
                    "active"
                );
            }


            button.addEventListener(
                "click",
                () => {

                    selectedStorage =
                        storage;


                    // Keep current condition
                    // if available for this storage
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
        }
    );
}


// ===============================
// CONDITION OPTIONS
// ===============================

const conditionOptions =
    document.getElementById(
        "conditionOptions"
    );


function renderConditionOptions() {

    if (!conditionOptions) {
        return;
    }


    conditionOptions.innerHTML = "";


    // No storage
    if (!product.storage) {
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


    // ===============================
    // NEW / FULL BOX
    // ===============================

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

            button.classList.add(
                "active"
            );
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


    // ===============================
    // USED
    // ===============================

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

            button.classList.add(
                "active"
            );
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


// ===============================
// INITIALIZE OPTIONS
// ===============================

renderStorageOptions();

renderConditionOptions();


// ===============================
// COLOUR OPTIONS
// ===============================

const colourOptions =
    document.getElementById(
        "colourOptions"
    );


if (
    colourOptions &&
    product.colours &&
    product.colours.length
) {

    colourOptions.innerHTML = "";


    product.colours.forEach(
        colour => {

            const button =
                document.createElement(
                    "button"
                );

            button.type = "button";

            button.className =
                "option-btn";

            button.textContent =
                colour;


            if (
                colour === selectedColour
            ) {

                button.classList.add(
                    "active"
                );
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
        }
    );
}


// ===============================
// ACCESSORIES
// ===============================

const accessoryOptions =
    document.getElementById(
        "accessoryOptions"
    );


const accessories =
    typeof accessoryProducts !== "undefined"
        ? accessoryProducts
        : [];


if (
    accessoryOptions &&
    accessories.length
) {

    accessoryOptions.innerHTML = "";


    accessories.forEach(
        item => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "accessory-card";


            card.innerHTML = `

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <h4>${item.name}</h4>

                <p>
                    ${formatMoney(item.price)}
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
                                accessory.name ===
                                item.name
                        );


                    if (exists) {

                        selectedAccessories =
                            selectedAccessories.filter(
                                accessory =>
                                    accessory.name !==
                                    item.name
                            );


                        card.classList.remove(
                            "selected"
                        );

                        button.textContent =
                            "Add";

                    } else {

                        selectedAccessories.push(
                            item
                        );


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
        }
    );
}


// ===============================
// INITIAL PRICE
// ===============================

updatePrice();


// ===============================
// ADD TO CART
// ===============================

const addToCartBtn =
    document.getElementById(
        "addToCartBtn"
    );


if (addToCartBtn) {

    addToCartBtn.addEventListener(
        "click",
        () => {

            const finalPrice =
                getFinalPrice();


            if (finalPrice <= 0) {

                alert(
                    "This product is currently unavailable."
                );

                return;
            }


            const cart =
                JSON.parse(
                    localStorage.getItem(
                        "cart"
                    )
                ) || [];


            cart.push({

                id: product.id,

                name: product.name,

                image: product.image,

                storage:
                    selectedStorage,

                condition:
                    selectedCondition,

                colour:
                    selectedColour,

                accessories:
                    selectedAccessories,

                price:
                    finalPrice,

                qty: 1
            });


            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            updateCartCount();


            alert(
                "Added to cart successfully!"
            );
        }
    );
}


// ===============================
// INSTALLMENT
// ===============================

const installmentBtn =
    document.getElementById(
        "installmentBtn"
    );


if (installmentBtn) {

    installmentBtn.addEventListener(
        "click",
        () => {

            const finalPrice =
                getFinalPrice();


            if (finalPrice <= 0) {

                alert(
                    "This product is currently unavailable."
                );

                return;
            }


            const installmentProduct = {

                id: product.id,

                name: product.name,

                image: product.image,

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