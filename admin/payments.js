"use strict";

/*
=========================================================
MWASHI GADGETS
PAYMENTS ADMIN SYSTEM
=========================================================

Features:

- Supabase authentication
- Load orders
- Load payments
- Calculate paid amounts
- Calculate outstanding balances
- Payment status display
- Add payments
- Payment history
- Search
- Status filtering
- Payment method filtering
- Tanzania date formatting
- Automatic refresh after payment
=========================================================
*/


/* =====================================================
   GLOBALS
===================================================== */

let sb = null;

let orders = [];

let payments = [];

let paymentRows = [];

let selectedOrder = null;


/* =====================================================
   ELEMENTS
===================================================== */

const paymentsTable =
    document.getElementById("paymentsTable");

const paymentMessage =
    document.getElementById("paymentMessage");

const totalCollected =
    document.getElementById("totalCollected");

const outstandingBalance =
    document.getElementById("outstandingBalance");

const totalPayments =
    document.getElementById("totalPayments");

const pendingPayments =
    document.getElementById("pendingPayments");

const searchPayments =
    document.getElementById("searchPayments");

const statusFilter =
    document.getElementById("statusFilter");

const methodFilter =
    document.getElementById("methodFilter");

const paymentModal =
    document.getElementById("paymentModal");

const historyModal =
    document.getElementById("historyModal");

const paymentForm =
    document.getElementById("paymentForm");

const formMessage =
    document.getElementById("formMessage");


/* =====================================================
   SUPABASE
===================================================== */

function getSupabase() {

    if (typeof requireSupabase !== "function") {
        throw new Error(
            "supabase-client.js was not loaded."
        );
    }

    return requireSupabase();
}
<<<<<<< HEAD


/* =====================================================
   AUTHENTICATION
===================================================== */

async function guard() {

    sb = getSupabase();

    const {
        data,
        error
    } = await sb.auth.getSession();

    if (error) {
        console.error(error);

        window.location.href = "login.html";

        return false;
    }

    if (!data || !data.session) {

        window.location.href = "login.html";

        return false;
    }

    return true;
}


/* =====================================================
   MONEY
===================================================== */

function money(value) {

    const number =
        Number(value) || 0;

    return "TZS " +
        number.toLocaleString(
            "en-TZ",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }
        );
}


/* =====================================================
   ESCAPE HTML
===================================================== */

=======
function money(amount) {

    const value =
        Number(amount) || 0;

    return new Intl.NumberFormat(
        "en-TZ",
        {
            style: "currency",
            currency: "TZS",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    ).format(value);

}
>>>>>>> 9b90dc5dbddaf105b4e6afdb9327c233a7c59b9a
function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
<<<<<<< HEAD
}


/* =====================================================
   DATE FORMAT
===================================================== */

