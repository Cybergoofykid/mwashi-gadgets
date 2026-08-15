/* =====================================================
   MWASHI GADGETS
   PRODUCT REQUEST SYSTEM
===================================================== */


/* =========================
   ELEMENTS
========================= */

const form = document.getElementById("device-request-form");
const category = document.getElementById("category");
const dynamicFields = document.getElementById("dynamic-fields");
const accessoriesList = document.getElementById("accessories-list");
const addAccessoryButton = document.getElementById("add-accessory");


/* =========================
   CATEGORY FIELDS
========================= */

const categoryFields = {

    Smartphone: [

        {
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
            name: "sim",
            label: "SIM / Connectivity",
            type: "select",
            options: [
                "Physical SIM",
                "eSIM",
                "Physical SIM + eSIM",
                "Either"
            ]
        }

    ],


    Laptop: [

        {
            name: "processor",
            label: "Processor",
            type: "select",
            options: [
                "Intel Core i3",
                "Intel Core i5",
                "Intel Core i7",
                "Intel Core i9",
                "AMD Ryzen 3",
                "AMD Ryzen 5",
                "AMD Ryzen 7",
                "AMD Ryzen 9",
                "Apple M1",
                "Apple M2",
                "Apple M3",
                "Apple M4",
                "Other"
            ]
        },

        {
            name: "ram",
            label: "RAM",
            type: "select",
            options: [
                "4GB",
                "8GB",
                "16GB",
                "32GB",
                "64GB",
                "Other"
            ]
        },

        {
            name: "storage",
            label: "Storage",
            type: "select",
            options: [
                "128GB SSD",
                "256GB SSD",
                "512GB SSD",
                "1TB SSD",
                "2TB SSD",
                "Other"
            ]
        },

        {
            name: "screen",
            label: "Screen Size",
            type: "select",
            options: [
                "13 inch",
                "14 inch",
                "15 inch",
                "16 inch",
                "17 inch",
                "No preference"
            ]
        }

    ],


    Tablet: [

        {
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
            name: "connectivity",
            label: "Connectivity",
            type: "select",
            options: [
                "Wi-Fi Only",
                "Wi-Fi + Cellular",
                "No preference"
            ]
        }

    ],


    Audio: [

        {
            name: "audioType",
            label: "Audio Device Type",
            type: "select",
            required: true,
            options: [
                "Earbuds",
                "Headphones",
                "Speaker",
                "Soundbar",
                "Home Audio",
                "Microphone",
                "Other"
            ]
        },

        {
            name: "connection",
            label: "Connection",
            type: "select",
            options: [
                "Wireless",
                "Wired",
                "Wireless + Wired",
                "No preference"
            ]
        }

    ],


    Smartwatch: [

        {
            name: "watchSize",
            label: "Watch Size",
            type: "select",
            options: [
                "40mm",
                "41mm",
                "42mm",
                "44mm",
                "45mm",
                "46mm",
                "49mm",
                "No preference"
            ]
        },

        {
            name: "watchConnectivity",
            label: "Connectivity",
            type: "select",
            options: [
                "Bluetooth / Wi-Fi",
                "Cellular",
                "No preference"
            ]
        }

    ],


Gaming: [

    {
        name: "gamingType",
        label: "Gaming Platform",
        type: "select",
        required: true,

        options: [
            "PlayStation",
            "Xbox",
            "Nintendo",
            "Gaming PC",
            "Gaming Monitor",
            "Gaming Accessories"
        ]
    },

    {
        name: "gamingModel",
        label: "Console / Device Model",
        type: "select",
        required: true,

        options: []
    },

    {
        name: "gamingStorage",
        label: "Storage",
        type: "select",

        options: []
    }

],


    Accessories: [

        {
            name: "accessoryType",
            label: "Accessory Type",
            type: "select",
            required: true,
            options: [
                "Phone Case",
                "Screen Protector",
                "Charger",
                "Charging Cable",
                "Power Bank",
                "Car Charger",
                "Adapter",
                "Memory Card",
                "Smartwatch Accessory",
                "Laptop Accessory",
                "Other"
            ]
        }

    ],


    "Other Electronics": [

        {
            name: "specifications",
            label: "Specifications / Requirements",
            type: "textarea",
            required: true,
            placeholder:
                "Describe the specifications or features you need..."
        }

    ]

};

/* =========================
   GAMING CONFIGURATION
========================= */

