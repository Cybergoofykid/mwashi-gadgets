"use strict";

/*
=========================================================
MWASHI GADGETS
PRODUCT REQUEST SYSTEM
=========================================================

Features:

- Dynamic request categories
- Category-specific brands
- Smartphone configurations
- Laptop configurations
- Tablet configurations
- Audio configurations
- Smartwatch configurations
- Gaming configurations
- Accessories
- Customer validation
- Delivery method
- Supabase order creation
- order_type = "request"
- Requested budget stored as subtotal and total
- order_items record created
- WhatsApp notification
=========================================================
*/


/* =====================================================
   ELEMENTS
===================================================== */

const form =
    document.getElementById("device-request-form");

const category =
    document.getElementById("category");

const brand =
    document.getElementById("brand");

const dynamicFields =
    document.getElementById("dynamic-fields");

const gamingFields =
    document.getElementById("gaming-fields");

const gamingDynamicFields =
    document.getElementById("gaming-dynamic-fields");

const accessoriesList =
    document.getElementById("accessories-list");

const addAccessoryButton =
    document.getElementById("add-accessory");

const submitButton =
    document.getElementById("submitRequest");


/* =====================================================
   CATEGORY BRANDS
===================================================== */
const categoryBrands = {

    Smartphone: [
        "Apple",
        "Samsung",
        "Google Pixel",
        "Nothing"
    ],

    Laptop: [
        "HP",
        "Dell",
        "Lenovo",
        "Microsoft Surface",
        "Apple MacBook"
    ],

    Tablet: [
        "Apple",
        "Samsung",
        "Google",
        "Tecno",
        "Infinix",
        "Lenovo",
        "Huawei",
        "Xiaomi",
        "Honor",
        "Other"
    ],

    Audio: [
        "Apple",
        "Samsung",
        "JBL",
        "Sony",
        "Bose",
        "Oraimo",
        "Anker",
        "Xiaomi",
        "Soundcore",
        "Other"
    ],

    Smartwatch: [
        "Apple",
        "Samsung",
        "Google",
        "Nothing",
        "Oraimo",
        "Huawei",
        "Xiaomi",
        "Amazfit",
        "Garmin",
        "Other"
    ],

    Gaming: [
        "Sony PlayStation",
        "Microsoft Xbox",
        "Nintendo",
        "ASUS",
        "Lenovo",
        "MSI",
        "Acer",
        "HP",
        "Dell",
        "Other"
    ],

    Accessories: [
        "Apple",
        "Samsung",
        "Google",
        "Xiaomi",
        "Anker",
        "Baseus",
        "Oraimo",
        "UGREEN",
        "JBL",
        "Other"
    ],

    "Other Electronics": [
        "Apple",
        "Samsung",
        "Sony",
        "LG",
        "Hisense",
        "Xiaomi",
        "Other"
    ]

};


/* =====================================================
   DYNAMIC CATEGORY FIELDS
===================================================== */

