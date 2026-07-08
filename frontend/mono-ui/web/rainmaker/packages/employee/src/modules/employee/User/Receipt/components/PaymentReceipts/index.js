import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, TextField, Image, UsernameFieldWithIcon, OTPInputField, TextArea } from "components";
import { Button } from "egov-ui-framework/ui-atoms";
import { CityPickerNew } from "modules/common";
import Label from "egov-ui-kit/utils/translationNode";
import logo from "egov-ui-kit/assets/images/logo_black.png";
import "./index.css";
import { connect } from "react-redux";
import axios from "axios";
import { CountdownTimer } from "egov-ui-framework/ui-atoms/index";
import { Toast } from "components";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { getLocaleLabels, transformById } from "egov-ui-kit/redux/../../../packages/employee/src/ui-utils/commons";
import { getLocalization, getLocale, getTenantId } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import formConfig from "../../../../../../config/forms/specs/paymentReceipt";
import { transform } from "lodash";

const labelContainerStyle = {
  width: "101px"
}

const textFieldStyle = {
  width: "100%",
  height: "30px",
  padding: "0px 15px",
  marginTop: "4px",
  border: "1px solid #b3b3b3",
  // borderRadius: "10px",
  borderRadius: "3px",
  fontSize: "14px !important",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
  backgroundColor: "#fff",
  color: "#1B1B1B",
  letterSpacing: "0.7px",
}

