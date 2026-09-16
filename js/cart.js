"use strict";

/* =========================================================
   MWASHI GADGETS
   CART + SUPABASE ORDERS + WHATSAPP CHECKOUT
========================================================= */


/* =========================================================
   CART STORAGE
========================================================= */

const CART_STORAGE_KEY = "mwashiCart";

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

    localStorage.removeItem(CART_STORAGE_KEY);
}


/* =========================================================
   DOM ELEMENTS
========================================================= */

const cartContainer = document.getElementById("cart-items");
const totalEl = document.getElementById("cart-total");
const subtotalEl = document.getElementById("subtotal");


/* =========================================================
   SAVE CART
========================================================= */

function saveCartPage() {

    try {

        localStorage.setItem(
            CART_STORAGE_KEY,
            JSON.stringify(cart)
        );

    } catch (error) {

        console.error("Cart save error:", error);

    }

    renderCart();
}


/* =========================================================
   CLEAR CART
========================================================= */

function clearCart() {

    cart = [];

    localStorage.removeItem(CART_STORAGE_KEY);

    renderCart();
}


/* =========================================================
   CALCULATE TOTAL
========================================================= */

function calculateSecureTotal(cartItems) {

    if (!Array.isArray(cartItems)) {
        return 0;
    }

    return cartItems.reduce(
        (total, item) => {

            const price =
                Number(item.price) || 0;

            const quantity =
                Math.max(
                    1,
                    Number(item.quantity) || 1
                );

            return total + (price * quantity);

        },
        0
    );
}


/* =========================================================
   FORMAT MONEY
========================================================= */

