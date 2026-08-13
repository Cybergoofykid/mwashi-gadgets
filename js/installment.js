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
// SELECTED PRODUCT OPTIONS
// ===============================

// Try to recover the selection
// saved from product.js

const savedProduct =
    JSON.parse(
        localStorage.getItem("installmentProduct")
    ) || null;


let selectedStorage =
    savedProduct?.storage ||
    (
        product.storage
            ? Object.keys(product.storage)[0]
            : null
    );


let selectedCondition =
    savedProduct?.condition ||
    "new";


// ===============================
// GET CURRENT PRODUCT PRICE
// ===============================

function getProductPrice() {

    // Products without storage
    if (!product.storage) {

        return Number(product.price) || 0;

    }


    const storageData =
        product.storage[selectedStorage];


    if (!storageData) {

        return 0;

    }


    // New / Full Box
    if (selectedCondition === "new") {

        return Number(storageData.new) || 0;

    }


    // Used
    if (selectedCondition === "used") {

        return Number(storageData.used) || 0;

    }


    return 0;

}


// ===============================
// CASH PRICE
// ===============================

let cashPrice =
    getProductPrice();


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
// DISPLAY STORAGE
// ===============================

const storageSelect =
    qs("storageSelect");


if (
    storageSelect &&
    product.storage
) {

    storageSelect.innerHTML = "";


    Object.keys(product.storage)
        .forEach(storage => {

            const option =
                document.createElement("option");


            option.value =
                storage;


            option.textContent =
                storage;


            if (
                storage ===
                selectedStorage
            ) {

                option.selected = true;

            }


            storageSelect.appendChild(option);

        });


    storageSelect.addEventListener(
        "change",
        () => {

            selectedStorage =
                storageSelect.value;


            // Reset condition to NEW
            // when storage changes

            selectedCondition =
                "new";


            updateConditionDisplay();

            updatePrice();

        }
    );

}


// ===============================
// CONDITION DISPLAY
// ===============================

function updateConditionDisplay() {

    let conditionElement =
        qs("conditionDisplay");


    if (!conditionElement) {

        return;

    }


    if (
        selectedCondition === "new"
    ) {

        conditionElement.textContent =
            "New / Full Box";

    }

    else {

        conditionElement.textContent =
            "Used";

    }

}


// ===============================
// PRICE UPDATE
// ===============================

function updatePrice() {

    cashPrice =
        getProductPrice();


    qs("cashPrice").textContent =
        formatMoney(cashPrice);


    const summary =
        qs("cashPriceSummary");


    if (summary) {

        summary.textContent =
            formatMoney(cashPrice);

    }


    calculateInstallment();

}


// ===============================
// DEPOSIT INPUT PROTECTION
// ===============================

const depositInput =
    qs("depositAmount");


if (depositInput) {


    // Block negative sign
    // and scientific notation

    depositInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "-" ||
                event.key === "e" ||
                event.key === "E"
            ) {

                event.preventDefault();

            }

        }
    );


    // Clean pasted values

    depositInput.addEventListener(
        "input",
        () => {

            let value =
                depositInput.value;


            // Remove anything except
            // numbers and decimal point

            value =
                value.replace(
                    /[^0-9.]/g,
                    ""
                );


            // Only allow one decimal

            const parts =
                value.split(".");


            if (parts.length > 2) {

                value =
                    parts[0] +
                    "." +
                    parts.slice(1).join("");

            }


            // Prevent negative values

            let number =
                Number(value);


            if (number < 0) {

                value = "0";

            }


            depositInput.value =
                value;


            calculateInstallment();

        }
    );

}


// ===============================
// INTEREST RATES
// ===============================