const categoryFields = {


    Smartphone: {

        icon: "📱",

        description:
            "Choose the storage and SIM/connectivity configuration.",

        fields: [

            {
                id: "storage",
                name: "storage",
                label: "Storage",
                type: "select",
                required: true,
                options: [
                    "128GB",
                    "256GB",
                    "512GB",
                    "1TB"
                ]
            },

            {
                id: "simConnectivity",
                name: "simConnectivity",
                label: "SIM / Connectivity",
                type: "select",
                required: true,
                options: [
                    "Single SIM",
                    "Dual SIM",
                    "eSIM",
                    "Dual SIM + eSIM"
                ]
            }

        ]

    },


    Laptop: {

        icon: "💻",

        description:
            "Specify the processor, RAM, storage and screen size.",

        fields: [

            {
                id: "processor",
                name: "processor",
                label: "Processor",
                type: "text",
                placeholder:
                    "e.g. Intel Core i5 / Core i7 / Apple M-series",
                required: false,
                full: true
            },

            {
                id: "ram",
                name: "ram",
                label: "RAM",
                type: "select",
                required: true,
                options: [
                    "4GB",
                    "8GB",
                    "16GB",
                    "32GB",
                    "64GB"
                ]
            },

            {
                id: "laptopStorage",
                name: "storage",
                label: "Storage",
                type: "select",
                required: true,
                options: [
                    "256GB SSD",
                    "512GB SSD",
                    "1TB SSD",
                    "2TB SSD"
                ]
            },

            {
                id: "screen",
                name: "screen",
                label: "Screen Size",
                type: "select",
                required: true,
                options: [
                    "13 inch",
                    "13.3 inch",
                    "14 inch",
                    "15.6 inch",
                    "16 inch",
                    "17 inch"
                ]
            }

        ]

    },


    Tablet: {

        icon: "📲",

        description:
            "Choose storage capacity and connectivity.",

        fields: [

            {
                id: "tabletStorage",
                name: "storage",
                label: "Storage",
                type: "select",
                required: true,
                options: [
                    "64GB",
                    "128GB",
                    "256GB",
                    "512GB",
                    "1TB"
                ]
            },

            {
                id: "tabletConnectivity",
                name: "connectivity",
                label: "Connectivity",
                type: "select",
                required: true,
                options: [
                    "Wi-Fi Only",
                    "Wi-Fi + Cellular",
                    "5G"
                ]
            }

        ]

    },


    Audio: {

        icon: "🎧",

        description:
            "Select the audio product and connection type.",

        fields: [

            {
                id: "audioType",
                name: "audioType",
                label: "Audio Type",
                type: "select",
                required: true,
                options: [
                    "Earbuds",
                    "Headphones",
                    "Bluetooth Speaker",
                    "Soundbar",
                    "Home Theatre",
                    "Microphone",
                    "Other Audio"
                ]
            },

            {
                id: "connection",
                name: "connection",
                label: "Connectivity",
                type: "select",
                required: true,
                options: [
                    "Bluetooth",
                    "Wired",
                    "Bluetooth + Wired",
                    "USB",
                    "USB + Bluetooth",
                    "Wireless"
                ]
            }

        ]

    },


    Smartwatch: {

        icon: "⌚",

        description:
            "Choose the watch size and connectivity.",

        fields: [

            {
                id: "watchSize",
                name: "watchSize",
                label: "Watch Size",
                type: "select",
                required: true,
                options: [
                    "40mm",
                    "41mm",
                    "42mm",
                    "44mm",
                    "45mm",
                    "46mm",
                    "49mm"
                ]
            },

            {
                id: "watchConnectivity",
                name: "connectivity",
                label: "Connectivity",
                type: "select",
                required: true,
                options: [
                    "Bluetooth",
                    "Bluetooth + Wi-Fi",
                    "Cellular",
                    "GPS",
                    "GPS + Cellular"
                ]
            }

        ]

    },


    Accessories: {

        icon: "🔌",

        description:
            "Select the type of accessory you are looking for.",

        fields: [

            {
                id: "accessoryType",
                name: "accessoryType",
                label: "Accessory Type",
                type: "select",
                required: true,
                options: [
                    "Phone Case",
                    "Screen Protector",
                    "Charger",
                    "Cable",
                    "Power Bank",
                    "Car Charger",
                    "Wireless Charger",
                    "Adapter",
                    "Other Accessory"
                ]
            }

        ]

    },


    "Other Electronics": {

        icon: "⚡",

        description:
            "Describe the electronics product and specifications you need.",

        fields: [

            {
                id: "otherSpecifications",
                name: "otherSpecifications",
                label: "Product Description / Specifications",
                type: "textarea",
                required: true,
                full: true,
                rows: 5,
                placeholder:
                    "Describe the product, model, specifications or features you need..."
            }

        ]

    }

};


/* =====================================================
   GAMING CONFIGURATIONS
===================================================== */