const gamingConfigurations = {

    "PlayStation": {

        icon: "🎮",

        models: [
            "PlayStation 5 Pro",
            "PlayStation 5 Slim",
            "PlayStation 5",
            "PlayStation 4 Pro",
            "PlayStation 4"
        ],

        storage: [
            "825GB",
            "1TB",
            "2TB",
            "No preference"
        ],

        extraFields: [
            {
                name: "edition",
                label: "Edition",
                options: [
                    "Digital Edition",
                    "Disc Edition",
                    "No preference"
                ]
            }
        ]

    },


    "Xbox": {

        icon: "🎮",

        models: [
            "Xbox Series X",
            "Xbox Series S",
            "Xbox One X",
            "Xbox One S",
            "Xbox One"
        ],

        storage: [
            "512GB",
            "1TB",
            "2TB",
            "No preference"
        ],

        extraFields: [
            {
                name: "edition",
                label: "Edition",
                options: [
                    "Digital",
                    "Disc",
                    "No preference"
                ]
            }
        ]

    },


    "Nintendo": {

        icon: "🎮",

        models: [
            "Nintendo Switch 2",
            "Nintendo Switch OLED",
            "Nintendo Switch",
            "Nintendo Switch Lite"
        ],

        storage: [
            "64GB",
            "128GB",
            "256GB",
            "No preference"
        ],

        extraFields: [
            {
                name: "nintendoColor",
                label: "Preferred Style",
                options: [
                    "Standard",
                    "Special Edition",
                    "No preference"
                ]
            }
        ]

    },


    "Gaming PC": {

        icon: "🖥️",

        models: [
            "Custom Gaming PC",
            "Prebuilt Gaming PC",
            "Gaming Laptop"
        ],

        storage: [
            "512GB SSD",
            "1TB SSD",
            "2TB SSD",
            "1TB SSD + 2TB HDD",
            "No preference"
        ],

        extraFields: [
            {
                name: "processor",
                label: "Processor",
                options: [
                    "Intel Core i5",
                    "Intel Core i7",
                    "Intel Core i9",
                    "AMD Ryzen 5",
                    "AMD Ryzen 7",
                    "AMD Ryzen 9",
                    "Apple Silicon",
                    "No preference"
                ]
            },

            {
                name: "ram",
                label: "RAM",
                options: [
                    "8GB",
                    "16GB",
                    "32GB",
                    "64GB",
                    "128GB",
                    "No preference"
                ]
            },

            {
                name: "gpu",
                label: "Graphics Card",
                options: [
                    "RTX 3050",
                    "RTX 3060",
                    "RTX 4060",
                    "RTX 4070",
                    "RTX 4080",
                    "RTX 4090",
                    "RTX 5070",
                    "RTX 5080",
                    "RTX 5090",
                    "AMD Radeon",
                    "No preference"
                ]
            }
        ]

    },


    "Gaming Monitor": {

        icon: "🖥️",

        models: [
            "24 inch Gaming Monitor",
            "27 inch Gaming Monitor",
            "32 inch Gaming Monitor",
            "Ultrawide Gaming Monitor",
            "Curved Gaming Monitor"
        ],

        storage: [],

        extraFields: [
            {
                name: "resolution",
                label: "Resolution",
                options: [
                    "1080p Full HD",
                    "1440p QHD",
                    "4K UHD",
                    "No preference"
                ]
            },

            {
                name: "refreshRate",
                label: "Refresh Rate",
                options: [
                    "60Hz",
                    "120Hz",
                    "144Hz",
                    "165Hz",
                    "240Hz",
                    "360Hz",
                    "No preference"
                ]
            },

            {
                name: "screenSize",
                label: "Screen Size",
                options: [
                    "24 inch",
                    "27 inch",
                    "32 inch",
                    "34 inch",
                    "49 inch",
                    "No preference"
                ]
            }
        ]

    },


    "Gaming Accessories": {

        icon: "🎮",

        models: [
            "Gaming Controller",
            "Gaming Headset",
            "Gaming Keyboard",
            "Gaming Mouse",
            "Gaming Chair",
            "Gaming Steering Wheel",
            "Gaming Capture Card",
            "Other"
        ],

        storage: [],

        extraFields: []

    }

};
/* =========================
   GAMING FIELDS
========================= */

function renderGamingFields(platform) {

    const config =
        gamingConfigurations[platform];

    if (!config) {
        return;
    }

    const gamingFields =
        document.createElement("div");

    gamingFields.className =
        "gaming-details";


    /* HEADER */

    const header =
        document.createElement("div");

    header.className =
        "dynamic-category-header";

    header.innerHTML = `
        <div class="dynamic-category-icon">
            ${config.icon}
        </div>

        <div>
            <strong>${platform}</strong>
            <span>Tell us more about what you need</span>
        </div>
    `;

    gamingFields.appendChild(header);


    /* MODEL */

    const modelGroup =
        createSelectField(
            "gamingModel",
            "Console / Device Model",
            config.models,
            true
        );

    gamingFields.appendChild(modelGroup);


    /* STORAGE */

    if (config.storage.length > 0) {

        const storageGroup =
            createSelectField(
                "gamingStorage",
                "Storage",
                config.storage,
                false
            );

        gamingFields.appendChild(storageGroup);

    }


    /* EXTRA FIELDS */

    config.extraFields.forEach(field => {

        const group =
            createSelectField(
                field.name,
                field.label,
                field.options,
                false
            );

        gamingFields.appendChild(group);

    });


    dynamicFields.appendChild(
        gamingFields
    );

}
/* =========================
   CREATE SELECT FIELD
========================= */

