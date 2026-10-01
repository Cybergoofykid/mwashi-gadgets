"use strict";

/*
=========================================
MWASHI GADGETS
SUPABASE PRODUCT LOADER
=========================================
*/

let products = [];


/*
=========================================
LOAD PRODUCTS FROM SUPABASE
=========================================
*/

async function loadProducts() {

    try {

        const sb =
            requireSupabase();


        const {
            data,
            error
        } = await sb
            .from("products")
            .select("*")
            .eq("active", true)
            .order("created_at", {
                ascending: false
            });


        if (error) {

            console.error(
                "Supabase product error:",
                error
            );

            products = [];

            window.products =
                products;


            /*
            Tell other scripts that
            product loading has finished.
            */

            window.dispatchEvent(
                new CustomEvent(
                    "mwashiProductsLoaded",
                    {
                        detail: {
                            products: []
                        }
                    }
                )
            );


            showProductLoadingError();

            return;

        }


        /*
        Store the products globally.
        */

        products =
            Array.isArray(data)
                ? data
                : [];


        window.products =
            products;


        console.log(
            "Mwashi Gadgets products loaded:",
            products.length
        );


        /*
        IMPORTANT:

        Notify installment.js and any other
        script that depends on the
        Supabase catalogue.

        This fires ONLY after the
        asynchronous Supabase query
        has completed.
        */

        window.dispatchEvent(
            new CustomEvent(
                "mwashiProductsLoaded",
                {
                    detail: {
                        products:
                            products
                    }
                }
            )
        );


        /*
        Tell app.js to display them.
        */

        if (
            typeof filterProducts ===
            "function"
        ) {

            filterProducts();

        }
        else if (
            typeof displayProducts ===
            "function"
        ) {

            displayProducts(
                products
            );

        }


    }
    catch (error) {

        console.error(
            "Failed to load products:",
            error
        );


        products = [];

        window.products =
            products;


        /*
        Notify dependent scripts even
        when loading fails.
        */

        window.dispatchEvent(
            new CustomEvent(
                "mwashiProductsLoaded",
                {
                    detail: {
                        products: []
                    }
                }
            )
        );


        showProductLoadingError();

    }

}


/*
=========================================
LOADING ERROR
=========================================
*/

function showProductLoadingError() {

    const grid =
        document.getElementById(
            "product-grid"
        );


    if (!grid) {

        return;

    }


    grid.innerHTML = `

        <div class="no-products">

            <h3>
                Unable to load products
            </h3>

            <p>
                Please refresh the page and try again.
            </p>

        </div>

    `;

}


/*
=========================================
START
=========================================
*/

document.addEventListener(
    "DOMContentLoaded",
    loadProducts
);