const gamingConfigurations = {

    "PlayStation": [

        {
            id: "gamingModel",
            name: "gamingModel",
            label: "PlayStation Model",
            type: "select",
            required: true,
            options: [
                "PS5",
                "PS5 Slim",
                "PS5 Pro",
                "PS4",
                "PS4 Pro"
            ]
        },

        {
            id: "gamingStorage",
            name: "gamingStorage",
            label: "Storage",
            type: "select",
            required: false,
            options: [
                "825GB",
                "1TB",
                "2TB"
            ]
        },

        {
            id: "gamingEdition",
            name: "gamingEdition",
            label: "Edition",
            type: "select",
            required: false,
            options: [
                "Standard",
                "Digital Edition",
                "Disc Edition"
            ]
        }

    ],

    "Xbox": [

        {
            id: "gamingModel",
            name: "gamingModel",
            label: "Xbox Model",
            type: "select",
            required: true,
            options: [
                "Xbox Series S",
                "Xbox Series X",
                "Xbox One S",
                "Xbox One X"
            ]
        },

        {
            id: "gamingStorage",
            name: "gamingStorage",
            label: "Storage",
            type: "select",
            required: false,
            options: [
                "512GB",
                "1TB",
                "2TB"
            ]
        }

    ],

    "Nintendo": [

        {
            id: "gamingModel",
            name: "gamingModel",
            label: "Nintendo Model",
            type: "select",
            required: true,
            options: [
                "Nintendo Switch",
                "Nintendo Switch OLED",
                "Nintendo Switch Lite"
            ]
        },

        {
            id: "gamingStorage",
            name: "gamingStorage",
            label: "Storage",
            type: "select",
            required: false,
            options: [
                "32GB",
                "64GB",
                "128GB"
            ]
        }

    ],

    "Gaming PC": [

        {
            id: "gpu",
            name: "gpu",
            label: "Graphics Card",
            type: "text",
            placeholder:
                "e.g. RTX 4060 / RTX 4070 / RX 7600",
            required: false
        },

        {
            id: "gamingStorage",
            name: "gamingStorage",
            label: "Storage",
            type: "select",
            required: false,
            options: [
                "512GB SSD",
                "1TB SSD",
                "2TB SSD",
                "4TB SSD"
            ]
        },

        {
            id: "ram",
            name: "ram",
            label: "RAM",
            type: "select",
            required: false,
            options: [
                "8GB",
                "16GB",
                "32GB",
                "64GB"
            ]
        }

    ],

    "Gaming Monitor": [

        {
            id: "screenSize",
            name: "screenSize",
            label: "Screen Size",
            type: "select",
            required: true,
            options: [
                "24 inch",
                "27 inch",
                "32 inch",
                "34 inch",
                "43 inch"
            ]
        },

        {
            id: "resolution",
            name: "resolution",
            label: "Resolution",
            type: "select",
            required: true,
            options: [
                "Full HD",
                "2K / QHD",
                "4K UHD"
            ]
        },

        {
            id: "refreshRate",
            name: "refreshRate",
            label: "Refresh Rate",
            type: "select",
            required: false,
            options: [
                "60Hz",
                "75Hz",
                "120Hz",
                "144Hz",
                "165Hz",
                "240Hz"
            ]
        }

    ],

    "Gaming Accessories": [

        {
            id: "gamingAccessoryType",
            name: "gamingAccessoryType",
            label: "Gaming Accessory",
            type: "select",
            required: true,
            options: [
                "Controller",
                "Gaming Headset",
                "Gaming Keyboard",
                "Gaming Mouse",
                "Gaming Chair",
                "Gaming Steering Wheel",
                "Other Gaming Accessory"
            ]
        }

    ]

};


/* =====================================================
   HELPERS
===================================================== */

function cleanText(value) {

    return String(value || "")
        .replace(/[<>]/g, "")
        .trim();

}


function formatMoney(value) {

    const number =
        Number(value) || 0;

    return new Intl.NumberFormat(
        "en-TZ"
    ).format(number);

}


function getFieldValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? cleanText(element.value)
        : "";

}


function getSelectedRadio(name) {

    const selected =
        document.querySelector(
            `input[name="${name}"]:checked`
        );

    return selected
        ? cleanText(selected.value)
        : "";

}


/* =====================================================
   PHONE VALIDATION
===================================================== */

function normalizePhone(phone) {

    let cleaned =
        String(phone || "")
            .replace(/\D/g, "");

    if (cleaned.startsWith("255")) {

        return cleaned;

    }

    if (cleaned.startsWith("0")) {

        return "255" + cleaned.substring(1);

    }

    if (cleaned.startsWith("6") ||
        cleaned.startsWith("7") ||
        cleaned.startsWith("8") ||
        cleaned.startsWith("9")) {

        return "255" + cleaned;

    }

    return cleaned;

}


