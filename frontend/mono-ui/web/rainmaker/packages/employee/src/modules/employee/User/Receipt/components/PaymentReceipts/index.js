import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, TextField, Image, UsernameFieldWithIcon, OTPInputField } from "components";
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
import { getLocalization, getLocale } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import formConfig from "../../../../../../config/forms/specs/paymentReceipt";

const textFieldStyle = {
  width: "85%",
  height: "44px",
  padding: "0px 15px",
  marginTop: "4px",
  border: "1px solid #b3b3b3",
  // borderRadius: "10px",
  borderRadius: "5px",
  fontSize: "14px !important",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
  backgroundColor: "#fff",
  color: "#1B1B1B",
  letterSpacing: "0.7px",
}

const PaymentReceipts = ({ handleFieldChange, form, toggleSnackbarAndSetText, tenantId }) => {
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");
  const [errorCaptcha, setErrorCaptcha] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const [searchReceiptNo, setSearchReceiptNo] = useState("");
  const fields = form.fields || {};
  const city = fields.city || {};
  const citySelected = city.value || "";
  const submit = form.submit;

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
      transactionNumber: payment.transactionNumber || ""
    };
  };

  // useEffect(() => {
  //   const fetchReceipt = async () => {
  //     try {
  //       const queryParams = [
  //         { key: "tenantId", value: "pg.jmc" },
  //       ];

  //       const response = await httpRequest(
  //         "post",
  //         "collection-services/payments/_search",
  //         "_search",
  //         queryParams,
  //         {}
  //       );

  //       // handle response here
  //       console.log("RESPONSE", response.Payments[0]);
  //       if (response.Payments[1]) {
  //         const mapped = mapApiToForm(response.Payments[1]);

  //         Object.keys(mapped).forEach((key) => {
  //           handleFieldChange(key, mapped[key]);
  //         });
  //       }

  //     } catch (error) {
  //       console.error("Error fetching receipt:", error);
  //     }
  //   };

  //   fetchReceipt();
  // }, []);

  // const renderTextFields = ["receiptNumber", "totalAmountPaid",
  //   "payerName", "payerAddress", "wardNo", "narration", "transactionNumber"]
  const fetchReceipt = async (receiptNumber) => {
    try {
      const queryParams = [
        { key: "tenantId", value: tenantId },
        // { key: "receiptNumber", value: receiptNumber }
      ];
      console.log("SEE",tenantId)
      const response = await httpRequest(
        "post",
        "collection-services/payments/_search",
        "_search",
        queryParams,
        {}
      );

      const payment = response.Payments[0];

      console.log("CHECK THE TENANT ID HERE",tenantId);
      

      if (payment) {
        const mapped = mapApiToForm(payment);

        Object.keys(mapped).forEach((key) => {
          handleFieldChange(key, mapped[key]);
        });
      }
    } catch (error) {
      console.error("Error fetching receipt:", error);
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
      <div className="inside-login-card" style={{ width: "70%", marginLeft: "14%" }}>
        <div style={{ display: "flex",justifyContent:"center", gap: "8px", alignItems: "flex-end", marginBottom: "20px" }}>
  
  <div style={{ width: "250px" }}>
    <Label label="UC_COMMON_ENTER_RECEIPT_NO" />
    <TextField
      value={searchReceiptNo}
      onChange={(e, value) => setSearchReceiptNo(value)}
      style={{
        ...textFieldStyle,
        width: "100%"   // IMPORTANT FIX
      }}
      underlineShow={false}
      required={false}
      floatingLabelText={[null, null]}
    />
  </div>

  <Button
    variant="contained"
    color="primary"
    onClick={() => fetchReceipt(searchReceiptNo)}
    style={{
      height: "44px",
      minWidth: "100px"
    }}
  >
    Search
  </Button>

</div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}>
          {renderTextFields.map((item) => {
            const fieldConfig = formConfig && formConfig.fields[item.key] || {};
            const fieldState = fields && fields[item.key] || {};
            return (
              <React.Fragment>
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <Label label={item.label ? item.label : item.name} />
                  {/* <TextField
                    required={false}
                    {...fields[item.key]}
                    disabled={fields[item.key].disabled}
                    floatingLabelText={[null, null]}
                    hintStyle={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "rgb(38,38,38,0.62)",
                    }}
                    inputStyle={{
                      marginTop: "4px",
                      color: fields[item.key].disabled ? "#888" : "#1B1B1B"
                    }}
                    style={{
                      ...textFieldStyle,
                      backgroundColor: fields[item.key].disabled ? "#f2f2f2" : "#fff",
                      cursor: fields[item.key].disabled ? "not-allowed" : "text"
                    }}
                    underlineShow={false}
                    onChange={(e, value) => {
                      if (!fields[item.key].disabled) {
                        handleFieldChange(item.key, value);
                      }
                    }}
                  /> */}
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
                      color: fieldConfig.disabled ? "#888" : "#1B1B1B"
                    }}
                    style={{
                      ...textFieldStyle,
                      backgroundColor: fieldConfig.disabled ? "#f2f2f2" : "#fff",
                      cursor: fieldConfig.disabled ? "not-allowed" : "text"
                    }}
                    underlineShow={false}
                    onChange={(e, value) => {
                      if (!fieldConfig.disabled) {
                        handleFieldChange(item.key, value);
                      }
                    }}
                  />
                </div>
              </React.Fragment>)
          })}

        </div>
        <div style={{ display: "flex", justifyContent: "center", margin: "4rem 0rem" }}>
          <Button
            {...submit}
            //  onClick={(e) => {
            //     if (generatedCaptcha !== fields.captcha.value) {
            //       e.preventDefault();
            //     }
            //   }}
            style={{
              height: "48px",
              width: "20%",
            }}
            variant={"contained"}
            color={"primary"}
          >
            <Label buttonLabel={true} labelStyle={{ fontWeight: 500 }} label="ES_COMMON_UPDATE" />
          </Button>
        </div>
      </div>
    </React.Fragment>);
};
const mapStateToProps = (state) => {
  console.log("STATE IS",state)
  return { tenantId : state.auth.tenantId}
};

const mapDispatchToProps = (dispatch) => ({
  toggleSnackbarAndSetText: (open, message, variant) =>
    dispatch(toggleSnackbarAndSetText(open, message, variant))
});

// export default PaymentReceipts;
export default connect(mapStateToProps, mapDispatchToProps)(PaymentReceipts)
