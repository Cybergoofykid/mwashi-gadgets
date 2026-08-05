const cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartContainer = document.getElementById("cart-items");
const totalEl = document.getElementById("cart-total");
const subtotalEl = document.getElementById("subtotal");
function saveCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}
function calculateSecureTotal(cart) {

    let total = 0;

    cart.forEach(item => {

        const product = products.find(
            p => Number(p.id) === Number(item.id)
        );

        const price = product 
            ? product.price || item.price
            : item.price;

        if(price){

            total += price * item.qty;

        }

    });

    return total;
}

// DISPLAY CART
function renderCart() {

    if (!cartContainer || !totalEl) return;

    cartContainer.innerHTML = "";


    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <h2>🛒 Your cart is empty</h2>
                <p>Add some amazing gadgets to get started.</p>
                <br>
                <a href="index.html" class="continue-btn">
                    ← Browse Gadgets
                </a>
            </div>
        `;

        totalEl.innerText = "TZS 0";

        if(subtotalEl)
            subtotalEl.innerText = "TZS 0";

        return;
    }


    const total = calculateSecureTotal(cart);



    cart.forEach((item,index)=>{


        // FIND PRODUCT SAFELY
        const product = products.find(
            p => Number(p.id) === Number(item.id)
        );



        // If product is missing, use saved cart data
        const productName =
            product?.name || item.name || "Unknown Product";


        const productImage =
            product?.image || item.image || "images/logo.png";



        const itemTotal =
            Number(item.price || product?.price || 0) * item.qty;



        const accessoriesText =
            item.accessories && item.accessories.length
            ?
            item.accessories
            .map(a=>`• ${a.name}`)
            .join("<br>")
            :
            "None";



        cartContainer.innerHTML += `


        <div class="cart-item">


            <img 
            src="${productImage}"
            alt="${productName}"
            loading="lazy"
            decoding="async"
            onerror="this.src='images/logo.png'"
            >



            <div class="cart-details">


                <h3>
                    ${productName}
                </h3>


                <p>
                <strong>Storage:</strong>
                ${item.storage || "Standard"}
                </p>


                <p>
                <strong>Colour:</strong>
                ${item.colour || "Standard"}
                </p>



                <p>
                <strong>Accessories:</strong><br>
                ${accessoriesText}
                </p>



                <p>
                <strong>Price:</strong>
                TZS ${Number(item.price || 0).toLocaleString()}
                </p>



                <p>
                <strong>Total:</strong>
                TZS ${itemTotal.toLocaleString()}
                </p>



            </div>



            <div class="cart-actions">


                <button class="qty-btn" 
                onclick="decreaseQty(${index})">
                    −
                </button>


                <strong>
                    ${item.qty}
                </strong>


                <button class="qty-btn" 
                onclick="increaseQty(${index})">
                    +
                </button>


                <button class="remove-btn"
                onclick="removeItem(${index})">
                    Remove
                </button>


            </div>


        </div>


        `;


    });



    totalEl.innerText =
    `TZS ${total.toLocaleString()}`;


    if(subtotalEl)
        subtotalEl.innerText =
        `TZS ${total.toLocaleString()}`;

}

// QTY CONTROL
function increaseQty(index){
    cart[index].qty++;
    saveCart();
    showToast("Quantity updated");
}

function decreaseQty(index){
    if(cart[index].qty > 1){
        cart[index].qty--;
    } else {
        cart.splice(index, 1);
        showToast("Item removed");
    }
    saveCart();
}

function removeItem(index){

    if(confirm("Remove this item from your cart?")){

        cart.splice(index,1);

        saveCart();

        showToast("Item removed from cart");
    }
}

// WHATSAPP CHECKOUT (FIXED ENCODING)
// WHATSAPP CHECKOUT (SECURE VERSION)
function checkoutWhatsApp() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Get customer details
    const customerName = document.getElementById("customer-name").value.trim();
    const customerPhone = document.getElementById("customer-phone").value.trim();
    const customerNote = document.getElementById("customer-note").value.trim();

    // Validate required fields
    if (!customerName || !customerPhone) {
        alert("Please enter your full name and phone number.");
        return;
    }

    // Use secure total calculation
    const total = calculateSecureTotal(cart);

    let message = `🛒 *NEW ORDER REQUEST*

👤 Customer: ${customerName}
📞 Phone: ${customerPhone}

📦 *ORDER DETAILS*

`;

    cart.forEach(item => {

        // Get the real product from the trusted products array
        const product = products.find(p => p.id === item.id);

        if (!product) return;

        const itemTotal = product.price * item.qty;

        const accessories =
            item.accessories && item.accessories.length
            ? item.accessories.map(a => "• " + a.name).join("\n")
            : "None";

        message +=
`📱 *${product.name}*

Storage: ${item.storage}
Colour: ${item.colour}

Accessories:
${accessories}

Quantity: ${item.qty}

Item Total: TZS ${itemTotal.toLocaleString()}

----------------------------

`;

    });

    message += `💰 *TOTAL: TZS ${total.toLocaleString()}*

`;

    // Add customer note if provided
    if (customerNote) {
        message += `📝 *Customer Note:*
${customerNote}

`;
    }

    message += `Thank you for shopping with *Mwashi Gadgets*.`;

    const phone = "255623468239";

    window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
    );
}

// INIT
renderCart();
function showToast(message) {

    let toast = document.createElement("div");

    toast.className = "toast";

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.remove();
    }, 2500);
}