function validatePhone(phone) {

    const normalized =
        normalizePhone(phone);

    return /^255(6|7|8|9)\d{8}$/.test(
        normalized
    );

}


/* =====================================================
   ORDER NUMBER
===================================================== */

function generateOrderNumber() {

    const now =
        new Date();

    const timestamp =
        now
            .toISOString()
            .replace(/\D/g, "")
            .substring(0, 14);

    const random =
        Math.floor(
            100 +
            Math.random() * 900
        );

    return `REQ-${timestamp}-${random}`;

}


/* =====================================================
   RENDER BRAND OPTIONS
===================================================== */

function renderBrands(selectedCategory) {

    if (!brand) {
        return;
    }

    brand.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        selectedCategory
            ? "Select brand"
            : "Select category first";

    brand.appendChild(
        defaultOption
    );

    if (!selectedCategory) {

        brand.disabled = true;

        return;

    }

    brand.disabled = false;

    const brands =
        categoryBrands[selectedCategory] || [];

    brands.forEach(
        brandName => {

            const option =
                document.createElement("option");

            option.value =
                brandName;

            option.textContent =
                brandName;

            brand.appendChild(
                option
            );

        }
    );

}


/* =====================================================
   CREATE FIELD HTML
===================================================== */

function createDynamicField(field) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "dynamic-field";

    if (field.full) {

        wrapper.classList.add("full");

    }


    const label =
        document.createElement("label");

    label.setAttribute(
        "for",
        field.id
    );

    label.textContent =
        field.label;


    if (field.required) {

        const required =
            document.createElement("span");

        required.textContent =
            " *";

        required.style.color =
            "#ef4444";

        label.appendChild(
            required
        );

    }


    wrapper.appendChild(
        label
    );


    let element;


    /* SELECT */

    if (field.type === "select") {

        element =
            document.createElement("select");

        element.id =
            field.id;

        element.name =
            field.name;

        if (field.required) {

            element.required = true;

        }

        const placeholder =
            document.createElement("option");

        placeholder.value = "";

        placeholder.textContent =
            `Select ${field.label.toLowerCase()}`;

        element.appendChild(
            placeholder
        );


        field.options.forEach(
            optionValue => {

                const option =
                    document.createElement("option");

                option.value =
                    optionValue;

                option.textContent =
                    optionValue;

                element.appendChild(
                    option
                );

            }
        );

    }


    /* TEXTAREA */

    else if (field.type === "textarea") {

        element =
            document.createElement("textarea");

        element.id =
            field.id;

        element.name =
            field.name;

        element.rows =
            field.rows || 5;

        element.placeholder =
            field.placeholder || "";

        if (field.required) {

            element.required = true;

        }

    }


    /* INPUT */

    else {

        element =
            document.createElement("input");

        element.type =
            field.type || "text";

        element.id =
            field.id;

        element.name =
            field.name;

        element.placeholder =
            field.placeholder || "";

        if (field.required) {

            element.required = true;

        }

    }


    wrapper.appendChild(
        element
    );

    return wrapper;

}


/* =====================================================
   RENDER DYNAMIC FIELDS
===================================================== */

function renderDynamicFields() {

    if (!dynamicFields) {
        return;
    }

    dynamicFields.innerHTML = "";

    if (!category.value) {

        return;

    }

    const configuration =
        categoryFields[category.value];

    if (!configuration) {

        return;

    }


    const header =
        document.createElement("div");

    header.className =
        "dynamic-category-header";


    const icon =
        document.createElement("div");

    icon.className =
        "dynamic-category-icon";

    icon.textContent =
        configuration.icon;


    const text =
        document.createElement("div");


    const strong =
        document.createElement("strong");

    strong.textContent =
        `${category.value} Details`;


    const description =
        document.createElement("span");

    description.textContent =
        configuration.description;


    text.appendChild(
        strong
    );

    text.appendChild(
        description
    );


    header.appendChild(
        icon
    );

    header.appendChild(
        text
    );


    dynamicFields.appendChild(
        header
    );


    const grid =
        document.createElement("div");

    grid.className =
        "dynamic-grid";


    configuration.fields.forEach(
        field => {

            grid.appendChild(
                createDynamicField(field)
            );

        }
    );


    dynamicFields.appendChild(
        grid
    );

}


