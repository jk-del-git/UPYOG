import React, { useState } from "react";
import { TextField, TextArea } from "components";
import { Button } from "egov-ui-framework/ui-atoms";
import Label from "egov-ui-kit/utils/translationNode";
import "./index.css";
import { connect } from "react-redux";
import { toggleSnackbarAndSetText } from "egov-ui-kit/redux/app/actions";
import { getTenantId, getAccessToken } from "egov-ui-kit/utils/localStorageUtils";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import formConfig from "../../../../../../config/forms/specs/paymentReceipt";
import CircularProgress from "@material-ui/core/CircularProgress";
import { isSameDay, mapApiToForm, renderTextFields } from "../../utility";
import {
  hasReceiptAdminRole,
  hasReceiptUserRole,
  canEditReceipt,
} from "../../utility";



const labelContainerStyle = {
  width: "101px"
}

const textFieldStyle = {
  width: "100%",
  height: "30px",
  padding: "0px 15px",
  marginTop: "4px",
  border: "1px solid #b3b3b3",
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
  const [loading, setLoading] = useState(false);
  const [isEditAllowed, setIsEditAllowed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentResponse,setPaymentResponse] = useState()
  const [paymentId, setPaymentId] = useState();
  const [searchReceiptNo, setSearchReceiptNo] = useState("");
  const fields = form.fields || {};
  const submit = form.submit;

  const userInfo = JSON.parse(localStorage.getItem("user-info"));


  //Update API
  const updateReceipt = async () => {
    if (!fields.payerName.value || !fields.payerName.value.trim()) {
      toggleSnackbarAndSetText(
        true,
        { labelKey: "UC_COMMON_PAYER_NAME_MANDATORY" },
        "error"
      );
      return;
    }

    if (!canEditReceipt()) {
      toggleSnackbarAndSetText(
        true,
        { labelKey: "UC_COMMON_NOT_AUTHORISED_USER_EDIT" },
        "error"
      );
      return;
    }
    try {
      setLoading(true);
      setErrorMessage("");
      const payload = {
        RequestInfo: {
          apiId: "collection-services",
          authToken: getAccessToken(), // or wherever your auth token is stored
          userInfo: {
            id: JSON.parse(localStorage.getItem("user-info")).id,
            uuid: JSON.parse(localStorage.getItem("user-info")).uuid,
            type: "EMPLOYEE",
            roles: userInfo.roles || []
          }
        },
        Payment: {
          id: paymentResponse && paymentResponse.id, // You'll need to save this when fetching
          tenantId: getTenantId(),
          paymentMode: paymentResponse && paymentResponse.paymentMode, // or fields.paymentMode.value
          totalAmountPaid: Number(fields.totalAmountPaid.value),
          paidBy: fields.payerName.value,
          payerName: fields.payerName.value,
          payerAddress: fields.payerAddress.value,
          additionalDetails: {
            ward: fields.wardNo.value,
            wardNo: fields.wardNo.value,
            narration: fields.narration.value,
          },
          paymentDetails: [...paymentResponse.paymentDetails]
        }
      };

      const response = await httpRequest(
        "post",
        "collection-services/payments/_update",
        "_update",
        [],
        payload
      );

      toggleSnackbarAndSetText(
        true,
        { labelKey: "UC_COMMON_RECEIPT_UPDATE_MESSAGE" },
        "success"
      );
    } catch (error) {
      toggleSnackbarAndSetText(
        true,
        { labelKey: error.message || "Something went wrong while updating receipt." },
        "error"
      );
    }
    finally {
      setLoading(false);
    }
  };
  
  const fetchReceipt = async (receiptNumber) => {
    if (!receiptNumber.trim()) {
      setErrorMessage("Please enter a receipt number.");
      return;
    }

    // Authorization check before API call
    if (!canEditReceipt()) {
      setErrorMessage("You are not authorized to edit receipts.");
      setIsEditAllowed(false);
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setIsEditAllowed(false);

    try {
      const userInfo = JSON.parse(localStorage.getItem("user-info"));

      const queryParams = [
        { key: "tenantId", value: getTenantId() },
        { key: "receiptNumbers", value: receiptNumber.trim() }
      ];

      const response = await httpRequest(
        "post",
        "collection-services/payments/_receiptsearch",
        "_search",
        queryParams,
        {
          apiId: "collection-services",
          authToken: getAccessToken(),
          userInfo: {
            id: userInfo.id,
            uuid: userInfo.uuid,
            type: userInfo.type,
            roles: userInfo.roles || []
          }
        }
      );

      const payment = response && response.Payments[0];

      if (!payment) {
        setErrorMessage("Receipt not found.");
        return;
      }

      setPaymentResponse(payment)

      const receiptDate = payment && payment.paymentDetails[0] && payment.paymentDetails[0].receiptDate;

      // Admin can edit any receipt
      if (hasReceiptAdminRole()) {
        const mapped = mapApiToForm(payment);

        Object.keys(mapped).forEach((key) => {
          handleFieldChange(key, mapped[key]);
        });

        setIsEditAllowed(true);
        return;
      }

      // EDIT_RECEIPT_USER can edit only same-day receipts
      if (hasReceiptUserRole()) {
        if (!isSameDay(receiptDate)) {
          setErrorMessage(
            "This receipt can only be edited on the day it was generated."
          );
          return;
        }

        const mapped = mapApiToForm(payment);

        Object.keys(mapped).forEach((key) => {
          handleFieldChange(key, mapped[key]);
        });

        setIsEditAllowed(true);
      }
    } catch (error) {

      setErrorMessage(
        error.message || "Something went wrong while fetching the receipt."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <React.Fragment>
      <div className="inside-login-card" style={{
        marginLeft: "1%",
        paddingLeft: "2%"
      }}>
        {/* Header */}
        <div>
          <Label fontSize={18} labelStyle={{fontWeight:500,color:"black"}} label="CORE_COMMON_EDIT_RECEIPT_HEADER" />
        </div>
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
            // disabled={searchReceiptNo==""}
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



        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              background: "rgba(255,255,255,0.35)",
              backdropFilter: "blur(0.2px)",
              zIndex: 1000,
            }}
          >
            <CircularProgress size={35} />
          </div>
        )}
        {isEditAllowed && (

          <div
            style={{
              position: "relative",
              marginTop: "4rem",
            }}
          >
            <div
              style={{
                filter: loading ? "blur(2px)" : "none",
                pointerEvents: loading ? "none" : "auto",
                transition: "0.2s ease",
              }}
            >
              <React.Fragment>
                <div style={{
                  padding: "0 0 0 7.5rem",
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

                          <div style={{ display: "flex", alignItems: "center" }}>
                            <Label
                              fontSize={14}
                              containerStyle={labelContainerStyle}
                              label={item.label ? item.label : item.name}
                              required={item.key=="payerName"}
                            />
                            
                          </div>
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
                        </div>
                      </React.Fragment>)
                  })}

                </div>
                <div style={{ display: "flex", justifyContent: "center", margin: "4rem 0rem", paddingRight: "8rem" }}>
                  <Button
                    disabled={loading}
                    // {...submit}
                    onClick={updateReceipt}
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
              </React.Fragment>
            </div>
          </div>)}
      </div>
    </React.Fragment>);
};
const mapStateToProps = (state) => {
  return { tenantId: state.auth.tenantId }
};

const mapDispatchToProps = (dispatch) => ({
  toggleSnackbarAndSetText: (open, message, variant) =>
    dispatch(toggleSnackbarAndSetText(open, message, variant))
});

// export default PaymentReceipts;
export default connect(mapStateToProps, mapDispatchToProps)(PaymentReceipts)