function formatMoney(value) {

    const number =
        Number(value) || 0;

    return number.toLocaleString(
        "en-TZ",
        {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    );
}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   ESCAPE ATTRIBUTE
========================================================= */

function escapeAttr(value) {

    return escapeHtml(value);
}


/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    if (!cartContainer || !totalEl) {
        return;
    }

    cartContainer.innerHTML = "";


    /* =====================================================
       EMPTY CART
    ===================================================== */

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">

                <h2>
                    🛒 Your cart is empty
                </h2>

                <p>
                    Add some amazing gadgets
                    to get started.
                </p>

                <br>

                <a
                    href="index.html"
                    class="continue-btn"
                >
                    ← Browse Gadgets
                </a>

            </div>
        `;

        totalEl.innerText = "TZS 0";

        if (subtotalEl) {
            subtotalEl.innerText = "TZS 0";
        }

        return;
    }


    /* =====================================================
       TOTAL
    ===================================================== */

    const total =
        calculateSecureTotal(cart);


    /* =====================================================
       RENDER ITEMS
    ===================================================== */

    cart.forEach((item, index) => {

        const product =
            typeof products !== "undefined"
                ? products.find(
                    p =>
                        String(p.id) ===
                        String(item.id)
                )
                : null;


        const productName =
            product?.name ||
            item.name ||
            "Unknown Product";


        const productImage =
            product?.image ||
            item.image ||
            "images/logo.PNG";


        const itemPrice =
            Number(item.price) || 0;


        const quantity =
            Math.max(
                1,
                Number(item.quantity) || 1
            );


        const itemTotal =
            itemPrice * quantity;


        /* =================================================
           ACCESSORIES
        ================================================= */

        let accessoriesText = "None";

        if (
            Array.isArray(item.accessories) &&
            item.accessories.length > 0
        ) {

            accessoriesText =
                item.accessories
                    .map(accessory => {

                        const name =
                            accessory?.name ||
                            accessory;

                        return `• ${escapeHtml(name)}`;

                    })
                    .join("<br>");
        }


        /* =================================================
           CART ITEM
        ================================================= */

        cartContainer.innerHTML += `

            <div
                class="cart-item"
                data-index="${index}"
            >

                <img
                    src="${escapeAttr(productImage)}"
                    alt="${escapeAttr(productName)}"
                    loading="lazy"
                    decoding="async"
                    onerror="this.src='images/logo.PNG'"
                >


                <div class="cart-details">

                    <h3>
                        ${escapeHtml(productName)}
                    </h3>


                    ${
                        item.storage
                            ? `
                                <p>
                                    <strong>
                                        Storage:
                                    </strong>
                                    ${escapeHtml(item.storage)}
                                </p>
                            `
                            : ""
                    }


                    ${
                        item.condition
                            ? `
                                <p>
                                    <strong>
                                        Condition:
                                    </strong>
                                    ${escapeHtml(item.condition)}
                                </p>
                            `
                            : ""
                    }


                    ${
                        item.colour
                            ? `
                                <p>
                                    <strong>
                                        Colour:
                                    </strong>
                                    ${escapeHtml(item.colour)}
                                </p>
                            `
                            : ""
                    }


                    <p>
                        <strong>
                            Accessories:
                        </strong>
                        <br>
                        ${accessoriesText}
                    </p>


                    <p>
                        <strong>
                            Unit Price:
                        </strong>
                        TZS ${formatMoney(itemPrice)}
                    </p>


                    <p>
                        <strong>
                            Item Total:
                        </strong>
                        TZS ${formatMoney(itemTotal)}
                    </p>

                </div>


                <div class="cart-actions">

                    <button
                        type="button"
                        class="qty-btn"
                        onclick="decreaseQty(${index})"
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>


                    <strong>
                        ${quantity}
                    </strong>


                    <button
                        type="button"
                        class="qty-btn"
                        onclick="increaseQty(${index})"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>


                    <button
                        type="button"
                        class="remove-btn"
                        onclick="removeItem(${index})"
                    >
                        Remove
                    </button>

                </div>

            </div>
        `;
    });


    /* =====================================================
       TOTAL DISPLAY
    ===================================================== */

    totalEl.innerText =
        `TZS ${formatMoney(total)}`;

    if (subtotalEl) {

        subtotalEl.innerText =
            `TZS ${formatMoney(total)}`;
    }
}


/* =========================================================
   INCREASE QUANTITY
========================================================= */

function increaseQty(index) {

    if (!cart[index]) {
        return;
    }

    const current =
        Math.max(
            1,
            Number(cart[index].quantity) || 1
        );

    cart[index].quantity =
        current + 1;

    saveCartPage();

    showToast("Quantity updated");
}


/* =========================================================
   DECREASE QUANTITY
========================================================= */

function decreaseQty(index) {

    if (!cart[index]) {
        return;
    }

    const current =
        Math.max(
            1,
            Number(cart[index].quantity) || 1
        );


    if (current > 1) {

        cart[index].quantity =
            current - 1;

    } else {

        cart.splice(index, 1);

        showToast("Item removed");
    }


    saveCartPage();
}


/* =========================================================
   REMOVE ITEM
========================================================= */

function removeItem(index) {

    if (!cart[index]) {
        return;
    }


    const productName =
        cart[index].name ||
        "this item";


    if (
        confirm(
            `Remove ${productName} from your cart?`
        )
    ) {

        cart.splice(index, 1);

        saveCartPage();

        showToast(
            "Item removed from cart"
        );
    }
}


/* =========================================================
   GENERATE ORDER NUMBER
========================================================= */

function generateOrderNumber() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");

    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );

    return `MWG-${year}${month}${day}-${hours}${minutes}-${random}`;
}


/* =========================================================
   GET FIELD VALUE
========================================================= */

function getFieldValue(...ids) {

    for (const id of ids) {

        const element =
            document.getElementById(id);

        if (element) {

            return String(
                element.value || ""
            ).trim();
        }
    }

    return "";
}


/* =========================================================
   NORMALIZE PHONE
========================================================= */

function normalizePhone(phone) {

    let value =
        String(phone || "")
            .replace(/[^0-9+]/g, "");


    if (value.startsWith("+")) {

        value =
            value.substring(1);
    }


    if (value.startsWith("0")) {

        value =
            "255" +
            value.substring(1);
    }


    return value;
}


/* =========================================================
   SAVE ORDER TO SUPABASE
========================================================= */

async function saveOrderToSupabase(
    customerName,
    customerPhone,
    customerEmail,
    deliveryAddress,
    deliveryCity,
    paymentMethod,
    customerNote
) {

    try {

        const sb =
            requireSupabase();


        if (!sb) {

            throw new Error(
                "Supabase client unavailable."
            );
        }


        /* =================================================
           CART VALIDATION
        ================================================= */

        if (
            !Array.isArray(cart) ||
            cart.length === 0
        ) {

            throw new Error(
                "Your cart is empty."
            );
        }


        /* =================================================
           CALCULATE TOTAL
        ================================================= */

        const total =
            calculateSecureTotal(cart);


        if (
            !Number.isFinite(total) ||
            total < 0
        ) {

            throw new Error(
                "Invalid order total."
            );
        }


        /* =================================================
           ORDER NUMBER
        ================================================= */

        const orderNumber =
            generateOrderNumber();


        /* =================================================
           ORDER ITEMS
        ================================================= */

        const orderItems =
            cart.map(item => {

                const productId =
                    Number(item.id);

                const quantity =
                    Number(item.quantity) || 1;

                const unitPrice =
                    Number(item.price) || 0;


                if (
                    !Number.isInteger(productId) ||
                    productId <= 0
                ) {

                    throw new Error(
                        `Invalid product in cart: ${
                            item.name ||
                            "Unknown Product"
                        }`
                    );
                }


                if (
                    !Number.isInteger(quantity) ||
                    quantity <= 0
                ) {

                    throw new Error(
                        `Invalid quantity for ${
                            item.name ||
                            "Unknown Product"
                        }`
                    );
                }


                if (
                    !Number.isFinite(unitPrice) ||
                    unitPrice < 0
                ) {

                    throw new Error(
                        `Invalid price for ${
                            item.name ||
                            "Unknown Product"
                        }`
                    );
                }


                return {

                    product_id:
                        productId,

                    product_name:
                        item.name ||
                        "Unknown Product",

                    product_image:
                        item.image ||
                        null,

                    storage:
                        item.storage ||
                        null,

                    condition:
                        item.condition ||
                        null,

                    colour:
                        item.colour ||
                        null,

                    accessories:
                        Array.isArray(
                            item.accessories
                        )
                            ? item.accessories
                            : [],

                    quantity:
                        quantity,

                    unit_price:
                        unitPrice,

                    total_price:
                        unitPrice * quantity
                };
            });


        /* =================================================
           SUPABASE CHECKOUT
        ================================================= */

        const {
            data,
            error
        } = await sb.rpc(
            "create_order_with_inventory",
            {
                p_order_number:
                    orderNumber,

                p_customer_name:
                    customerName,

                p_customer_phone:
                    customerPhone,

                p_payment_method:
                    paymentMethod ||
                    "WhatsApp",

                p_customer_note:
                    customerNote ||
                    null,

                p_subtotal:
                    total,

                p_delivery_fee:
                    0,

                p_total:
                    total,

                p_items:
                    orderItems
            }
        );


        if (error) {

            console.error(
                "Supabase checkout error:",
                error
            );

            throw error;
        }


        if (
            !data ||
            data.success !== true
        ) {

            throw new Error(
                "The order could not be completed."
            );
        }


        return {

            success: true,

            order: data,

            orderNumber:
                data.order_number ||
                orderNumber,

            total:
                Number(
                    data.total ?? total
                )
        };


    } catch (error) {

        console.error(
            "Order checkout error:",
            error
        );

        return {

            success: false,

            error: error
        };
    }
}


/* =========================================================
   WHATSAPP CHECKOUT
========================================================= */

async function checkoutWhatsApp() {

    if (
        !Array.isArray(cart) ||
        cart.length === 0
    ) {

        alert(
            "Your cart is empty!"
        );

        return;
    }


    /* =====================================================
       CUSTOMER DETAILS
    ===================================================== */

    const customerName =
        getFieldValue(
            "customer-name",
            "name"
        );


    const customerPhoneRaw =
        getFieldValue(
            "customer-phone",
            "phone"
        );


    const customerPhone =
        normalizePhone(
            customerPhoneRaw
        );


    const customerEmail =
        getFieldValue(
            "customer-email",
            "email"
        );


    const deliveryAddress =
        getFieldValue(
            "delivery-address",
            "address"
        );


    const deliveryCity =
        getFieldValue(
            "delivery-city",
            "city"
        );


    const paymentMethod =
        getFieldValue(
            "payment-method"
        ) ||
        "WhatsApp";


    const customerNote =
        getFieldValue(
            "customer-note",
            "notes"
        );


    /* =====================================================
       VALIDATION
    ===================================================== */

    if (!customerName) {

        alert(
            "Please enter your full name."
        );

        return;
    }


    if (!customerPhone) {

        alert(
            "Please enter your phone number."
        );

        return;
    }


    const phoneRegex =
        /^(255[67]\d{8}|0[67]\d{8})$/;


    if (
        !phoneRegex.test(
            customerPhone
        )
    ) {

        alert(
            "Please enter a valid Tanzanian phone number."
        );

        return;
    }


    if (customerEmail) {

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailRegex.test(
                customerEmail
            )
        ) {

            alert(
                "Please enter a valid email address."
            );

            return;
        }
    }


    /* =====================================================
       PREVENT DOUBLE CHECKOUT
    ===================================================== */

    const checkoutButton =
        document.querySelector(
            ".checkout-btn"
        );


    if (
        checkoutButton &&
        checkoutButton.disabled
    ) {

        return;
    }


    if (checkoutButton) {

        checkoutButton.disabled =
            true;

        checkoutButton.dataset.originalText =
            checkoutButton.innerHTML;

        checkoutButton.innerHTML =
            "⏳ Processing Order...";
    }


    /* =====================================================
       SAVE ORDER
    ===================================================== */

    const result =
        await saveOrderToSupabase(
            customerName,
            customerPhone,
            customerEmail,
            deliveryAddress,
            deliveryCity,
            paymentMethod,
            customerNote
        );


    /* =====================================================
       HANDLE FAILURE
    ===================================================== */

    if (!result.success) {

        if (checkoutButton) {

            checkoutButton.disabled =
                false;

            checkoutButton.innerHTML =
                checkoutButton.dataset.originalText ||
                "💬 Checkout on WhatsApp";
        }


        console.error(
            "Checkout failed:",
            result.error
        );


        alert(
            "We could not save your order.\n\n" +
            (
                result.error?.message ||
                "Please check your internet connection and try again."
            )
        );

        return;
    }


    /* =====================================================
       ORDER INFORMATION
    ===================================================== */

    const orderNumber =
        result.orderNumber;

    const total =
        result.total;


    /* =====================================================
       BUILD WHATSAPP MESSAGE
    ===================================================== */

    let message =
`🛒 *NEW ORDER REQUEST*

🔖 Order Number: *${orderNumber}*

👤 Customer: ${customerName}

📞 Phone: ${customerPhone}`;


    if (customerEmail) {

        message +=
            `\n📧 Email: ${customerEmail}`;
    }


    if (deliveryAddress) {

        message +=
            `\n📍 Address: ${deliveryAddress}`;
    }


    if (deliveryCity) {

        message +=
            `\n🏙️ City: ${deliveryCity}`;
    }


    message +=
`

📦 *ORDER DETAILS*

`;


    /* =====================================================
       ITEMS
    ===================================================== */

    cart.forEach(item => {

        const quantity =
            Math.max(
                1,
                Number(item.quantity) || 1
            );


        const unitPrice =
            Number(item.price) || 0;


        const itemTotal =
            unitPrice * quantity;


        let accessories =
            "None";


        if (
            Array.isArray(item.accessories) &&
            item.accessories.length
        ) {

            accessories =
                item.accessories
                    .map(accessory =>
                        "• " +
                        (
                            accessory?.name ||
                            accessory
                        )
                    )
                    .join("\n");
        }


        message +=
`📱 *${item.name || "Product"}*

Storage: ${item.storage || "Standard"}

Condition: ${item.condition || "New"}

Colour: ${item.colour || "Standard"}

Accessories:
${accessories}

Quantity: ${quantity}

Unit Price:
TZS ${formatMoney(unitPrice)}

Item Total:
TZS ${formatMoney(itemTotal)}

----------------------------

`;
    });


    /* =====================================================
       TOTAL
    ===================================================== */

    message +=
`💰 *TOTAL: TZS ${formatMoney(total)}*

`;


    /* =====================================================
       CUSTOMER NOTE
    ===================================================== */

    if (customerNote) {

        message +=
`📝 *Customer Note:*

${customerNote}

`;
    }


    /* =====================================================
       FINAL MESSAGE
    ===================================================== */

    message +=
`🔖 Order Number: *${orderNumber}*

Payment Method: ${paymentMethod}

Thank you for shopping with *Mwashi Gadgets*.`;


    /* =====================================================
       WHATSAPP
    ===================================================== */

    const whatsappNumber =
        "255623468239";


    const whatsappUrl =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


    window.open(
        whatsappUrl,
        "_blank"
    );


    /* =====================================================
       CLEAR CART AFTER SUCCESS
    ===================================================== */

    clearCart();


    /* =====================================================
       SUCCESS
    ===================================================== */

    showToast(
        `Order ${orderNumber} saved successfully`
    );


    if (checkoutButton) {

        checkoutButton.disabled =
            false;

        checkoutButton.innerHTML =
            checkoutButton.dataset.originalText ||
            "💬 Checkout on WhatsApp";
    }
}


/* =========================================================
   TOAST
========================================================= */

function showToast(message) {

    const toast =
        document.createElement("div");

    toast.className =
        "toast";

    toast.innerText =
        message;


    document.body.appendChild(
        toast
    );


    setTimeout(
        () => {

            toast.classList.add(
                "show"
            );

        },
        100
    );


    setTimeout(
        () => {

            toast.remove();

        },
        3000
    );
}


/* =========================================================
   GET CART COUNT
========================================================= */

function getCartCount() {

    return cart.reduce(
        (total, item) => {

            return total +
                Math.max(
                    1,
                    Number(item.quantity) || 1
                );

        },
        0
    );
}


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderCart();

    }
);