const PaymentReceipts = ({ handleFieldChange, form, toggleSnackbarAndSetText, tenantId }) => {
  const [isEditAllowed, setIsEditAllowed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentId, setPaymentId] = useState();
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");
  const [errorCaptcha, setErrorCaptcha] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [searchReceiptNo, setSearchReceiptNo] = useState("");
  const fields = form.fields || {};
  const city = fields.city || {};
  const citySelected = city.value || "";
  const submit = form.submit;

  const isSameDay = (receiptTimestamp) => {
    const receiptDate = new Date(receiptTimestamp);
    const today = new Date();

    return (
      receiptDate.getDate() === today.getDate() &&
      receiptDate.getMonth() === today.getMonth() &&
      receiptDate.getFullYear() === today.getFullYear()
    );
  };

  const isAdminUser = () => {
    const userInfo = JSON.parse(localStorage.getItem("user-info"));

    // Change according to your localStorage structure
    return userInfo.roles.some(role => role.code === "XYZ");
  };

  //Update API
//   const updateReceipt = async () => {
//   try {
//     setErrorMessage("");

//     const payload = {
//       RequestInfo: {
//         apiId: "collection-services",
//         authToken: JSON.parse(localStorage.getItem("user-info")).access_token, // or wherever your auth token is stored
//         userInfo: {
//           id: JSON.parse(localStorage.getItem("user-info")).id,
//           uuid: JSON.parse(localStorage.getItem("user-info")).uuid,
//           type: "EMPLOYEE",
//           roles: JSON.parse(localStorage.getItem("user-info")).roles
//         }
//       },
//       Payment: {
//         id: fields.id.value, // You'll need to save this when fetching
//         tenantId: getTenantId(),
//         paymentMode: "CASH", // or fields.paymentMode.value
//         totalAmountPaid: Number(fields.totalAmountPaid.value),
//         paidBy: fields.payerName.value,
//         payerName: fields.payerName.value,
//         payerAddress: fields.payerAddress.value,
//         additionalDetails: {
//           ward: fields.wardNo.value,
//           narration: fields.narration.value
//         },
//         paymentDetails: []
//       }
//     };

//     const response = await httpRequest(
//       "post",
//       "collection-services/payments/_update",
//       "_update",
//       [],
//       payload
//     );

//     console.log("Update Response:", response);

//     toggleSnackbarAndSetText(
//       true,
//       "Receipt updated successfully.",
//       "success"
//     );
//   } catch (error) {
//     console.error("Update Error:", error);

//     toggleSnackbarAndSetText(
//       true,
//       "Failed to update receipt.",
//       "error"
//     );
//   }
// };

  //   const mapApiToForm = (payment = {}) => {
  //   return {
  //     receiptNumber: payment.receiptNumber || "",
  //     totalAmountPaid: payment.totalAmountPaid || "",
  //     payerName: payment.payerName || "",
  //     payerAddress: payment.payerAddress || "",
  //     wardNo: payment.wardNo || "",
  //     narration: payment.narration || "",
  //     transactionNumber: payment.transactionNumber || ""
  //   };
  // };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const mapApiToForm = (payment = {}) => {
    const paymentDetail = payment && payment.paymentDetails[0] || {};

    return {
      receiptNumber: paymentDetail.receiptNumber || "",
      receiptDate: formatDate(paymentDetail.receiptDate),
      totalAmountPaid: payment.totalAmountPaid || "",
      payerName: payment.payerName || "",
      payerAddress: payment.payerAddress || "",
      wardNo: payment.additionalDetails.wardNo || "",
      narration: payment.additionalDetails.narration || "",
      transactionNumber: payment.transactionNumber || "",
      
    };
  };

  const fetchReceipt = async (receiptNumber) => {
    try {
      setErrorMessage("");
      setIsEditAllowed(false);

      const queryParams = [
        { key: "tenantId", value: getTenantId() },
        { key: "receiptNumbers", value: receiptNumber }
      ];

      const response = await httpRequest(
        "post",
        "collection-services/payments/_search",
        // "collection-services/payments/_receiptsearch",
        "_search",
        queryParams,
        {

        }
      );

      const payment = response  && response.Payments[0];

      if (!payment) {
        setErrorMessage("Receipt not found.");
        return;
      }
      
      const admin = isAdminUser();
      const receiptDate = payment.paymentDetails && payment.paymentDetails[0] && payment.paymentDetails[0].receiptDate;

      // Admin can edit any receipt
      if (admin) {
        const mapped = mapApiToForm(payment);

        Object.keys(mapped).forEach((key) => {
          handleFieldChange(key, mapped[key]);
        });

        setIsEditAllowed(true);
        return;
      }

      // Non-admin can edit only same-day receipt
      if (isSameDay(receiptDate)) {
        const mapped = mapApiToForm(payment);

        Object.keys(mapped).forEach((key) => {
          handleFieldChange(key, mapped[key]);
        });

        setIsEditAllowed(true);
      } else {
        setErrorMessage(
          "This receipt cannot be edited because it was not generated on the current date."
        );
      }
    } catch (error) {
      console.error("Error fetching receipt:", error);

      setIsEditAllowed(false);
      setErrorMessage("Something went wrong while fetching the receipt.");
    }
  };
  const renderTextFields = [
    { key: "receiptNumber", name: "Receipt Number", label: "UC_COMMON_TABLE_COL_RECEIPT_NO" },
    { key: "receiptDate", name: "Receipt Date", label: "UC_COMMON_TABLE_COL_DATE" },
    { key: "totalAmountPaid", name: "Total Amount Paid", label: "TL_LOCALIZATION_TOTAL_AMOUNT_PAID" },
    { key: "payerName", name: "Payer Name", label: "PT_RECEIPT_PAYER_NAME" },
    { key: "payerAddress", name: "Payer Address", label: "PDF_STATIC_LABEL_CONSOLIDATED_BILL_PAYER_ADDRESS" },
    { key: "wardNo", name: "Ward Number", label: "UC_MOHALLA_LABEL" },
    { key: "narration", name: "Narration", label: "UC_COMMON_NARRATION" },
    { key: "transactionNumber", name: "Transaction Number", label: "ES_COMMON_TRANSANCTION_NO" }
  ];

  return (
    <React.Fragment>
      {/* <Label label="Edit Receipt"/> */}
      <div className="inside-login-card" style={{
        marginLeft: "1%",
        paddingLeft: "2%"
      }}>
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", alignItems: "flex-end", marginBottom: "20px" }}>

          <div style={{ display: "flex", alignItems: "center", width: "50%", gap: "2rem" }}>
            <Label fontSize={14} label="UC_COMMON_ENTER_RECEIPT_NO" />
            <TextField
              value={searchReceiptNo}
              onChange={(e, value) => setSearchReceiptNo(value)}
              style={{
                ...textFieldStyle,
                width: "51%"   // IMPORTANT FIX
              }}
              inputStyle={{
                marginTop: "6px",
              }}
              underlineShow={false}
              required={false}
              floatingLabelText={[null, null]}
            />

          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", paddingRight: "10rem" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => fetchReceipt(searchReceiptNo)}
            style={{
              height: "35px",
              minWidth: "100px",
              textTransform: "none",
            }}
          >
            Search
          </Button>
        </div>

        {errorMessage && (
          <div
            style={{
              marginTop: "20px",
              color: "#d32f2f",
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            {errorMessage}
          </div>
        )}

        {isEditAllowed && (
          <React.Fragment>
        <div style={{
          marginTop: "4rem",
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
        }}>
          {renderTextFields.map((item) => {
            const fieldConfig = formConfig && formConfig.fields[item.key] || {};
            const fieldState = fields && fields[item.key] || {};
            return (
              <React.Fragment>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}>
                  <Label fontSize={14} containerStyle={labelContainerStyle} label={item.label ? item.label : item.name} />
                  {item.key === "narration" ? (
                    <TextArea
                      required={false}
                      {...fieldState}
                      disabled={fieldConfig.disabled}
                      value={fieldState.value || ""}
                      rows={4}
                      floatingLabelText={null}
                      hintText=""
                      underlineStyle={{ borderBottom: "none" }}
                      underlineFocusStyle={{ borderBottom: "none" }}
                      style={{
                        ...textFieldStyle,
                        width: "43%",
                        minHeight: "90px",
                        resize: "vertical",
                        backgroundColor: fieldConfig.disabled ? "#f2f2f2" : "#fff",
                        cursor: fieldConfig.disabled ? "not-allowed" : "text",
                      }}
                      inputStyle={{
                        fontSize: "13px"
                      }}
                      onChange={(e, value) => {
                        if (!fieldConfig.disabled) {
                          handleFieldChange(item.key, value);
                        }
                      }}
                    />
                  ) : (
                    <TextField
                      required={false}
                      {...fieldState}
                      disabled={fieldConfig.disabled}
                      floatingLabelText={[null, null]}
                      hintStyle={{
                        fontSize: "14px",
                        fontWeight: "400",
                        color: "rgb(38,38,38,0.62)",
                      }}
                      inputStyle={{
                        marginTop: "4px",
                        color: fieldConfig.disabled ? "#888" : "#1B1B1B",
                        fontSize: "13px"
                      }}
                      style={{
                        ...textFieldStyle,
                        width: "43%",
                        backgroundColor: fieldConfig.disabled ? "#f2f2f2" : "#fff",
                        cursor: fieldConfig.disabled ? "not-allowed" : "text",
                      }}
                      underlineShow={false}
                      onChange={(e, value) => {
                        if (!fieldConfig.disabled) {
                          handleFieldChange(item.key, value);
                        }
                      }}
                    />
                  )}
                  {/* <TextField
                    required={false}
                    {...fieldState}
                    disabled={fieldConfig.disabled}
                    floatingLabelText={[null, null]}
                    hintStyle={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "rgb(38,38,38,0.62)",
                    }}
                    inputStyle={{
                      marginTop: "4px",
                      color: fieldConfig.disabled ? "#888" : "#1B1B1B"
                    }}
                    style={{
                      ...textFieldStyle,
                      width:"43%",
                      backgroundColor: fieldConfig.disabled ? "#f2f2f2" : "#fff",
                      cursor: fieldConfig.disabled ? "not-allowed" : "text"
                    }}
                    underlineShow={false}
                    onChange={(e, value) => {
                      if (!fieldConfig.disabled) {
                        handleFieldChange(item.key, value);
                      }
                    }}
                  /> */}
                </div>
              </React.Fragment>)
          })}

        </div>
        <div style={{ display: "flex", justifyContent: "center", margin: "4rem 0rem", paddingRight: "8rem" }}>
          <Button
            {...submit}
            // onClick={updateReceipt}
            //  onClick={(e) => {
            //     if (generatedCaptcha !== fields.captcha.value) {
            //       e.preventDefault();
            //     }
            //   }}
            style={{
              height: "35px",
              minWidth: "100px",
              textTransform: "none",
            }}
            variant={"contained"}
            color={"primary"}
          >
            <Label buttonLabel={true} labelStyle={{ fontWeight: 500 }} label="ES_COMMON_UPDATE" />
          </Button>
        </div>
        </React.Fragment>)}
      </div>
    </React.Fragment>);
};
const mapStateToProps = (state) => {
  console.log("STATE IS", state)
  return { tenantId: state.auth.tenantId }
};

const mapDispatchToProps = (dispatch) => ({
  toggleSnackbarAndSetText: (open, message, variant) =>
    dispatch(toggleSnackbarAndSetText(open, message, variant))
});

// export default PaymentReceipts;
export default connect(mapStateToProps, mapDispatchToProps)(PaymentReceipts)
