// ===============================
// GET PRODUCT FROM URL
// ===============================
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));

const product = products.find(p => p.id === productId);

if (!product) {
    document.body.innerHTML = "<h2>Product not found</h2>";
    throw new Error("Product not found");
}

// ===============================
// CART COUNT
// ===============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const count = document.getElementById("count");
if (count) {
    count.textContent = cart.reduce((t, item) => t + item.qty, 0);
}

// ===============================
// STATE (SELECTED OPTIONS)
// ===============================
let selectedStorage = product.storage 
    ? Object.keys(product.storage)[0] 
    : null;

let selectedColour = product.colours 
    ? product.colours[0] 
    : null;

let selectedAccessories = [];

// ===============================
// DISPLAY PRODUCT INFO
// ===============================
document.getElementById("productName").textContent = product.name;
document.getElementById("productDescription").textContent = product.description;
document.getElementById("productImage").src = product.image;

// ===============================
// ACCESSORIES DATA
// ===============================

const accessories = accessoryProducts;
// ===============================
// STORAGE OPTIONS
// ===============================

const storageOptions =
document.getElementById("storageOptions");


if(product.storage){

    Object.entries(product.storage).forEach(
        ([storage, price]) => {


        const btn = document.createElement("button");

        btn.className = "option-btn";

        btn.textContent = storage;


        if(storage === selectedStorage){

            btn.classList.add("active");

        }


        btn.onclick = () => {


            selectedStorage = storage;


            document
            .querySelectorAll("#storageOptions .option-btn")
            .forEach(b =>
                b.classList.remove("active")
            );


            btn.classList.add("active");


            updatePrice();

        };


        storageOptions.appendChild(btn);


    });

}
// ===============================
// COLOUR OPTIONS
// ===============================
const colourOptions = document.getElementById("colourOptions");

product.colours.forEach(colour => {

    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = colour;

    if (colour === selectedColour) {
        btn.classList.add("active");
    }

    btn.onclick = () => {

        selectedColour = colour;

        document.querySelectorAll("#colourOptions .option-btn")
            .forEach(b => b.classList.remove("active"));

        btn.classList.add("active");
    };

    colourOptions.appendChild(btn);
});

// ===============================
// ACCESSORY OPTIONS
// ===============================

const accessoryOptions = document.getElementById("accessoryOptions");

accessories.forEach(item => {

    const card = document.createElement("div");
    card.className = "accessory-card";

    card.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <h4>${item.name}</h4>
        <p>TZS ${item.price.toLocaleString()}</p>

        <button class="accessory-btn">
            Add
        </button>
    `;

    const button = card.querySelector(".accessory-btn");

    button.onclick = () => {

        const exists = selectedAccessories.find(a => a.name === item.name);

        if (exists) {

            selectedAccessories = selectedAccessories.filter(
                a => a.name !== item.name
            );

            card.classList.remove("selected");
            button.textContent = "Add";

        } else {

            selectedAccessories.push(item);

            card.classList.add("selected");
            button.textContent = "Added ✓";
        }

        updatePrice();
    };

    accessoryOptions.appendChild(card);

});
// ===============================
// PRICE UPDATE
// ===============================
function updatePrice(){

    let basePrice;


    if(product.storage){

        basePrice = product.storage[selectedStorage];

    } else {

        basePrice = product.price;

    }


    const accessoriesTotal = selectedAccessories.reduce(
        (sum,item)=>sum+item.price,
        0
    );


    const total = basePrice + accessoriesTotal;


    document.getElementById("productPrice").textContent =
    "TZS " + total.toLocaleString();

}

// INITIAL PRICE LOAD
updatePrice();

// ===============================
// ADD TO CART
// ===============================
document.getElementById("addToCartBtn").addEventListener("click", () => {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

   const basePrice = product.storage
    ? product.storage[selectedStorage]
    : product.price;

    const accessoriesTotal = selectedAccessories.reduce(
        (sum, item) => sum + item.price,
        0
    );

    const finalPrice = basePrice + accessoriesTotal;

    cart.push({
        id: product.id,
        name: product.name,
        image: product.image,
        storage: selectedStorage,
        colour: selectedColour,
        accessories: selectedAccessories,
        price: finalPrice,
        qty: 1
    });

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart successfully!");
});
document.getElementById("installmentBtn").onclick = () => {


    const basePrice = product.storage
        ? product.storage[selectedStorage]
        : product.price;


    const accessoriesTotal =
        selectedAccessories.reduce(
            (sum,item)=>sum+item.price,
            0
        );


    const finalPrice =
        basePrice + accessoriesTotal;



    const installmentProduct = {

        id: product.id,

        name: product.name,

        image: product.image,

        storage: selectedStorage,

        colour: selectedColour,

        accessories: selectedAccessories,

        price: finalPrice

    };


    localStorage.setItem(
        "installmentProduct",
        JSON.stringify(installmentProduct)
    );


    window.location.href =
    `installment.html?id=${product.id}`;

};