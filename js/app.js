/* ===============================
   MWASHI GADGETS HOME PAGE
================================ */

// ===============================
// CART
// ===============================

let homeCart = [];

try {
    const storedCart = JSON.parse(localStorage.getItem("cart"));
    homeCart = Array.isArray(storedCart) ? storedCart : [];
} catch (e) {
    homeCart = [];
    localStorage.removeItem("cart");
}


const grid = document.getElementById("product-grid");
const search = document.getElementById("search");
const count = document.getElementById("count");


// ===============================
// SECURITY HELPERS
// ===============================

function sanitizeInput(input) {

    if (typeof input !== 'string') return '';

    return input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
        .trim();

}


function validatePhone(phone) {

    const regex = /^(0\d{9}|255\d{9})$/;

    return regex.test(phone);

}


// ===============================
// CART COUNT
// ===============================

function updateCartCount(){

    if(!count) return;

    count.innerText = homeCart.reduce(
        (total,item)=> total + item.qty,
        0
    );

}


updateCartCount();



// ===============================
// SAVE CART
// ===============================

function saveCart(){

    localStorage.setItem(
        "cart",
        JSON.stringify(homeCart)
    );

    updateCartCount();

}



// ===============================
// ADD TO CART
// ===============================

function add(id){


    const product =
    products.find(p=>p.id===id);



    if(!product){

        alert("Product not found");

        return;

    }



    // ACCESSORIES DIRECT ADD

    if(product.type?.toLowerCase() === "accessory"){


        const existing =
        homeCart.find(item=>item.id===id);



        if(existing){

            existing.qty++;

        }
        else{


            homeCart.push({

                id:product.id,

                name:product.name,

                image:product.image,

                storage:"Standard",

                colour:
                product.colours?.[0] || "Standard",

                accessories:[],

                price:product.price,

                qty:1

            });


        }



        saveCart();

        alert(product.name+" added to cart");

        return;

    }



    // PHONES OPEN CONFIGURATION

    window.location.href =
    `product.html?id=${id}`;


}



// ===============================
// INSTALLMENT
// ===============================

function applyInstallment(id){

    const product = products.find(p => p.id === id);


    if(!product){

        alert("Product not found");

        return;

    }


    if(product.type === "accessory"){

        alert(
        "Installment payment is only available for smartphones and tablets."
        );

        return;

    }


    window.location.href =
    `installment.html?id=${id}`;

}

// ===============================
// GET PRODUCT STARTING PRICE
// ===============================

function getStartingPrice(product) {

    // Simple numeric price
    if (typeof product.price === "number") {
        return product.price;
    }

    // Products using storage pricing
    if (product.storage && typeof product.storage === "object") {

        const prices = Object.values(product.storage)
            .map(value => {

                // Old structure: 256GB: 3800000
                if (typeof value === "number") {
                    return value;
                }

                // New structure: 256GB: { new: 3800000, used: 3200000 }
                if (value && typeof value === "object") {
                    return value.new;
                }

                return null;
            })
            .filter(price => typeof price === "number");

        if (prices.length > 0) {
            return Math.min(...prices);
        }
    }

    // New price structure
    if (product.price && typeof product.price === "object") {

        const prices = Object.values(product.price)
            .map(value => {

                // Example: 256GB: { new: 3800000, used: 3200000 }
                if (value && typeof value === "object") {
                    return value.new;
                }

                // Example: 256GB: 3800000
                if (typeof value === "number") {
                    return value;
                }

                return null;
            })
            .filter(price => typeof price === "number");

        if (prices.length > 0) {
            return Math.min(...prices);
        }
    }

    return 0;
}
// ===============================
// PRODUCT CARD DISPLAY
// ===============================

function displayProducts(list){


    if(!grid) return;


    grid.innerHTML="";


    if(list.length===0){

        grid.innerHTML =
        `
        <h3 class="no-products">
        No products found.
        </h3>
        `;

        return;

    }



    list.forEach(product=>{


    const safeName = sanitizeInput(product.name);

    const safeImage = sanitizeInput(product.image);

    const isAccessory =
    product.type?.toLowerCase()==="accessory";


const price = getStartingPrice(product);


grid.innerHTML +=

`
<div class="card">


${product.latest ?
`
<span class="badge">
NEW
</span>
`
:
""}

<button class="wishlist">
❤
</button>

<img
src="${safeImage}"
loading="lazy"
class="product-image"
alt="${safeName}"
onerror="this.src='images/loading.png'"

>

<h3>
${product.name}
</h3>
<p class="price">

From TZS ${price.toLocaleString()}

</p>

<div class="card-buttons">

${
isAccessory

?

`

<button

class="cart-btn"

onclick="add(${product.id})">

🛒 Add To Cart

</button>

`

:

`

<button

class="details-btn"

onclick="openProduct(${product.id})">

Configure

</button>



<button

class="cart-btn"

onclick="add(${product.id})">

🛒 Cart

</button>



<button

class="installment-btn"

onclick="applyInstallment(${product.id})">

💳 Installment

</button>


`
}


</div>


</div>

`;



    });


}




// ===============================
// OPEN PRODUCT
// ===============================

function openProduct(id){

    window.location.href =
    `product.html?id=${id}`;

}



// ===============================
// FILTER
// ===============================

let currentCategory="All";


function filterProducts(){


    let filtered=[...products];



    if(currentCategory!=="All"){


        if(currentCategory==="Accessories"){


            filtered =
            filtered.filter(product=>

                product.type?.toLowerCase()
                ==="accessory"

            );


        }

        else{


            filtered =
            filtered.filter(product=>

                product.brand===currentCategory ||

                product.category===currentCategory ||

                product.subcategory===currentCategory ||

                product.name.includes(currentCategory)

            );


        }


    }



    if(search){


        const keyword =
        sanitizeInput(search.value.toLowerCase());



        filtered =
        filtered.filter(product=>

            product.name
            .toLowerCase()
            .includes(keyword)

        );


    }



    displayProducts(filtered);


}




// ===============================
// CATEGORY BUTTONS
// ===============================

document
.querySelectorAll(".category-btn")
.forEach(button=>{


    button.addEventListener(

        "click",

        ()=>{


            document
            .querySelectorAll(".category-btn")
            .forEach(btn=>

                btn.classList.remove("active")

            );



            button.classList.add("active");



            currentCategory =
            button.dataset.category;



            filterProducts();


        }

    );


});




// ===============================
// SEARCH
// ===============================

if(search){

    search.addEventListener(
        "keyup",
        filterProducts
    );

}




// ===============================
// START
// ===============================

displayProducts(products);