function getInterestRate(months) {

    switch (months) {

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
// FINANCING CALCULATOR
// ===============================

function calculateInstallment() {


    let deposit =
        Number(
            qs("depositAmount").value
        ) || 0;


    // Prevent negative deposit

    if (deposit < 0) {

        deposit = 0;

    }


    // Deposit cannot exceed price

    deposit =
        Math.min(
            deposit,
            cashPrice
        );


    // Keep input synchronized

    qs("depositAmount").value =
        deposit || "";


    const months =
        Number(
            qs("loanPeriod").value
        );


    if (!months) {

        return;

    }


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


    // ===============================
    // UPDATE SUMMARY
    // ===============================

    const cashSummary =
        qs("cashPriceSummary");


    if (cashSummary) {

        cashSummary.textContent =
            formatMoney(cashPrice);

    }


    qs("downAmount").textContent =
        formatMoney(deposit);


    qs("remaining").textContent =
        formatMoney(loan);


    const interestElement =
        qs("interestRate");


    if (interestElement) {

        interestElement.textContent =
            (interestRate * 100) + "%";

    }


    qs("totalPayment").textContent =
        formatMoney(total);


    qs("monthly").textContent =
        formatMoney(monthlyPayment);


    qs("duration").textContent =
        months + " Months";


    updateConditionDisplay();

}


// ===============================
// LOAN PERIOD
// ===============================

const loanPeriod =
    qs("loanPeriod");


if (loanPeriod) {

    loanPeriod.addEventListener(
        "change",
        calculateInstallment
    );

}


// ===============================
// SUBMIT APPLICATION
// ===============================

qs("submitApplication").onclick =
    () => {


        // ===============================
        // CUSTOMER INFORMATION
        // ===============================

        const name =
            qs("customerName")
                .value
                .trim();


        const phone =
            qs("customerPhone")
                .value
                .trim();


        const nida =
            qs("customerNida")
                .value
                .trim();


        const occupation =
            qs("occupation")
                .value
                .trim();


        const employer =
            qs("employer")
                .value
                .trim();


        const region =
            qs("region")
                .value
                .trim();


        const district =
            qs("district")
                .value
                .trim();


        const address =
            qs("address")
                .value
                .trim();


        const agree =
            qs("agree")
                .checked;


        // ===============================
        // VALIDATION
        // ===============================

        if (
            !name ||
            !phone ||
            !occupation ||
            !region ||
            !district
        ) {

            alert(
                "Please complete all required fields."
            );

            return;

        }


        if (!agree) {

            alert(
                "Please accept the Terms & Conditions."
            );

            return;

        }


        // ===============================
        // FINANCING VALUES
        // ===============================

        let deposit =
            Number(
                qs("depositAmount").value
            ) || 0;


        deposit =
            Math.max(
                0,
                Math.min(
                    deposit,
                    cashPrice
                )
            );


        const months =
            Number(
                qs("loanPeriod").value
            );


        if (
            ![
                3,
                4,
                6,
                8,
                12
            ].includes(months)
        ) {

            alert(
                "Please select a valid repayment period."
            );

            return;

        }


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


        // ===============================
        // STORAGE
        // ===============================

        const storage =
            selectedStorage ||
            "Standard";


        // ===============================
        // CONDITION
        // ===============================

        const condition =
            selectedCondition === "new"
                ? "New / Full Box"
                : "Used";


        // ===============================
        // ACCESSORIES
        // ===============================

        let accessoriesText =
            "None";


        if (
            savedProduct &&
            savedProduct.accessories &&
            savedProduct.accessories.length
        ) {

            accessoriesText =
                savedProduct.accessories
                    .map(
                        item =>
                            `${item.name} - ${formatMoney(item.price)}`
                    )
                    .join("\n");

        }


        // ===============================
        // WHATSAPP MESSAGE
        // ===============================

        const message =

`*MWASHI GADGETS PHONE FINANCING APPLICATION*

📱 PRODUCT

${product.name}


📦 STORAGE

${storage}


📱 CONDITION

${condition}


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


🎧 ACCESSORIES

${accessoriesText}


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


        // ===============================
        // OPEN WHATSAPP
        // ===============================

        window.open(

            "https://wa.me/255623468239?text=" +
            encodeURIComponent(message),

            "_blank"

        );

    };


// ===============================
// INITIALIZE
// ===============================

updateConditionDisplay();

updatePrice();