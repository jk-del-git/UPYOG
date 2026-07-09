export const isSameDay = (receiptTimestamp) => {
    const receiptDate = new Date(receiptTimestamp);
    const today = new Date();

    return (
      receiptDate.getDate() === today.getDate() &&
      receiptDate.getMonth() === today.getMonth() &&
      receiptDate.getFullYear() === today.getFullYear()
    );
  };

export const isAdminUser = () => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));

    // Change according to your localStorage structure
    return userInfo.roles.some(role => role.code === "EDIT_RECEIPT_ADMIN");
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

export   const mapApiToForm = (payment = {}) => {
    const paymentDetail = payment && payment.paymentDetails[0] || {};

    return {
      receiptNumber: paymentDetail.receiptNumber || "",
      receiptDate: formatDate(paymentDetail.receiptDate),
      totalAmountPaid: payment.totalAmountPaid || "",
      payerName: payment.payerName || "",
      payerAddress: payment.payerAddress || "",
      wardNo: payment.additionalDetails.wardNo || payment.additionalDetails.ward || "",
      narration: payment.additionalDetails.narration || "",
      transactionNumber: payment.transactionNumber || "",
      
    };
  };

  export const renderTextFields = [
    { key: "receiptNumber", name: "Receipt Number", label: "UC_COMMON_TABLE_COL_RECEIPT_NO" },
    { key: "receiptDate", name: "Receipt Date", label: "UC_COMMON_TABLE_COL_DATE" },
    { key: "totalAmountPaid", name: "Total Amount Paid", label: "TL_LOCALIZATION_TOTAL_AMOUNT_PAID" },
    { key: "payerName", name: "Payer Name", label: "PT_RECEIPT_PAYER_NAME" },
    { key: "payerAddress", name: "Payer Address", label: "PDF_STATIC_LABEL_CONSOLIDATED_BILL_PAYER_ADDRESS" },
    { key: "wardNo", name: "Ward Number", label: "UC_MOHALLA_LABEL" },
    { key: "narration", name: "Narration", label: "UC_COMMON_NARRATION" },
    { key: "transactionNumber", name: "Transaction Number", label: "ES_COMMON_TRANSANCTION_NO" }
  ];


//   ===========================================================  //


const getUserRoles = () => {
  const userInfo = JSON.parse(localStorage.getItem("user-info")) || {};
  return userInfo.roles || [];
};

export const hasReceiptUserRole = () => {
  return getUserRoles().some(
    role => role.code === "EDIT_RECEIPT_USER"
  );
};

export const hasReceiptAdminRole = () => {
  return getUserRoles().some(
    role => role.code === "EDIT_RECEIPT_ADMIN"
  );
};

export const canEditReceipt = () => {
  return hasReceiptUserRole() || hasReceiptAdminRole();
};