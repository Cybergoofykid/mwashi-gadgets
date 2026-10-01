"use strict";

/*
=========================================================
MWASHI GADGETS
NOTHING PHONE CATALOGUE
=========================================================
*/

const nothingProducts = [

    {
        id: 5001,
        name: "Nothing Phone (4b) 5G",
        category: "Nothing",
        brand: "Nothing",
        subcategory: "Smartphones",
        featured: true,
        latest: true,
        installment: true,
        image: "images/nothing/nothingphone4b.webp",
        description:
            "Nothing smartphone with a large 6.77-inch display, Snapdragon 6 Gen 4 performance and 5200mAh battery.",
        storage: {
            "256GB": { new: 0, used: 0 }
        },
        colours: ["Black", "White"]
    },

    {
        id: 5002,
        name: "Nothing Phone (4a) Pro 5G",
        category: "Nothing",
        brand: "Nothing",
        subcategory: "Smartphones",
        featured: true,
        latest: true,
        installment: true,
        image: "images/nothing/nothingphone4a-pro.webp",
        description:
            "Premium Nothing smartphone with a 6.83-inch display, Snapdragon 7 Gen 4 processor and 5080mAh battery.",
        storage: {
            "256GB": { new: 0, used: 0 }
        },
        colours: ["Black", "White"]
    },

    {
        id: 5003,
        name: "Nothing Phone (4a) 5G",
        category: "Nothing",
        brand: "Nothing",
        subcategory: "Smartphones",
        featured: true,
        latest: true,
        installment: true,
        image: "images/nothing/nothingphone4a.webp",
        description:
            "Nothing smartphone featuring a 6.78-inch display, Snapdragon 7s Gen 4 processor and 5080mAh battery.",
        storage: {
            "256GB": { new: 0, used: 0 }
        },
        colours: ["Black", "White"]
    },

    {
        id: 5004,
        name: "Nothing Phone (3) 5G",
        category: "Nothing",
        brand: "Nothing",
        subcategory: "Smartphones",
        featured: true,
        latest: true,
        installment: true,
        image: "images/nothing/nothingphone3.webp",
        description:
            "Nothing flagship smartphone with Snapdragon 8s Gen 4 performance, 6.67-inch display and 5150mAh battery.",
        storage: {
            "512GB": { new: 0, used: 0 }
        },
        colours: ["Black", "White"]
    },

    {
        id: 5005,
        name: "Nothing Phone (3a) Pro",
        category: "Nothing",
        brand: "Nothing",
        subcategory: "Smartphones",
        featured: true,
        latest: false,
        installment: true,
        image: "images/nothing/nothingphone3apro.webp",
        description:
            "Premium Nothing midrange smartphone with Snapdragon 7s Gen 3 performance and 5000mAh battery.",
        storage: {
            "256GB": { new: 0, used: 0 }
        },
        colours: ["Black", "White", "Blue"]
    },

    {
        id: 5006,
        name: "Nothing Phone (3a)",
        category: "Nothing",
        brand: "Nothing",
        subcategory: "Smartphones",
        featured: false,
        latest: false,
        installment: true,
        image: "images/nothing/nothingphone3a.webp",
        description:
            "Nothing smartphone with Snapdragon 7s Gen 3 performance, 6.77-inch display and 5000mAh battery.",
        storage: {
            "256GB": { new: 0, used: 0 }
        },
        colours: ["Black", "White", "Blue"]
    },

    {
        id: 5007,
        name: "Nothing Phone (3a) Lite 5G",
        category: "Nothing",
        brand: "Nothing",
        subcategory: "Smartphones",
        featured: false,
        latest: true,
        installment: true,
        image: "images/nothing/nothingphone3alite.webp",
        description:
            "Affordable Nothing smartphone powered by Dimensity 7300 Pro with a 5000mAh battery.",
        storage: {
            "256GB": { new: 0, used: 0 }
        },
        colours: ["Black", "White"]
    },

    {
        id: 5008,
        name: "CMF Phone 2 Pro 5G",
        category: "Nothing",
        brand: "Nothing",
        subcategory: "Smartphones",
        featured: false,
        latest: true,
        installment: true,
        image: "images/nothing/cmfphone2pro5g.webp",
        description:
            "CMF by Nothing smartphone with Dimensity 7300 Pro performance, 6.77-inch display and 5000mAh battery.",
        storage: {
            "256GB": { new: 0, used: 0 }
        },
        colours: ["Black", "White", "Orange"]
    },

    {
        id: 5009,
        name: "Nothing Phone (2a) Plus",
        category: "Nothing",
        brand: "Nothing",
        subcategory: "Smartphones",
        featured: false,
        latest: false,
        installment: true,
        image: "images/nothing/nothingphone2aplus.webp",
        description:
            "Nothing smartphone with Dimensity 7350 Pro processor, 6.7-inch display and 256GB storage.",
        storage: {
            "256GB": { new: 0, used: 0 }
        },
        colours: ["Black", "Gray"]
    },

    {
        id: 5010,
        name: "CMF Phone 1",
        category: "Nothing",
        brand: "Nothing",
        subcategory: "Smartphones",
        featured: false,
        latest: false,
        installment: true,
        image: "images/nothing/cmfphone1.webp",
        description:
            "Affordable CMF by Nothing smartphone powered by Dimensity 7300 with a 6.67-inch display.",
        storage: {
            "256GB": { new: 0, used: 0 }
        },
        colours: ["Black", "White", "Orange", "Green"]
    },

    {
        id: 5011,
        name: "Nothing Phone (2a)",
        category: "Nothing",
        brand: "Nothing",
        subcategory: "Smartphones",
        featured: false,
        latest: false,
        installment: true,
        image: "images/nothing/nothingphone2a.webp",
        description:
            "Nothing smartphone powered by Dimensity 7200 Pro with a 6.7-inch display and 5000mAh battery.",
        storage: {
            "256GB": { new: 0, used: 0 }
        },
        colours: ["Black", "White", "Milk"]
    },

    {
        id: 5012,
        name: "Nothing Phone (2)",
        category: "Nothing",
        brand: "Nothing",
        subcategory: "Smartphones",
        featured: true,
        latest: false,
        installment: true,
        image: "images/nothing/nothingphone2.webp",
        description:
            "Premium Nothing smartphone powered by Snapdragon 8+ Gen 1 with a 6.7-inch display and 4700mAh battery.",
        storage: {
            "128GB": { new: 0, used: 0 },
            "256GB": { new: 0, used: 0 },
            "512GB": { new: 0, used: 0 }
        },
        colours: ["Black", "White"]
    },

    {
        id: 5013,
        name: "Nothing Phone (1)",
        category: "Nothing",
        brand: "Nothing",
        subcategory: "Smartphones",
        featured: false,
        latest: false,
        installment: true,
        image: "images/nothing/nothingphone1.webp",
        description:
            "Original Nothing smartphone featuring Snapdragon 778G+ 5G, a 6.55-inch display and 4500mAh battery.",
        storage: {
            "128GB": { new: 0, used: 0 },
            "256GB": { new: 0, used: 0 }
        },
        colours: ["Black", "White"]
    }

];