/* =====================================================
   RENDER GAMING
===================================================== */

function renderGamingFields() {

    if (!gamingFields ||
        !gamingDynamicFields) {

        return;

    }


    gamingDynamicFields.innerHTML = "";


    if (category.value !== "Gaming") {

        gamingFields.hidden = true;

        return;

    }


    gamingFields.hidden = false;


    const typeField =
        document.createElement("div");

    typeField.className =
        "dynamic-field full";


    const label =
        document.createElement("label");

    label.setAttribute(
        "for",
        "gamingType"
    );

    label.innerHTML =
        'Gaming Product Type <span style="color:#ef4444">*</span>';


    const select =
        document.createElement("select");

    select.id =
        "gamingType";

    select.name =
        "gamingType";

    select.required = true;


    const placeholder =
        document.createElement("option");

    placeholder.value = "";

    placeholder.textContent =
        "Select gaming product type";

    select.appendChild(
        placeholder
    );


    Object.keys(
        gamingConfigurations
    ).forEach(
        type => {

            const option =
                document.createElement("option");

            option.value =
                type;

            option.textContent =
                type;

            select.appendChild(
                option
            );

        }
    );


    typeField.appendChild(
        label
    );

    typeField.appendChild(
        select
    );


    gamingDynamicFields.appendChild(
        typeField
    );


    select.addEventListener(
        "change",
        renderGamingConfiguration
    );

}


function renderGamingConfiguration() {

    if (!gamingDynamicFields) {
        return;
    }


    const gamingType =
        getFieldValue("gamingType");


    const existingFields =
        gamingDynamicFields.querySelectorAll(
            ".gaming-specific-field"
        );

    existingFields.forEach(
        element => element.remove()
    );


    if (!gamingType) {

        return;

    }


    const fields =
        gamingConfigurations[
            gamingType
        ] || [];


    fields.forEach(
        field => {

            const element =
                createDynamicField(field);

            element.classList.add(
                "gaming-specific-field"
            );

            gamingDynamicFields.appendChild(
                element
            );

        }
    );

}


/* =====================================================
   ACCESSORIES
===================================================== */

function createAccessoryRow() {

    const row =
        document.createElement("div");

    row.className =
        "accessory-row";


    const input =
        document.createElement("input");

    input.type =
        "text";

    input.name =
        "accessory[]";

    input.placeholder =
        "e.g. Charger, phone case, screen protector";

    input.maxLength =
        100;


    const removeButton =
        document.createElement("button");

    removeButton.type =
        "button";

    removeButton.className =
        "remove-accessory";

    removeButton.setAttribute(
        "aria-label",
        "Remove accessory"
    );

    removeButton.title =
        "Remove accessory";

    removeButton.textContent =
        "×";


    row.appendChild(
        input
    );

    row.appendChild(
        removeButton
    );


    return row;

}


function addAccessoryField() {

    if (!accessoriesList) {
        return;
    }

    accessoriesList.appendChild(
        createAccessoryRow()
    );

}


function getAccessories() {

    if (!accessoriesList) {

        return [];

    }


    const inputs =
        accessoriesList.querySelectorAll(
            'input[name="accessory[]"]'
        );


    return Array.from(inputs)

        .map(
            input =>
                cleanText(input.value)
        )

        .filter(
            value => value.length > 0
        );

}


/* =====================================================
   ACCESSORY EVENTS
===================================================== */

if (addAccessoryButton) {

    addAccessoryButton.addEventListener(
        "click",
        addAccessoryField
    );

}


if (accessoriesList) {

    accessoriesList.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    ".remove-accessory"
                );

            if (!button) {
                return;
            }


            const rows =
                accessoriesList.querySelectorAll(
                    ".accessory-row"
                );


            const row =
                button.closest(
                    ".accessory-row"
                );


            /*
            Keep at least one accessory
            field visible.
            */

            if (rows.length <= 1) {

                const input =
                    row.querySelector(
                        "input"
                    );

                if (input) {

                    input.value = "";

                    input.focus();

                }

                return;

            }


            row.remove();

        }
    );

}