function createSelectField(
    name,
    label,
    options,
    required = false
) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "form-group dynamic-field";


    const labelElement =
        document.createElement("label");

    labelElement.setAttribute(
        "for",
        name
    );

    labelElement.innerHTML =
        `${label}${required ? ' <span>*</span>' : ''}`;


    const select =
        document.createElement("select");

    select.id = name;

    select.name = name;

    select.required = required;


    const placeholder =
        document.createElement("option");

    placeholder.value = "";

    placeholder.textContent =
        `Select ${label.toLowerCase()}`;

    select.appendChild(
        placeholder
    );


    options.forEach(option => {

        const optionElement =
            document.createElement("option");

        optionElement.value =
            option;

        optionElement.textContent =
            option;

        select.appendChild(
            optionElement
        );

    });


    wrapper.appendChild(
        labelElement
    );

    wrapper.appendChild(
        select
    );


    return wrapper;

}/* =========================
   RENDER DYNAMIC FIELDS
========================= */

function renderDynamicFields(selectedCategory) {

    dynamicFields.innerHTML = "";


    /* =========================
       GAMING
    ========================= */

    if (selectedCategory === "Gaming") {

        const gamingSelector =
            createSelectField(
                "gamingType",
                "Gaming Platform",
                Object.keys(gamingConfigurations),
                true
            );

        dynamicFields.appendChild(
            gamingSelector
        );


        const gamingSelect =
            gamingSelector.querySelector(
                "select"
            );


        gamingSelect.addEventListener(
            "change",
            function () {

                const existing =
                    dynamicFields.querySelector(
                        ".gaming-details"
                    );

                if (existing) {

                    existing.remove();

                }


                if (this.value) {

                    renderGamingFields(
                        this.value
                    );

                }

            }
        );


        return;

    }


    /* =========================
       OTHER CATEGORIES
    ========================= */

    const fields =
        categoryFields[selectedCategory];

    if (!fields) {

        return;

    }


    const grid =
        document.createElement("div");

    grid.className =
        "dynamic-grid";


    fields.forEach(field => {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "form-group dynamic-field";


        const label =
            document.createElement("label");

        label.setAttribute(
            "for",
            field.name
        );

        label.innerHTML =
            `${field.label}${field.required ? ' <span>*</span>' : ''}`;


        wrapper.appendChild(
            label
        );


        let input;


        if (field.type === "select") {

            input =
                document.createElement("select");

            input.id =
                field.name;

            input.name =
                field.name;

            input.required =
                Boolean(field.required);


            const defaultOption =
                document.createElement("option");

            defaultOption.value = "";

            defaultOption.textContent =
                `Select ${field.label.toLowerCase()}`;

            input.appendChild(
                defaultOption
            );


            field.options.forEach(option => {

                const optionElement =
                    document.createElement("option");

                optionElement.value =
                    option;

                optionElement.textContent =
                    option;

                input.appendChild(
                    optionElement
                );

            });

        }


        else if (field.type === "textarea") {

            input =
                document.createElement("textarea");

            input.id =
                field.name;

            input.name =
                field.name;

            input.rows = 4;

            input.placeholder =
                field.placeholder || "";

            input.required =
                Boolean(field.required);

        }


        wrapper.appendChild(
            input
        );

        grid.appendChild(
            wrapper
        );

    });


    dynamicFields.appendChild(
        grid
    );

}

/* =========================
   CATEGORY CHANGE
========================= */

category.addEventListener("change", function () {

    renderDynamicFields(this.value);

});


/* =========================
   ACCESSORY MANAGEMENT
========================= */

function createAccessoryRow() {

    const row =
        document.createElement("div");

    row.className =
        "accessory-row";


    const input =
        document.createElement("input");

    input.type = "text";

    input.name = "accessory[]";

    input.placeholder =
        "e.g. Phone case";


    const removeButton =
        document.createElement("button");

    removeButton.type = "button";

    removeButton.className =
        "remove-accessory";

    removeButton.textContent = "×";


    removeButton.addEventListener(
        "click",
        function () {

            row.remove();

        }
    );


    row.appendChild(input);

    row.appendChild(removeButton);

    return row;

}