function formatDate(value) {

    if (!value) {
        return "-";
    }

    const date =
        new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString(
        "en-TZ",
        {
            timeZone: "Africa/Dar_es_Salaam",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


/* =====================================================
   DATETIME LOCAL DEFAULT
===================================================== */

function getLocalDateTimeValue() {

    const now = new Date();

    const offset =
        now.getTimezoneOffset();

    const local =
        new Date(
            now.getTime() -
            offset * 60000
        );

    return local
        .toISOString()
        .slice(0, 16);
}


/* =====================================================
   PAYMENT STATUS
===================================================== */

function getPaymentStatus(
    total,
    paid
) {

    total = Number(total) || 0;

    paid = Number(paid) || 0;

    if (total <= 0) {
        return "pending";
    }

    if (paid > total) {
        return "overpaid";
    }

    if (paid >= total) {
        return "paid";
    }

    if (paid > 0) {
        return "partial";
    }

    return "pending";
}


/* =====================================================
   PAYMENT STATUS BADGE
===================================================== */

function paymentStatusBadge(status) {

    const safeStatus =
        String(status || "pending")
            .toLowerCase();

    let label =
        safeStatus.charAt(0).toUpperCase() +
        safeStatus.slice(1);

    return `
        <span class="payment-status ${escapeHtml(safeStatus)}">
            ${escapeHtml(label)}
        </span>
    `;
=======

}

/* =====================================================
   AUTHENTICATION
===================================================== */

async function guard() {

    try {

        sb = getSupabase();

        const allowed = await requireAdmin();

        return allowed;

    } catch (error) {

        console.error(
            "Admin guard error:",
            error
        );

        return false;

    }

>>>>>>> 9b90dc5dbddaf105b4e6afdb9327c233a7c59b9a
}


/* =====================================================
   LOAD ORDERS
===================================================== */

async function loadOrders() {

    const {
        data,
        error
    } = await sb
        .from("orders")
        .select(`
            id,
            order_number,
            customer_name,
            customer_phone,
            total,
            payment_method,
            payment_status,
            order_status,
            created_at
        `)
        .order(
            "created_at",
            {
                ascending: false
            }
        );

    if (error) {
        throw error;
    }

    orders = data || [];
}


/* =====================================================
   LOAD PAYMENTS
===================================================== */

async function loadPayments() {

    const {
        data,
        error
    } = await sb
        .from("payments")
        .select(`
            id,
            order_id,
            amount,
            payment_method,
            transaction_reference,
            payment_status,
            payment_date,
            notes,
            created_at,
            updated_at
        `)
        .order(
            "payment_date",
            {
                ascending: false
            }
        );

    if (error) {
        throw error;
    }

    payments = data || [];
}


/* =====================================================
   BUILD PAYMENT SUMMARY
===================================================== */

function buildPaymentRows() {

    const map = new Map();

    payments.forEach(payment => {

        const orderId =
            Number(payment.order_id);

        if (!map.has(orderId)) {

            map.set(
                orderId,
                {
                    completed: 0,
                    records: []
                }
            );

        }

        const item =
            map.get(orderId);

        item.records.push(payment);

        if (
            payment.payment_status ===
            "completed"
        ) {

            item.completed +=
                Number(payment.amount) || 0;

        }

    });


    paymentRows =
        orders.map(order => {

            const orderId =
                Number(order.id);

            const paymentData =
                map.get(orderId) || {
                    completed: 0,
                    records: []
                };

            const total =
                Number(order.total) || 0;

            const paid =
                paymentData.completed;

            const balance =
                Math.max(
                    total - paid,
                    0
                );

            const status =
                getPaymentStatus(
                    total,
                    paid
                );

            const latestPayment =
                paymentData.records[0] ||
                null;

            return {

                order,

                total,

                paid,

                balance,

                status,

                records:
                    paymentData.records,

                latestPayment

            };

        });

}

<<<<<<< HEAD
=======
/* =====================================================
   PAYMENT STATUS
===================================================== */

function getPaymentStatus(
    total,
    paid
) {

    total =
        Number(total) || 0;

    paid =
        Number(paid) || 0;


    if (paid <= 0) {

        return "pending";

    }


    if (paid < total) {

        return "partial";

    }


    return "completed";

}

/* =====================================================
   PAYMENT STATUS BADGE
===================================================== */

function paymentStatusBadge(status) {

    const value =
        String(status || "pending").toLowerCase();

    let label = "Pending";

    if (value === "completed") {

        label = "Completed";

    } else if (value === "partial") {

        label = "Partially Paid";

    } else if (value === "failed") {

        label = "Failed";

    } else if (value === "refunded") {

        label = "Refunded";

    }

    return `
        <span class="badge status-${escapeHtml(value)}">
            ${escapeHtml(label)}
        </span>
    `;

}

function formatDate(dateValue) {

    if (!dateValue) {
        return "-";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return new Intl.DateTimeFormat(
        "en-TZ",
        {
            dateStyle: "medium",
            timeStyle: "short",
            timeZone: "Africa/Dar_es_Salaam"
        }
    ).format(date);

}
>>>>>>> 9b90dc5dbddaf105b4e6afdb9327c233a7c59b9a

/* =====================================================
   UPDATE STATS
===================================================== */

function updateStats() {

    let collected = 0;

    let balance = 0;

    let records = payments.length;

    let attention = 0;


    payments.forEach(payment => {

        if (
            payment.payment_status ===
            "completed"
        ) {

            collected +=
                Number(payment.amount) || 0;

        }

        if (
            payment.payment_status ===
            "pending" ||
            payment.payment_status ===
            "failed"
        ) {

            attention++;

        }

    });


    paymentRows.forEach(row => {

        if (
            row.status === "partial" ||
            row.status === "pending"
        ) {

            balance +=
                row.balance;

        }

    });


    totalCollected.textContent =
        money(collected);

    outstandingBalance.textContent =
        money(balance);

    totalPayments.textContent =
        records.toLocaleString();

    pendingPayments.textContent =
        attention.toLocaleString();

}


/* =====================================================
   RENDER TABLE
===================================================== */

function renderPayments() {

    const search =
        String(
            searchPayments.value || ""
        )
            .trim()
            .toLowerCase();

    const selectedStatus =
        statusFilter.value;

    const selectedMethod =
        methodFilter.value;


    const filtered =
        paymentRows.filter(row => {

            const order =
                row.order;

            const customer =
                String(
                    order.customer_name || ""
                ).toLowerCase();

            const phone =
                String(
                    order.customer_phone || ""
                ).toLowerCase();

            const orderNumber =
                String(
                    order.order_number || ""
                ).toLowerCase();


            const matchesSearch =
                !search ||
                customer.includes(search) ||
                phone.includes(search) ||
                orderNumber.includes(search);


            const matchesStatus =
                selectedStatus === "all" ||
                row.status === selectedStatus;


            let matchesMethod = true;

            if (
                selectedMethod !==
                "all"
            ) {

                matchesMethod =
                    row.records.some(
                        payment =>
                            payment.payment_method ===
                            selectedMethod
                    );

            }


            return (
                matchesSearch &&
                matchesStatus &&
                matchesMethod
            );

        });


    if (!filtered.length) {

        paymentsTable.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    style="text-align:center;padding:35px"
                >
                    No payment records found.
                </td>
            </tr>
        `;

        return;
    }


    paymentsTable.innerHTML =
        filtered.map(row => {

            const order =
                row.order;

            const latest =
                row.latestPayment;


            let method =
                latest
                    ? latest.payment_method
                    : order.payment_method || "-";


            let date =
                latest
                    ? latest.payment_date
                    : order.created_at;


            return `
                <tr>

                    <td>

                        <div class="order-number">
                            ${escapeHtml(
                                order.order_number
                            )}
                        </div>

                    </td>


                    <td>

                        <div class="customer-name">
                            ${escapeHtml(
                                order.customer_name
                            )}
                        </div>

                        <div class="customer-phone">
                            ${escapeHtml(
                                order.customer_phone
                            )}
                        </div>

                    </td>


                    <td>
                        ${money(row.total)}
                    </td>


                    <td class="amount-paid">
                        ${money(row.paid)}
                    </td>


                    <td
                        class="${
                            row.balance > 0
                                ? "amount-balance"
                                : "amount-zero"
                        }"
                    >
                        ${money(row.balance)}
                    </td>


                    <td>
                        ${paymentStatusBadge(
                            row.status
                        )}
                    </td>


                    <td>

                        <span class="method-badge">
                            ${escapeHtml(method)}
                        </span>

                    </td>


                    <td>
                        ${formatDate(date)}
                    </td>


                    <td>

                        <div class="payment-actions">

                            <button
                                type="button"
                                class="view-btn"
                                data-history-id="${order.id}"
                            >
                                History
                            </button>

                            ${
                                row.balance > 0
                                    ? `
                                        <button
                                            type="button"
                                            class="add-payment-btn"
                                            data-payment-id="${order.id}"
                                        >
                                            Add Payment
                                        </button>
                                      `
                                    : ""
                            }

                        </div>

                    </td>

                </tr>
            `;

        }).join("");
}


/* =====================================================
   LOAD EVERYTHING
===================================================== */

async function loadPaymentsPage() {

    try {

        showMessage(
            "Loading payment records...",
            false
        );

        await loadOrders();

        await loadPayments();

        buildPaymentRows();

        updateStats();

        renderPayments();

        showMessage(
            "",
            false
        );

    } catch (error) {

        console.error(
            "Payment loading error:",
            error
        );

        showMessage(
            "Unable to load payments: " +
            (error.message || "Unknown error"),
            true
        );

        paymentsTable.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    style="text-align:center;padding:35px"
                >
                    Unable to load payment records.
                </td>
            </tr>
        `;

    }

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    message,
    error = false
) {

    paymentMessage.textContent =
        message;

    paymentMessage.className =
        "payment-message";

    if (error) {
        paymentMessage.classList.add(
            "danger-message"
        );
    }
}


/* =====================================================
   OPEN PAYMENT MODAL
===================================================== */

function openPaymentModal(
    orderId
) {

    const order =
        orders.find(
            item =>
                Number(item.id) ===
                Number(orderId)
        );


    if (!order) {

        alert(
            "Order could not be found."
        );

        return;

    }


    const row =
        paymentRows.find(
            item =>
                Number(item.order.id) ===
                Number(orderId)
        );


    selectedOrder =
        row || {
            order,
            total:
                Number(order.total) || 0,
            paid: 0,
            balance:
                Number(order.total) || 0,
            records: []
        };


    document.getElementById(
        "paymentOrderId"
    ).value = order.id;


    document.getElementById(
        "summaryOrderNumber"
    ).textContent =
        order.order_number || "-";


    document.getElementById(
        "summaryCustomer"
    ).textContent =
        order.customer_name || "-";


    document.getElementById(
        "summaryTotal"
    ).textContent =
        money(selectedOrder.total);


    document.getElementById(
        "summaryPaid"
    ).textContent =
        money(selectedOrder.paid);


    document.getElementById(
        "summaryBalance"
    ).textContent =
        money(selectedOrder.balance);


    document.getElementById(
        "paymentAmount"
    ).value = "";


    document.getElementById(
        "paymentMethod"
    ).value = "";


    document.getElementById(
        "transactionReference"
    ).value = "";


    document.getElementById(
        "paymentStatus"
    ).value = "completed";


    document.getElementById(
        "paymentDate"
    ).value =
        getLocalDateTimeValue();


    document.getElementById(
        "paymentNotes"
    ).value = "";


    formMessage.textContent = "";


    paymentModal.classList.remove(
        "hidden"
    );

}


/* =====================================================
   CLOSE PAYMENT MODAL
===================================================== */

function closePaymentModal() {

    paymentModal.classList.add(
        "hidden"
    );

    selectedOrder = null;

}


/* =====================================================
   OPEN HISTORY MODAL
===================================================== */

async function openHistoryModal(
    orderId
) {

    const row =
        paymentRows.find(
            item =>
                Number(item.order.id) ===
                Number(orderId)
        );


    if (!row) {

        alert(
            "Order could not be found."
        );

        return;

    }


    const order =
        row.order;


    const records =
        row.records || [];


    document.getElementById(
        "historySummary"
    ).innerHTML = `

        <div class="order-summary-grid">

            <div class="summary-item">

                <span>
                    Order
                </span>

                <strong>
                    ${escapeHtml(
                        order.order_number
                    )}
                </strong>

            </div>


            <div class="summary-item">

                <span>
                    Customer
                </span>

                <strong>
                    ${escapeHtml(
                        order.customer_name
                    )}
                </strong>

            </div>


            <div class="summary-item">

                <span>
                    Order Total
                </span>

                <strong>
                    ${money(row.total)}
                </strong>

            </div>


            <div class="summary-item">

                <span>
                    Paid
                </span>

                <strong>
                    ${money(row.paid)}
                </strong>

            </div>


            <div class="summary-item">

                <span>
                    Balance
                </span>

                <strong>
                    ${money(row.balance)}
                </strong>

            </div>

        </div>

    `;


    if (!records.length) {

        document.getElementById(
            "historyTable"
        ).innerHTML = `

            <tr>

                <td
                    colspan="6"
                    style="text-align:center;padding:30px"
                >
                    No payments have been recorded
                    for this order yet.
                </td>

            </tr>

        `;

    } else {

        document.getElementById(
            "historyTable"
        ).innerHTML =
            records.map(payment => `

                <tr>

                    <td>
                        ${formatDate(
                            payment.payment_date
                        )}
                    </td>

                    <td class="amount-paid">
                        ${money(
                            payment.amount
                        )}
                    </td>

                    <td>
                        <span class="method-badge">
                            ${escapeHtml(
                                payment.payment_method
                            )}
                        </span>
                    </td>

                    <td>
                        ${
                            payment.transaction_reference
                                ? escapeHtml(
                                    payment.transaction_reference
                                )
                                : "-"
                        }
                    </td>

                    <td>
                        ${paymentStatusBadge(
                            payment.payment_status
                        )}
                    </td>

                    <td>
                        ${
                            payment.notes
                                ? escapeHtml(
                                    payment.notes
                                )
                                : "-"
                        }
                    </td>

                </tr>

            `).join("");

    }


    historyModal.classList.remove(
        "hidden"
    );

}


/* =====================================================
   CLOSE HISTORY MODAL
===================================================== */

function closeHistoryModal() {

    historyModal.classList.add(
        "hidden"
    );

}


/* =====================================================
   SAVE PAYMENT
===================================================== */

async function savePayment(
    event
) {

    event.preventDefault();


    if (!selectedOrder) {

        formMessage.textContent =
            "No order selected.";

        return;

    }


    const orderId =
        Number(
            document.getElementById(
                "paymentOrderId"
            ).value
        );


    const amount =
        Number(
            document.getElementById(
                "paymentAmount"
            ).value
        );


    const method =
        document.getElementById(
            "paymentMethod"
        ).value;


    const reference =
        document.getElementById(
            "transactionReference"
        ).value.trim();


    const status =
        document.getElementById(
            "paymentStatus"
        ).value;


    const paymentDate =
        document.getElementById(
            "paymentDate"
        ).value;


    const notes =
        document.getElementById(
            "paymentNotes"
        ).value.trim();


    if (!orderId) {

        formMessage.textContent =
            "Invalid order.";

        return;

    }


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        formMessage.textContent =
            "Enter a valid payment amount.";

        return;

    }


    if (!method) {

        formMessage.textContent =
            "Select a payment method.";

        return;

    }


    /*
    -----------------------------------------------------
    Prevent accidental overpayment
    -----------------------------------------------------
    */

    if (
        status === "completed" &&
        selectedOrder.balance > 0 &&
        amount > selectedOrder.balance
    ) {

        const confirmed =
            window.confirm(
                "This payment is greater than the current balance. Continue?"
            );

        if (!confirmed) {
            return;
        }

    }


    const submitButton =
        paymentForm.querySelector(
            'button[type="submit"]'
        );


    submitButton.disabled = true;

    submitButton.textContent =
        "Saving...";


    formMessage.textContent =
        "Saving payment...";


    try {

        const payload = {

            order_id:
                orderId,

            amount:
                amount,

            payment_method:
                method,

            transaction_reference:
                reference || null,

            payment_status:
                status,

            payment_date:
                paymentDate
                    ? new Date(
                        paymentDate
                    ).toISOString()
                    : new Date().toISOString(),

            notes:
                notes || null

        };


        const {
            error
        } = await sb
            .from("payments")
            .insert(payload);


        if (error) {
            throw error;
        }


        formMessage.textContent =
            "Payment saved successfully.";

        formMessage.className =
            "payment-message success-message";


        /*
        -------------------------------------------------
        Trigger automatically updates orders.payment_status
        -------------------------------------------------
        */


        await new Promise(
            resolve =>
                setTimeout(
                    resolve,
                    500
                )
        );


        await loadPaymentsPage();


        closePaymentModal();


    } catch (error) {

        console.error(
            "Save payment error:",
            error
        );

        formMessage.textContent =
            "Unable to save payment: " +
            (error.message || "Unknown error");

        formMessage.className =
            "payment-message danger-message";

    } finally {

        submitButton.disabled =
            false;

        submitButton.textContent =
            "Save Payment";

    }

}


/* =====================================================
   EVENT DELEGATION
===================================================== */

paymentsTable.addEventListener(
    "click",
    event => {

        const historyButton =
            event.target.closest(
                "[data-history-id]"
            );


        if (historyButton) {

            openHistoryModal(
                historyButton.dataset.historyId
            );

            return;

        }


        const paymentButton =
            event.target.closest(
                "[data-payment-id]"
            );


        if (paymentButton) {

            openPaymentModal(
                paymentButton.dataset.paymentId
            );

        }

    }
);


/* =====================================================
   SEARCH
===================================================== */

searchPayments.addEventListener(
    "input",
    renderPayments
);


/* =====================================================
   FILTERS
===================================================== */

statusFilter.addEventListener(
    "change",
    renderPayments
);


methodFilter.addEventListener(
    "change",
    renderPayments
);


/* =====================================================
   MODAL BUTTONS
===================================================== */

document.getElementById(
    "closePaymentModal"
).addEventListener(
    "click",
    closePaymentModal
);


document.getElementById(
    "cancelPayment"
).addEventListener(
    "click",
    closePaymentModal
);


document.getElementById(
    "closeHistoryModal"
).addEventListener(
    "click",
    closeHistoryModal
);


/* =====================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
===================================================== */

paymentModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            paymentModal
        ) {

            closePaymentModal();

        }

    }
);


historyModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            historyModal
        ) {

            closeHistoryModal();

        }

    }
);


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closePaymentModal();

            closeHistoryModal();

        }

    }
);


/* =====================================================
   PAYMENT FORM
===================================================== */

paymentForm.addEventListener(
    "submit",
    savePayment
);


/* =====================================================
   LOGOUT
===================================================== */

document.getElementById(
    "logout"
).addEventListener(
    "click",
    async () => {

        try {

            if (sb) {

                await sb.auth.signOut();

            }

        } catch (error) {

            console.error(
                "Logout error:",
                error
            );

        }

        window.location.href =
            "login.html";

    }
);


/* =====================================================
   START
===================================================== */

(async function init() {

    try {

        const authenticated =
            await guard();


        if (!authenticated) {
            return;
        }


        await loadPaymentsPage();

    } catch (error) {

        console.error(
            "Payments initialization error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to initialize payments page.",
            true
        );

    }

})();