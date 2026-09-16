"use strict";

/*
=========================================================
MWASHI GADGETS
PHONE INSTALLMENT APPLICATION
=========================================================

RULES:
- ONLY phones can use installments.
- Accessories / AirPods are blocked.
- Product catalogue comes from Supabase.
- Product loading is asynchronous.
- Waits for "mwashiProductsLoaded".
- Selected product comes from localStorage.
- URL ?id= is used as fallback.
- Application is saved to Supabase.
- order_type = "installment".
- WhatsApp opens after successful save.
=========================================================
*/


/* =====================================================
   HELPERS
===================================================== */

function qs(id) {

    return document.getElementById(id);

}


function cleanText(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ");

}


function formatMoney(amount) {

    return (
        "TZS " +
        Number(amount || 0).toLocaleString(
            "en-TZ",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        )
    );

}


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


function validatePhone(phone) {

    const cleaned =
        String(phone || "")
            .replace(/[\s\-()+]/g, "");


    return /^(255|0)?[67][0-9]{8}$/.test(
        cleaned
    );

}


function generateOrderNumber() {

    const now =
        new Date();


    const timestamp =
        now.toISOString()
            .replace(/\D/g, "")
            .substring(0, 14);


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return (
        "MG-INST-" +
        timestamp +
        "-" +
        random
    );

}


/* =====================================================
   SHOW ERROR PAGE
===================================================== */

function showPageError(
    title,
    message
) {

    document.body.innerHTML = `

        <main style="
            max-width:650px;
            margin:80px auto;
            padding:30px;
            text-align:center;
            font-family:Arial,sans-serif;
        ">

            <h2>
                ${title}
            </h2>

            <p>
                ${message}
            </p>

            <a
                href="index.html"
                style="
                    display:inline-block;
                    margin-top:15px;
                    padding:10px 18px;
                    background:#111827;
                    color:white;
                    text-decoration:none;
                    border-radius:8px;
                "
            >
                Return to Store
            </a>

        </main>

    `;

}


/* =====================================================
   URL
===================================================== */

const params =
    new URLSearchParams(
        window.location.search
    );


const urlProductId =
    Number(
        params.get("id")
    );


/* =====================================================
   SAVED PRODUCT
===================================================== */

function getSavedInstallmentProduct() {

    try {

        const stored =
            localStorage.getItem(
                "installmentProduct"
            );


        if (!stored) {

            return null;

        }


        const parsed =
            JSON.parse(
                stored
            );


        if (
            !parsed ||
            typeof parsed !== "object"
        ) {

            return null;

        }


        return parsed;

    }
    catch (error) {

        console.error(
            "Could not read installmentProduct:",
            error
        );


        return null;

    }

}


/* =====================================================
   PHONE DETECTION
===================================================== */

function isPhoneProduct(item) {

    if (!item) {

        return false;

    }


    /*
    -----------------------------------------------------
    EXPLICIT ACCESSORY BLOCK
    -----------------------------------------------------
    */

    const type =
        String(
            item.type || ""
        )
        .trim()
        .toLowerCase();


    const category =
        String(
            item.category || ""
        )
        .trim()
        .toLowerCase();


    const subcategory =
        String(
            item.subcategory || ""
        )
        .trim()
        .toLowerCase();


    const accessoryValues = [

        "accessory",
        "accessories",
        "audio",
        "earbuds",
        "headphones",
        "airpods",
        "cable",
        "cables",
        "charger",
        "charging",
        "case",
        "cases",
        "screen protection",
        "screen protector"

    ];


    if (
        accessoryValues.includes(type) ||
        accessoryValues.includes(category) ||
        accessoryValues.includes(subcategory)
    ) {

        return false;

    }


    /*
    -----------------------------------------------------
    EXPLICIT PHONE CATEGORY
    -----------------------------------------------------
    */

    const phoneValues = [

        "phone",
        "phones",
        "smartphone",
        "smartphones",
        "mobile",
        "mobile phone",
        "mobile phones"

    ];


    if (
        phoneValues.includes(type) ||
        phoneValues.includes(category) ||
        phoneValues.includes(subcategory)
    ) {

        return true;

    }


    /*
    -----------------------------------------------------
    PRODUCT NAME FALLBACK
    -----------------------------------------------------
    */

    const name =
        String(
            item.name || ""
        )
        .trim()
        .toLowerCase();


    const phoneNamePatterns = [

        "iphone",
        "samsung galaxy",
        "google pixel",
        "tecno",
        "infinix",
        "xiaomi",
        "redmi",
        "oneplus",
        "oppo",
        "vivo",
        "realme",
        "nokia",
        "motorola"

    ];


    for (
        let i = 0;
        i < phoneNamePatterns.length;
        i++
    ) {

        if (
            name.includes(
                phoneNamePatterns[i]
            )
        ) {

            return true;

        }

    }


    return false;

}