/* =========================
   ADD ACCESSORY
========================= */

addAccessoryButton.addEventListener(
    "click",
    function () {

        const row =
            createAccessoryRow();

        accessoriesList.appendChild(row);

        row.querySelector("input").focus();

    }
);
document
    .querySelectorAll(".remove-accessory")
    .forEach(button => {

        button.addEventListener(
            "click",
            function () {

                this
                    .closest(".accessory-row")
                    .remove();

            }
        );

    });


/* =========================
   REMOVE ACCESSORY
========================= */

function removeAccessory(button) {

    const row =
        button.closest(".accessory-row");

    if (row) {

        row.remove();

    }

}


/* =========================
   CLEAN TEXT
========================= */

function cleanText(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ");

}


/* =========================
   FORMAT MONEY
========================= */

function formatMoney(value) {

    if (!value) {

        return "";

    }

    const amount =
        Number(value);

    if (!Number.isFinite(amount) || amount < 0) {

        return "";

    }

    return new Intl.NumberFormat(
        "en-TZ"
    ).format(amount);

}


/* =========================
   GET FIELD VALUE
========================= */

function getFieldValue(id) {

    const element =
        document.getElementById(id);

    if (!element) {

        return "";

    }

    return cleanText(element.value);

}


/* =========================
   GET ACCESSORIES
========================= */

function getAccessories() {

    const inputs =
        document.querySelectorAll(
            'input[name="accessory[]"]'
        );


    return Array.from(inputs)

        .map(input =>
            cleanText(input.value)
        )

        .filter(value =>
            value.length > 0
        );

}


/* =========================
   VALIDATE PHONE
========================= */

function validatePhone(phone) {

    const cleaned =
        phone.replace(/[\s\-()+]/g, "");

    return /^(255|0)?[67]\d{8}$/.test(cleaned);

}


/* =========================
   BUILD WHATSAPP MESSAGE
========================= */

function buildWhatsAppMessage() {

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
        cleanText(category.value);


    const brand =
        cleanText(
            document.getElementById(
                "brand"
            ).value
        );


    const productName =
        cleanText(
            document.getElementById(
                "productName"
            ).value
        );


    const condition =
        document.querySelector(
            'input[name="condition"]:checked'
        )?.value || "Not specified";


    const budget =
        document.getElementById(
            "budget"
        ).value;


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


    const accessories =
        getAccessories();


    let message =
`*MWASHI GADGETS - PRODUCT REQUEST*

👤 *CUSTOMER*
Name: ${customerName}
WhatsApp: ${phone}

📦 *PRODUCT*
Category: ${selectedCategory}
Brand: ${brand || "Not specified"}
Product: ${productName}
Condition: ${condition}`;


    /* DYNAMIC FIELDS */

    const fields =
        categoryFields[selectedCategory] || [];


    fields.forEach(field => {

        const value =
            getFieldValue(field.name);

        if (value) {

            message +=
                `\n${field.label}: ${value}`;

        }

    });


    /* ACCESSORIES */

    if (accessories.length > 0) {

        message +=
            "\n\n🎒 *ACCESSORIES*";

        accessories.forEach(item => {

            message +=
                `\n• ${item}`;

        });

    }


    /* BUDGET */

    if (budget) {

        message +=
            `\n\n💰 *BUDGET*\nTZS ${formatMoney(budget)}`;

    }


    /* DATE */

    if (preferredDate) {

        message +=
            `\n\n📅 *WHEN NEEDED*\n${preferredDate}`;

    }


    /* NOTES */

    if (notes) {

        message +=
            `\n\n📝 *ADDITIONAL REQUIREMENTS*\n${notes}`;

    }


    message +=
        "\n\nPlease help me source this product.";


    return message;

}


/* =========================
   SUBMIT FORM
========================= */

form.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        /* Browser validation */

        if (!form.checkValidity()) {

            form.reportValidity();

            return;

        }


        const phone =
            cleanText(
                document.getElementById(
                    "phone"
                ).value
            );


        if (!validatePhone(phone)) {

            alert(
                "Please enter a valid Tanzanian WhatsApp number."
            );

            document.getElementById(
                "phone"
            ).focus();

            return;

        }


        const message =
            buildWhatsAppMessage();


        /*
         * MWASHI GADGETS WHATSAPP NUMBER
         *
         * Replace this number if your
         * business WhatsApp number changes.
         */

        const businessNumber =
            "255623468239";


        const whatsappURL =
            "https://wa.me/" +
            businessNumber +
            "?text=" +
            encodeURIComponent(message);


        window.open(
            whatsappURL,
            "_blank"
        );

    }
);