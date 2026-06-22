const formConfig = {
    name: "paymentReceipt",

    fields: {
        transactionNumber: {
            id: "txn-number",
            jsonPath: "transactionNumber",
            floatingLabelText: "Transaction No",
            disabled: true,
            editable: false,
            value: "",
        },

        totalAmountPaid: {
            id: "amount-paid",
            jsonPath: "totalAmountPaid",
            floatingLabelText: "Amount Paid",
            disabled: true,
            editable: false,
            value: "",
        },

        payerName: {
            id: "payer-name",
            jsonPath: "payerName",
            floatingLabelText: "Payee Name",
            disabled: false,
            editable: true,
            value: "",
        },

        payerAddress: {
            id: "payer-address",
            jsonPath: "payerAddress",
            floatingLabelText: "Address",
            disabled: false,
            editable: true,
            value: "",
        },

        wardNo: {
            id: "ward-no",
            jsonPath: "additionalDetails.wardNo",
            floatingLabelText: "Ward",
            disabled: false,
            editable: true,
            value: "",
        },

        narration: {
            id: "narration",
            jsonPath: "additionalDetails.narration",
            floatingLabelText: "Narration",
            disabled: false,
            editable: true,
            value: "",
        },

        receiptNumber: {
            id: "receipt-number",
            jsonPath: "paymentDetails.0.receiptNumber",
            floatingLabelText: "Receipt No",
            disabled: true,
            editable: false,
            value: "",
        },
        receiptDate: {
            id: "receipt-date",
            jsonPath: "paymentDetails.0.receiptDate",
            floatingLabelText: "Receipt Date",
            disabled: true,
            editable: false,
            value: "",
        },
        receiptSearchNumber: {
            id: "receipt-search-number",
            jsonPath: "receiptSearchNumber",
            floatingLabelText: "Enter Receipt No",
            disabled: false,
            editable: true,
            value: "",
        }
    },
};

export default formConfig