/* =====================================================
   COLLECT DYNAMIC DATA
===================================================== */

function collectDynamicFields() {

    const details = {};


    const ids = [

        "storage",

        "simConnectivity",

        "processor",

        "ram",

        "screen",

        "connectivity",

        "audioType",

        "connection",

        "watchSize",

        "watchConnectivity",

        "accessoryType",

        "otherSpecifications",

        "gamingType",

        "gamingModel",

        "gamingStorage",

        "gamingEdition",

        "gpu",

        "resolution",

        "refreshRate",

        "screenSize",

        "gamingAccessoryType"

    ];


    ids.forEach(
        id => {

            const value =
                getFieldValue(id);

            if (value) {

                details[id] =
                    value;

            }

        }
    );


    return details;

}


/* =====================================================
   BUILD WHATSAPP MESSAGE
===================================================== */

function buildWhatsAppMessage(
    requestNumber
) {

    const customerName =
        cleanText(
            document.getElementById(
                "customerName"
            ).value
        );

    const phone =
        cleanText(
            document.getElementById(
                "phone"
            ).value
        );

    const selectedCategory =
        cleanText(
            category.value
        );

    const selectedBrand =
        cleanText(
            brand.value
        );

    const productName =
        cleanText(
            document.getElementById(
                "productName"
            ).value
        );

    const condition =
        getSelectedRadio(
            "condition"
        );

    const budget =
        Number(
            document.getElementById(
                "budget"
            ).value
        ) || 0;

    const deliveryMethod =
        getSelectedRadio(
            "deliveryMethod"
        );

    const preferredDate =
        cleanText(
            document.getElementById(
                "preferredDate"
            ).value
        );

    const notes =
        cleanText(
            document.getElementById(
                "notes"
            ).value
        );

    const dynamicDetails =
        collectDynamicFields();

    const accessories =
        getAccessories();


    const lines = [];


    lines.push(
        "*MWASHI GADGETS - PRODUCT REQUEST*"
    );

    lines.push("");

    lines.push(
        `Request Number: ${requestNumber}`
    );

    lines.push("");

    lines.push(
        "*CUSTOMER INFORMATION*"
    );

    lines.push(
        `Name: ${customerName}`
    );

    lines.push(
        `Phone: ${phone}`
    );

    lines.push("");

    lines.push(
        "*PRODUCT INFORMATION*"
    );

    lines.push(
        `Category: ${selectedCategory}`
    );

    lines.push(
        `Brand: ${selectedBrand || "Any"}`
    );

    lines.push(
        `Product / Model: ${productName}`
    );

    lines.push(
        `Condition: ${condition}`
    );


    Object.entries(
        dynamicDetails
    ).forEach(
        ([key, value]) => {

            const label =
                key
                    .replace(
                        /([A-Z])/g,
                        " $1"
                    )
                    .replace(
                        /^./,
                        character =>
                            character.toUpperCase()
                    );

            lines.push(
                `${label}: ${value}`
            );

        }
    );


    if (accessories.length > 0) {

        lines.push("");

        lines.push(
            "*ACCESSORIES*"
        );

        accessories.forEach(
            accessory => {

                lines.push(
                    `• ${accessory}`
                );

            }
        );

    }


    lines.push("");

    lines.push(
        "*BUDGET & DELIVERY*"
    );

    lines.push(
        `Budget: TZS ${formatMoney(budget)}`
    );

    lines.push(
        `Delivery: ${deliveryMethod}`
    );

    lines.push(
        `Preferred Date: ${
            preferredDate || "No preference"
        }`
    );


    if (notes) {

        lines.push("");

        lines.push(
            "*ADDITIONAL NOTES*"
        );

        lines.push(
            notes
        );

    }


    lines.push("");

    lines.push(
        "Thank you for choosing Mwashi Gadgets."
    );


    return lines.join("\n");

}


/* =====================================================
   BUILD DATABASE NOTES
===================================================== */