/* =====================================================
   GET STORAGE PRICE
===================================================== */

function getStoragePrice(
    product,
    storage,
    condition
) {

    if (
        !product ||
        !product.storage
    ) {

        return 0;

    }


    let storageData =
        product.storage;


    /*
    Supabase JSONB normally arrives
    already parsed as an object.

    This fallback handles a string
    JSON value as well.
    */

    if (
        typeof storageData === "string"
    ) {

        try {

            storageData =
                JSON.parse(
                    storageData
                );

        }
        catch (error) {

            return 0;

        }

    }


    if (
        typeof storageData !== "object" ||
        storageData === null
    ) {

        return 0;

    }


    if (
        !storage ||
        !storageData[storage]
    ) {

        return 0;

    }


    const selected =
        storageData[storage];


    if (
        typeof selected === "number"
    ) {

        return Number(
            selected
        );

    }


    if (
        typeof selected !== "object" ||
        selected === null
    ) {

        return 0;

    }


    if (
        condition === "used"
    ) {

        return Number(
            selected.used || 0
        );

    }


    return Number(
        selected.new || 0
    );

}


/* =====================================================
   INITIALIZE INSTALLMENT PAGE
===================================================== */

async function initializeInstallmentPage(
    loadedProducts
) {

    /*
    -----------------------------------------------------
    PRODUCT ARRAY
    -----------------------------------------------------
    */

    const catalogue =
        Array.isArray(
            loadedProducts
        )
            ? loadedProducts
            : [];


    if (
        catalogue.length === 0
    ) {

        showPageError(
            "Products Could Not Be Loaded",
            "We could not load the current product catalogue. Please return to the store and try again."
        );

        return;

    }


    /*
    -----------------------------------------------------
    SAVED PRODUCT
    -----------------------------------------------------
    */

    const savedProduct =
        getSavedInstallmentProduct();


    /*
    -----------------------------------------------------
    DETERMINE PRODUCT ID
    -----------------------------------------------------
    */

    let productId = 0;


    if (
        savedProduct &&
        savedProduct.id !== undefined &&
        savedProduct.id !== null
    ) {

        productId =
            Number(
                savedProduct.id
            );

    }


    if (
        !productId &&
        urlProductId
    ) {

        productId =
            urlProductId;

    }


    if (!productId) {

        showPageError(
            "Product Not Found",
            "No phone was selected for installment payment. Please return to the store and select a phone again."
        );

        return;

    }


    /*
    -----------------------------------------------------
    FIND PRODUCT
    -----------------------------------------------------
    */

    const product =
        catalogue.find(
            function (item) {

                return (
                    Number(item.id) ===
                    productId
                );

            }
        );


    if (!product) {

        console.error(
            "Installment product ID not found:",
            productId
        );


        console.log(
            "Available product IDs:",
            catalogue.map(
                function (item) {
                    return item.id;
                }
            )
        );


        showPageError(
            "Product Not Found",
            "The selected phone could not be found in the current catalogue. Please return to the store and select the phone again."
        );

        return;

    }


    /*
    -----------------------------------------------------
    INSTALLMENT MUST BE ENABLED
    -----------------------------------------------------
    */

    const installmentEnabled =
        product.installment === true ||
        String(
            product.installment
        )
        .trim()
        .toLowerCase() === "true";


    if (!installmentEnabled) {

        showPageError(
            "Installment Not Available",
            "Installment payment is not available for this product."
        );

        return;

    }


    /*
    -----------------------------------------------------
    PHONE ONLY
    -----------------------------------------------------
    */

    if (
        !isPhoneProduct(
            product
        )
    ) {

        showPageError(
            "Installment Not Available",
            "Installment payment is available for smartphones only. Accessories, AirPods and other electronic products cannot be purchased through installments."
        );

        return;

    }


    /*
    -----------------------------------------------------
    SELECTED STORAGE
    -----------------------------------------------------
    */

    let selectedStorage =
        savedProduct &&
        savedProduct.storage
            ? savedProduct.storage
            : null;


    if (
        !selectedStorage &&
        product.storage &&
        typeof product.storage === "object"
    ) {

        const storageKeys =
            Object.keys(
                product.storage
            );


        if (
            storageKeys.length > 0
        ) {

            selectedStorage =
                storageKeys[0];

        }

    }


    /*
    -----------------------------------------------------
    SELECTED CONDITION
    -----------------------------------------------------
    */

    let selectedCondition =
        "new";


    if (
        savedProduct &&
        savedProduct.condition
    ) {

        const condition =
            String(
                savedProduct.condition
            )
            .trim()
            .toLowerCase();


        if (
            condition === "new" ||
            condition === "used"
        ) {

            selectedCondition =
                condition;

        }

    }


    /*
    -----------------------------------------------------
    SELECTED COLOUR
    -----------------------------------------------------
    */

    let selectedColour =
        savedProduct &&
        savedProduct.colour
            ? savedProduct.colour
            : null;


    /*
    -----------------------------------------------------
    SELECTED ACCESSORIES
    -----------------------------------------------------
    */

    let selectedAccessories =
        [];


    if (
        savedProduct &&
        Array.isArray(
            savedProduct.accessories
        )
    ) {

        selectedAccessories =
            savedProduct.accessories;

    }


    /*
    -----------------------------------------------------
    PRICE
    -----------------------------------------------------
    */

    let cashPrice =
        getStoragePrice(
            product,
            selectedStorage,
            selectedCondition
        );


    /*
    If storage pricing isn't available,
    use the saved product-page price.
    */

    if (
        cashPrice <= 0 &&
        savedProduct &&
        Number(savedProduct.price) > 0
    ) {

        cashPrice =
            Number(
                savedProduct.price
            );

    }


    /*
    Final fallback.
    */

    if (
        cashPrice <= 0
    ) {

        cashPrice =
            Number(
                product.price || 0
            );

    }


    /*
    -----------------------------------------------------
    PRODUCT IMAGE
    -----------------------------------------------------
    */

    const productImage =
        qs("productImage");


    if (productImage) {

        productImage.src =
            product.image || "";


        productImage.alt =
            product.name ||
            "Phone";

    }


    /*
    -----------------------------------------------------
    PRODUCT NAME
    -----------------------------------------------------
    */

    const productName =
        qs("productName");


    if (productName) {

        productName.textContent =
            product.name ||
            "Product";

    }


    /*
    -----------------------------------------------------
    STORAGE SELECT
    -----------------------------------------------------
    */

    const storageSelect =
        qs("storageSelect");


    if (
        storageSelect &&
        product.storage &&
        typeof product.storage === "object"
    ) {

        storageSelect.innerHTML =
            "";


        Object.keys(
            product.storage
        ).forEach(
            function (storage) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    storage;


                option.textContent =
                    storage;


                if (
                    storage ===
                    selectedStorage
                ) {

                    option.selected =
                        true;

                }


                storageSelect.appendChild(
                    option
                );

            }
        );

    }


    /*
    -----------------------------------------------------
    CONDITION
    -----------------------------------------------------
    */

    const conditionSelect =
        qs("conditionSelect");


    function updateConditionDisplay() {

        if (!conditionSelect) {

            return;

        }


        const optionExists =
            Array.from(
                conditionSelect.options
            )
            .some(
                function (option) {

                    return (
                        option.value ===
                        selectedCondition
                    );

                }
            );


        if (optionExists) {

            conditionSelect.value =
                selectedCondition;

        }

    }


    /*
    -----------------------------------------------------
    PRICE DISPLAY
    -----------------------------------------------------
    */

    const cashPriceElement =
        qs("cashPrice");


    function updatePriceDisplay() {

        if (cashPriceElement) {

            cashPriceElement.textContent =
                formatMoney(
                    cashPrice
                );

        }


        const summary =
            qs("cashPriceSummary");


        if (summary) {

            summary.textContent =
                formatMoney(
                    cashPrice
                );

        }

    }


    /*
    -----------------------------------------------------
    STORAGE CHANGE
    -----------------------------------------------------
    */

    if (storageSelect) {

        storageSelect.addEventListener(
            "change",
            function () {

                selectedStorage =
                    storageSelect.value;


                selectedCondition =
                    "new";


                const storagePrice =
                    getStoragePrice(
                        product,
                        selectedStorage,
                        selectedCondition
                    );


                if (
                    storagePrice > 0
                ) {

                    cashPrice =
                        storagePrice;

                }


                updateConditionDisplay();

                updatePriceDisplay();

                calculateInstallment();

            }
        );

    }


    /*
    -----------------------------------------------------
    CONDITION CHANGE
    -----------------------------------------------------
    */

    if (conditionSelect) {

        conditionSelect.addEventListener(
            "change",
            function () {

                selectedCondition =
                    conditionSelect.value
                        .toLowerCase();


                const conditionPrice =
                    getStoragePrice(
                        product,
                        selectedStorage,
                        selectedCondition
                    );


                if (
                    conditionPrice > 0
                ) {

                    cashPrice =
                        conditionPrice;

                }


                updatePriceDisplay();

                calculateInstallment();

            }
        );

    }


    /*
    -----------------------------------------------------
    INTEREST
    -----------------------------------------------------
    */

    function getInterestRate(months) {

        switch (
            Number(months)
        ) {

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
                return 0;

        }

    }


    /*
    -----------------------------------------------------
    CALCULATE INSTALLMENT
    -----------------------------------------------------
    */

    function calculateInstallment() {

        const depositElement =
            qs("depositAmount");


        if (!depositElement) {

            return;

        }


        let deposit =
            Number(
                depositElement.value
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
                qs("loanPeriod")?.value || 0
            );


        if (!months) {

            return;

        }


        const loan =
            cashPrice -
            deposit;


        const interestRate =
            getInterestRate(
                months
            );


        const interest =
            loan *
            interestRate;


        const total =
            loan +
            interest;


        const monthlyPayment =
            total /
            months;


        const summary =
            qs("cashPriceSummary");


        if (summary) {

            summary.textContent =
                formatMoney(
                    cashPrice
                );

        }


        const downAmount =
            qs("downAmount");


        if (downAmount) {

            downAmount.textContent =
                formatMoney(
                    deposit
                );

        }


        const remaining =
            qs("remaining");


        if (remaining) {

            remaining.textContent =
                formatMoney(
                    loan
                );

        }


        const interestRateElement =
            qs("interestRate");


        if (interestRateElement) {

            interestRateElement.textContent =
                (
                    interestRate * 100
                ) +
                "%";

        }


        const totalPayment =
            qs("totalPayment");


        if (totalPayment) {

            totalPayment.textContent =
                formatMoney(
                    total
                );

        }


        const monthly =
            qs("monthly");


        if (monthly) {

            monthly.textContent =
                formatMoney(
                    monthlyPayment
                );

        }


        const duration =
            qs("duration");


        if (duration) {

            duration.textContent =
                months +
                " Months";

        }


        updateConditionDisplay();

    }


    /*
    -----------------------------------------------------
    DEPOSIT INPUT
    -----------------------------------------------------
    */

    const depositInput =
        qs("depositAmount");


    if (depositInput) {

        depositInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "-" ||
                    event.key === "e" ||
                    event.key === "E"
                ) {

                    event.preventDefault();

                }

            }
        );


        depositInput.addEventListener(
            "input",
            function () {

                let value =
                    depositInput.value
                        .replace(
                            /[^0-9.]/g,
                            ""
                        );


                const parts =
                    value.split(".");


                if (
                    parts.length > 2
                ) {

                    value =
                        parts[0] +
                        "." +
                        parts
                            .slice(1)
                            .join("");

                }


                let number =
                    Number(value);


                if (
                    Number.isNaN(number) ||
                    number < 0
                ) {

                    number = 0;

                }


                if (
                    number > cashPrice
                ) {

                    number =
                        cashPrice;

                }


                depositInput.value =
                    number || "";


                calculateInstallment();

            }
        );

    }


    /*
    -----------------------------------------------------
    LOAN PERIOD
    -----------------------------------------------------
    */

    const loanPeriod =
        qs("loanPeriod");


    if (loanPeriod) {

        loanPeriod.addEventListener(
            "change",
            calculateInstallment
        );

    }


    /*
    -----------------------------------------------------
    BUILD NOTES
    -----------------------------------------------------
    */

    function buildApplicationNotes(
        data
    ) {

        return `
INSTALLMENT APPLICATION

PRODUCT
Product: ${data.productName}
Product ID: ${data.productId}
Storage: ${data.storage}
Condition: ${data.condition}
Colour: ${data.colour || "Not specified"}

FINANCING
Cash Price: ${formatMoney(data.cashPrice)}
Initial Deposit: ${formatMoney(data.deposit)}
Loan Amount: ${formatMoney(data.loan)}
Interest Rate: ${data.interestRate * 100}%
Repayment Period: ${data.months} Months
Total Repayment: ${formatMoney(data.total)}
Monthly Payment: ${formatMoney(data.monthlyPayment)}

CUSTOMER INFORMATION
Name: ${data.name}
Phone: ${data.phone}
National ID: ${data.nida || "Not provided"}
Occupation: ${data.occupation}
Employer / Business: ${data.employer || "Not provided"}
Region: ${data.region}
District: ${data.district}
Residential Address: ${data.address || "Not provided"}

APPLICATION STATUS
Pending Review
`.trim();

    }


    /*
    -----------------------------------------------------
    SAVE APPLICATION
    -----------------------------------------------------
    */

    async function saveInstallmentApplication(
        data
    ) {

        if (
            typeof requireSupabase !==
            "function"
        ) {

            throw new Error(
                "Supabase client is not available."
            );

        }


        const sb =
            requireSupabase();


        const orderNumber =
            generateOrderNumber();


        /*
        CREATE ORDER
        */

        const orderPayload = {

            order_number:
                orderNumber,

            customer_name:
                data.name,

            customer_phone:
                normalizePhone(
                    data.phone
                ),

            customer_email:
                null,

            delivery_address:
                data.address ||
                null,

            delivery_city:
                data.district ||
                null,

            payment_method:
                "Installment",

            payment_status:
                "pending",

            order_status:
                "pending",

            subtotal:
                data.cashPrice,

            delivery_fee:
                0,

            total:
                data.total,

            notes:
                buildApplicationNotes(
                    data
                ),

            order_type:
                "installment"

        };


        const {
            data: order,
            error: orderError
        } = await sb
            .from("orders")
            .insert(
                orderPayload
            )
            .select(
                "id, order_number"
            )
            .single();


        if (orderError) {

            throw orderError;

        }


        if (!order) {

            throw new Error(
                "The installment order was not created."
            );

        }


        /*
        CREATE ORDER ITEM
        */

        const itemPayload = {

            order_id:
                order.id,

            product_id:
                data.productId,

            product_name:
                data.productName,

            product_image:
                product.image ||
                null,

            storage:
                data.storage ||
                null,

            condition:
                data.condition ||
                null,

            colour:
                data.colour ||
                null,

            accessories:
                Array.isArray(
                    data.accessories
                )
                    ? data.accessories
                    : [],

            quantity:
                1,

            unit_price:
                data.cashPrice,

            total_price:
                data.cashPrice

        };


        const {
            error: itemError
        } = await sb
            .from("order_items")
            .insert(
                itemPayload
            );


        if (itemError) {

            /*
            Roll back parent order.
            */

            await sb
                .from("orders")
                .delete()
                .eq(
                    "id",
                    order.id
                );


            throw itemError;

        }


        return order;

    }


    /*
    -----------------------------------------------------
    SUBMIT APPLICATION
    -----------------------------------------------------
    */

    const submitApplication =
        qs("submitApplication");


    if (submitApplication) {

        submitApplication.onclick =
            async function () {

                /*
                CUSTOMER INFORMATION
                */

                const name =
                    cleanText(
                        qs(
                            "customerName"
                        )?.value
                    );


                const phone =
                    cleanText(
                        qs(
                            "customerPhone"
                        )?.value
                    );


                const nida =
                    cleanText(
                        qs(
                            "customerNida"
                        )?.value
                    );


                const occupation =
                    cleanText(
                        qs(
                            "occupation"
                        )?.value
                    );


                const employer =
                    cleanText(
                        qs(
                            "employer"
                        )?.value
                    );


                const region =
                    cleanText(
                        qs(
                            "region"
                        )?.value
                    );


                const district =
                    cleanText(
                        qs(
                            "district"
                        )?.value
                    );


                const address =
                    cleanText(
                        qs(
                            "address"
                        )?.value
                    );


                const agreement =
                    qs("agree");


                const agree =
                    agreement
                        ? agreement.checked
                        : false;


                /*
                VALIDATION
                */

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


                if (
                    !validatePhone(
                        phone
                    )
                ) {

                    alert(
                        "Please enter a valid Tanzanian phone number."
                    );


                    qs(
                        "customerPhone"
                    )?.focus();


                    return;

                }


                if (!agree) {

                    alert(
                        "Please accept the Terms & Conditions."
                    );

                    return;

                }


                /*
                DEPOSIT
                */

                let deposit =
                    Number(
                        qs(
                            "depositAmount"
                        )?.value
                    ) || 0;


                deposit =
                    Math.max(
                        0,
                        Math.min(
                            deposit,
                            cashPrice
                        )
                    );


                /*
                LOAN PERIOD
                */

                const months =
                    Number(
                        qs(
                            "loanPeriod"
                        )?.value
                    );


                const allowedPeriods = [

                    3,
                    4,
                    6,
                    8,
                    12

                ];


                if (
                    !allowedPeriods.includes(
                        months
                    )
                ) {

                    alert(
                        "Please select a valid repayment period."
                    );

                    return;

                }


                /*
                FINANCIAL CALCULATION
                */

                const loan =
                    cashPrice -
                    deposit;


                const interestRate =
                    getInterestRate(
                        months
                    );


                const interest =
                    loan *
                    interestRate;


                const total =
                    loan +
                    interest;


                const monthlyPayment =
                    total /
                    months;


                /*
                PRODUCT OPTIONS
                */

                const storage =
                    selectedStorage ||
                    "Standard";


                const condition =
                    selectedCondition === "used"
                        ? "Used"
                        : "New / Full Box";


                /*
                APPLICATION DATA
                */

                const applicationData = {

                    productId:
                        product.id,

                    productName:
                        product.name,

                    storage:
                        storage,

                    condition:
                        condition,

                    colour:
                        selectedColour,

                    cashPrice:
                        cashPrice,

                    deposit:
                        deposit,

                    loan:
                        loan,

                    interestRate:
                        interestRate,

                    months:
                        months,

                    total:
                        total,

                    monthlyPayment:
                        monthlyPayment,

                    accessories:
                        selectedAccessories,

                    name:
                        name,

                    phone:
                        phone,

                    nida:
                        nida,

                    occupation:
                        occupation,

                    employer:
                        employer,

                    region:
                        region,

                    district:
                        district,

                    address:
                        address

                };


                /*
                DISABLE BUTTON
                */

                submitApplication.disabled =
                    true;


                submitApplication.textContent =
                    "Saving Application...";


                try {

                    /*
                    SAVE TO SUPABASE
                    */

                    const savedOrder =
                        await saveInstallmentApplication(
                            applicationData
                        );


                    /*
                    ACCESSORIES MESSAGE
                    */

                    const accessoriesText =
                        selectedAccessories.length > 0

                            ? selectedAccessories
                                .map(
                                    function (item) {

                                        if (
                                            typeof item ===
                                            "string"
                                        ) {

                                            return item;

                                        }


                                        return (
                                            item.name +
                                            " - " +
                                            formatMoney(
                                                item.price
                                            )
                                        );

                                    }
                                )
                                .join("\n")

                            : "None";


                    /*
                    WHATSAPP MESSAGE
                    */

                    const message = `
*MWASHI GADGETS PHONE FINANCING APPLICATION*

📋 ORDER NUMBER

${savedOrder.order_number}


📱 PRODUCT

${product.name}


📦 STORAGE

${storage}


🎨 COLOUR

${selectedColour || "Not specified"}


📱 CONDITION

${condition}


💰 CASH PRICE

${formatMoney(cashPrice)}


💵 INITIAL DEPOSIT

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
${nida || "Not provided"}

Occupation:
${occupation}

Employer:
${employer || "Not provided"}

Region:
${region}

District:
${district}

Address:
${address || "Not provided"}


APPLICATION STATUS

Pending Review
`.trim();


                    /*
                    OPEN WHATSAPP
                    */

                    window.open(
                        "https://wa.me/255623468239?text=" +
                        encodeURIComponent(
                            message
                        ),
                        "_blank"
                    );


                    alert(
                        "Installment application submitted successfully. WhatsApp will now open."
                    );

                }
                catch (error) {

                    console.error(
                        "Installment application error:",
                        error
                    );


                    alert(
                        "We could not save your installment application.\n\n" +
                        (
                            error.message ||
                            "Unknown error."
                        )
                    );

                }
                finally {

                    submitApplication.disabled =
                        false;


                    submitApplication.textContent =
                        "Submit Application";

                }

            };

    }


    /*
    -----------------------------------------------------
    INITIAL DISPLAY
    -----------------------------------------------------
    */

    updateConditionDisplay();

    updatePriceDisplay();

    calculateInstallment();

}


/* =====================================================
   WAIT FOR SUPABASE PRODUCTS
===================================================== */

/*
    products.js loads the catalogue asynchronously.

    We therefore DO NOT search products immediately.

    Instead, we wait for the custom event fired by
    products.js after Supabase has returned the catalogue.
*/

window.addEventListener(
    "mwashiProductsLoaded",
    function (event) {

        const loadedProducts =
            event.detail?.products ||
            window.products ||
            [];


        initializeInstallmentPage(
            loadedProducts
        );

    },
    {
        once: true
    }
);


/* =====================================================
   FALLBACK
===================================================== */

/*
    This handles the unlikely case where
    products.js finished before installment.js
    registered the event listener.
*/

if (
    Array.isArray(window.products) &&
    window.products.length > 0
) {

    initializeInstallmentPage(
        window.products
    );

}