// ===============================
// GET PRODUCT FROM URL
// ===============================

const params = new URLSearchParams(window.location.search);

const productId = Number(params.get("id"));

const product = products.find(
    p => p.id === productId
);


if (!product) {

    document.body.innerHTML =
    "<h2>Product not found.</h2>";

    throw new Error("Product not found");

}



// ===============================
// HELPERS
// ===============================


const qs = (id) =>
document.getElementById(id);



const formatMoney = (amount) =>
"TZS " + Number(amount).toLocaleString();





// ===============================
// INTEREST CALCULATOR
// ===============================


function getInterestRate(months){


    switch(months){


        case 3:
            return 0.05;


        case 4:
            return 0.07;


        case 6:
            return 0.10;


        case 8:
            return 0.12;


        case 12:
            return 0.15;


        default:
            return 0.15;

    }


}






// ===============================
// STORAGE SELECTION
// ===============================


let cashPrice =
product.storage
?
product.storage[
Object.keys(product.storage)[0]
]
:
product.price;



const storageSelect =
qs("storageSelect");



if(product.storage){


Object.entries(product.storage)
.forEach(([storage,price])=>{


const option =
document.createElement("option");


option.value = price;


option.textContent =
`${storage} - TZS ${price.toLocaleString()}`;


storageSelect.appendChild(option);


});



storageSelect.addEventListener(
"change",
()=>{


cashPrice =
Number(storageSelect.value);



qs("cashPrice").textContent =
formatMoney(cashPrice);



calculateInstallment();


});



}






// ===============================
// DISPLAY PRODUCT
// ===============================


qs("productImage").src =
product.image;


qs("productName").textContent =
product.name;


qs("cashPrice").textContent =
formatMoney(cashPrice);






// ===============================
// FINANCING CALCULATOR
// ===============================



function calculateInstallment(){



let deposit =
Number(
qs("depositAmount").value
)
||0;



// Prevent invalid deposit

deposit =
Math.min(
deposit,
cashPrice
);





const months =
Number(
qs("loanPeriod").value
);





const loan =
cashPrice - deposit;





const interestRate =
getInterestRate(months);





const interest =
loan * interestRate;





const total =
loan + interest;





const monthlyPayment =
total / months;







// UPDATE DISPLAY


qs("cashPriceSummary").textContent =
formatMoney(cashPrice);



qs("downAmount").textContent =
formatMoney(deposit);



qs("remaining").textContent =
formatMoney(loan);



qs("interestRate").textContent =
(interestRate * 100) + "%";



qs("totalPayment").textContent =
formatMoney(total);



qs("monthly").textContent =
formatMoney(monthlyPayment);



qs("duration").textContent =
months + " Months";



}








// ===============================
// CALCULATOR EVENTS
// ===============================


qs("depositAmount")
.addEventListener(
"input",
calculateInstallment
);



qs("loanPeriod")
.addEventListener(
"change",
calculateInstallment
);






// ===============================
// SUBMIT APPLICATION
// ===============================


qs("submitApplication")
.onclick = ()=>{



const name =
qs("customerName")
.value.trim();



const phone =
qs("customerPhone")
.value.trim();



const nida =
qs("customerNida")
.value.trim();



const occupation =
qs("occupation")
.value.trim();



const employer =
qs("employer")
.value.trim();



const region =
qs("region")
.value.trim();



const district =
qs("district")
.value.trim();



const address =
qs("address")
.value.trim();



const agree =
qs("agree")
.checked;





if(
!name ||
!phone ||
!occupation ||
!region ||
!district
){


alert(
"Please complete all required fields."
);


return;


}






if(!agree){


alert(
"Please accept the Terms & Conditions."
);


return;


}







let deposit =
Number(
qs("depositAmount").value
)
||0;



deposit =
Math.min(
deposit,
cashPrice
);





const months =
Number(
qs("loanPeriod").value
);





const loan =
cashPrice - deposit;





const interestRate =
getInterestRate(months);





const interest =
loan * interestRate;





const total =
loan + interest;





const monthlyPayment =
total / months;






const storage =
storageSelect.value
?
storageSelect.options[
storageSelect.selectedIndex
].text
:
"Standard";








const message =

`*MWASHI GADGETS PHONE FINANCING APPLICATION*


📱 PRODUCT

${product.name}



📦 STORAGE

${storage}



💰 CASH PRICE

${formatMoney(cashPrice)}



💵 DEPOSIT

${formatMoney(deposit)}



🏦 LOAN AMOUNT

${formatMoney(loan)}



📅 REPAYMENT PERIOD

${months} Months



📈 INTEREST RATE

${interestRate * 100}%



💳 TOTAL REPAYMENT

${formatMoney(total)}



💰 MONTHLY PAYMENT

${formatMoney(monthlyPayment)}




----------------------

CUSTOMER INFORMATION



Name:
${name}



Phone:
${phone}



National ID:
${nida}



Occupation:
${occupation}



Employer:
${employer}



Region:
${region}



District:
${district}



Address:
${address}



APPLICATION STATUS:

Pending Review`;






window.open(

"https://wa.me/255623468239?text="
+
encodeURIComponent(message),

"_blank"

);



};