function buildRequestNotes() {

    const deliveryMethod =
        getSelectedRadio(
            "deliveryMethod"
        );

    const preferredDate =
        cleanText(
            document.getElementById(
                "preferredDate"
            ).value
        );

    const notes =
        cleanText(
            document.getElementById(
                "notes"
            ).value
        );

    const dynamicDetails =
        collectDynamicFields();

    const accessories =
        getAccessories();


    const lines = [];


    lines.push(
        "PRODUCT REQUEST"
    );

    lines.push(
        `Category: ${category.value}`
    );

    lines.push(
        `Brand: ${brand.value || "Any"}`
    );

    lines.push(
        `Condition: ${
            getSelectedRadio("condition")
        }`
    );

    lines.push(
        `Delivery Method: ${deliveryMethod}`
    );

    lines.push(
        `Preferred Date: ${
            preferredDate || "No preference"
        }`
    );


    if (
        Object.keys(dynamicDetails).length
    ) {

        lines.push("");

        lines.push(
            "PRODUCT SPECIFICATIONS:"
        );


        Object.entries(
            dynamicDetails
        ).forEach(
            ([key, value]) => {

                lines.push(
                    `${key}: ${value}`
                );

            }
        );

    }


    if (accessories.length > 0) {

        lines.push("");

        lines.push(
            "ACCESSORIES:"
        );

        accessories.forEach(
            accessory => {

                lines.push(
                    `- ${accessory}`
                );

            }
        );

    }


    if (notes) {

        lines.push("");

        lines.push(
            "CUSTOMER NOTES:"
        );

        lines.push(
            notes
        );

    }


    return lines.join("\n");

}


/* =====================================================
   GET SUPABASE CLIENT
===================================================== */

function getSupabaseClient() {

    if (
        window.requireSupabase &&
        typeof window.requireSupabase === "function"
    ) {

        return window.requireSupabase();

    }


    if (
        window.supabaseClient
    ) {

        return window.supabaseClient;

    }


    if (
        window.sb
    ) {

        return window.sb;

    }


    if (
        window.supabase &&
        typeof window.supabase.from === "function"
    ) {

        return window.supabase;

    }


    throw new Error(
        "Supabase client is not available."
    );

}


/* =====================================================
   SAVE REQUEST TO SUPABASE
===================================================== */

async function saveRequestToSupabase() {

    const supabase =
        getSupabaseClient();


    const customerName =
        cleanText(
            document.getElementById(
                "customerName"
            ).value
        );

    const rawPhone =
        cleanText(
            document.getElementById(
                "phone"
            ).value
        );

    const normalizedPhone =
        normalizePhone(
            rawPhone
        );

    const selectedCategory =
        cleanText(
            category.value
        );

    const selectedProductName =
        cleanText(
            document.getElementById(
                "productName"
            ).value
        ) ||
        "Product Request";

    const selectedBrand =
        cleanText(
            brand.value
        );

    const condition =
        getSelectedRadio(
            "condition"
        );

    const deliveryMethod =
        getSelectedRadio(
            "deliveryMethod"
        );

    const budget =
        Number(
            document.getElementById(
                "budget"
            ).value
        ) || 0;

    const accessories =
        getAccessories();

    const requestNotes =
        buildRequestNotes();


    const dynamicDetails =
        collectDynamicFields();


    /*
    Store storage in order_items when
    available.
    */

    const dynamicStorage =
        dynamicDetails.storage ||
        dynamicDetails.gamingStorage ||
        null;


    const orderNumber =
        generateOrderNumber();


    /* =================================================
       ORDER
    ================================================= */

    const orderPayload = {

        order_number:
            orderNumber,

        customer_name:
            customerName,

        customer_phone:
            normalizedPhone,

        customer_email:
            null,

        delivery_address:
            null,

        delivery_city:
            null,

        payment_method:
            "WhatsApp",

        payment_status:
            "pending",

        order_status:
            "pending",

        subtotal:
            budget,

        delivery_fee:
            0,

        total:
            budget,

        notes:
            requestNotes,

        order_type:
            "request"

    };


    const {
        data: orderData,
        error: orderError
    } =
        await supabase

            .from("orders")

            .insert(
                orderPayload
            )

            .select(
                "id, order_number"
            )

            .single();


    if (orderError) {

        console.error(
            "Order insert error:",
            orderError
        );

        throw new Error(
            orderError.message ||
            "Failed to save request."
        );

    }


    /* =================================================
       ORDER ITEM
    ================================================= */

    const itemPayload = {

        order_id:
            orderData.id,

        product_id:
            null,

        product_name:
            selectedProductName,

        product_image:
            null,

        storage:
            dynamicStorage,

        condition:
            condition,

        colour:
            null,

        accessories:
            accessories.length > 0
                ? accessories.join(", ")
                : null,

        quantity:
            1,

        unit_price:
            budget,

        total_price:
            budget

    };


    const {
        error: itemError
    } =
        await supabase

            .from("order_items")

            .insert(
                itemPayload
            );


    if (itemError) {

        console.error(
            "Order item insert error:",
            itemError
        );


        /*
        Roll back the parent request
        if the item cannot be created.
        */

        await supabase

            .from("orders")

            .delete()

            .eq(
                "id",
                orderData.id
            );


        throw new Error(
            itemError.message ||
            "Failed to save request item."
        );

    }


    return {

        id:
            orderData.id,

        orderNumber:
            orderData.order_number

    };

}


/* =====================================================
   CATEGORY CHANGE
===================================================== */

if (category) {

    category.addEventListener(
        "change",
        () => {

            renderBrands(
                category.value
            );

            renderDynamicFields();

            renderGamingFields();

        }
    );

}


/* =====================================================
   FORM SUBMIT
===================================================== */

if (form) {

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            /*
            Native validation.
            */

            if (
                !form.checkValidity()
            ) {

                form.reportValidity();

                return;

            }


            const phone =
                cleanText(
                    document.getElementById(
                        "phone"
                    ).value
                );


            if (
                !validatePhone(phone)
            ) {

                alert(
                    "Please enter a valid Tanzanian phone number, e.g. 0712345678 or +255712345678."
                );

                document
                    .getElementById("phone")
                    .focus();

                return;

            }


            const originalButtonText =
                submitButton
                    ? submitButton.innerHTML
                    : "";


            try {

                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.innerHTML =
                        "⏳ Saving Request...";

                }


                /*
                Save to Supabase FIRST.
                */

                const savedRequest =
                    await saveRequestToSupabase();


                /*
                Build WhatsApp message
                after successful save.
                */

                const whatsappMessage =
                    buildWhatsAppMessage(
                        savedRequest.orderNumber
                    );


                /*
                Mwashi Gadgets WhatsApp number.
                */

    
const whatsappNumber =
    "255623468239";

const whatsappUrl =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        whatsappMessage
    )}`;
                /*
                Open WhatsApp.
                */

                window.open(
                    whatsappUrl,
                    "_blank",
                    "noopener,noreferrer"
                );


                alert(
                    `Request submitted successfully!\n\nRequest Number: ${savedRequest.orderNumber}\n\nYou will now continue to WhatsApp.`
                );


                /*
                Reset form.
                */

                form.reset();


                /*
                Restore brand state.
                */

                renderBrands("");


                /*
                Clear dynamic fields.
                */

                if (dynamicFields) {

                    dynamicFields.innerHTML =
                        "";

                }


                /*
                Clear gaming.
                */

                if (gamingDynamicFields) {

                    gamingDynamicFields.innerHTML =
                        "";

                }


                if (gamingFields) {

                    gamingFields.hidden =
                        true;

                }


                /*
                Restore one clean
                accessory field.
                */

                if (accessoriesList) {

                    accessoriesList.innerHTML =
                        "";

                    accessoriesList.appendChild(
                        createAccessoryRow()
                    );

                }

            }

            catch (error) {

                console.error(
                    "Request submission error:",
                    error
                );


                alert(
                    "We could not submit your request.\n\nPlease try again. If the problem continues, contact Mwashi Gadgets directly."
                );

            }

            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.innerHTML =
                        originalButtonText;

                }

            }

        }
    );

}


/* =====================================================
   INITIAL STATE
===================================================== */

renderBrands("");

renderDynamicFields();

renderGamingFields();


/* =====================================================
   SYSTEM LOG
===================================================== */

console.log(
    "Mwashi Gadgets Product Request System loaded successfully."
);
