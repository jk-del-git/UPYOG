import React from "react";
import { Card, TextField, Image } from "components";
import { Button } from "egov-ui-framework/ui-atoms";
import Label from "egov-ui-kit/utils/translationNode";
import logo from "egov-ui-kit/assets/images/logo_black.png";
import "./index.css";

//----------------------------------STYLES----------------------------

const STYLES = {
  embelemBox: {
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
    marginTop: "8px",
    alignItems: "center",
  },
  emebelemImg: { width: "auto", height: "103px", padding: "0px 11px" },
  title: { fontSize: "27px", marginLeft: "12px", marginTop: "17px", fontWeight: "500" },
  titleStyle: {
    color: "#0C3A60",
    // color:"white",
    paddingRight: "15px",
    lineHeight: "1.2",
  },
  subtitleStyle: {
    color: "#0C3A60",
    fontWeight: "500",
    fontSize: "14px",
    marginTop: "5px",
  },
  otpBox: { width: "100%" },
  otpHeader: { marginTop: 24, display: "flex", justifyContent: "space-around" },
  otpForm: { display: "flex", flexDirection: "column", gap: "16px" },

  //Textfield
  otpError: { bottom: "0px" },
  hintStyle: {
    fontSize: "14px",
    fontWeight: "400",
    color: "rgb(38,38,38,0.62)",
  },
  inputStyle: { marginTop: "4px" },
  inputField: {
    width: "100%",
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
  },
  otpResendBox: {
    marginBottom: 0,
  },
  otpLabel: { cursor: "pointer" },
  continueBtn: {
    height: "48px",
    width: "100%",
    margin: "10px 0px 40px 0px",
  },
  continueBtnLabel: { fontWeight: 500 },
};

//---------------------------------------------------------------------

const OTPForm = ({ handleFieldChange, toggleSnackbarAndSetText, form, resendOTP, phoneNumber, logoUrl }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  const { newPassword, confirmnewpassword } = fields || {};

  return (
    <React.Fragment>
      <div className="mn-content-forget-pss-otp">
        <div className="left-emblem">
          <div style={STYLES.embelemBox}>
            <img src={`${process.env.PUBLIC_URL}/emblem_of_India.webp`} alt="Emblem of India" style={STYLES.emebelemImg} />
            <h3 style={STYLES.title}>
              <strong style={STYLES.titleStyle}>
                Housing and Urban <br /> Development Department
              </strong>
              <br />
              <p style={STYLES.subtitleStyle}>Government of Jammu & Kashmir</p>
            </h3>
          </div>
        </div>
        <Card
          className="login-card user-screens-card col-lg-offset-4 col-lg-4 col-md-offset-4 col-md-4 col-sm-offset-4 col-sm-4"
          textChildren={
            <React.Fragment>
              <div style={STYLES.otpBox}>
                <Label className="text-center" color={"rgb(12, 58, 96)"} bolder={true} fontSize={22} label="CORE_COMMON_FORGOT_PASSWORD_LABEL" />
                <div className="citizen-otp-sent-message" style={STYLES.otpHeader}>
                  <Label label="CORE_OTP_SENT_MESSAGE" />
                  <Label label={phoneNumber} />
                </div>
                <Label label="CORE_EMPLOYEE_OTP_CHECK_MESSAGE" color={"rgba(0, 0, 0, 0.3799999952316284)"} fontSize={"12px"} />
                <form style={STYLES.otpForm}>
                  <TextField
                    errorStyle={STYLES.otpError}
                    onChange={(e, value) => handleFieldChange("otpReference", value)}
                    id="otp"
                    {...fields.otpReference}
                    fullWidth={true}
                    type={"number"}
                    hintStyle={STYLES.hintStyle}
                    inputStyle={STYLES.inputStyle}
                    style={STYLES.inputField}
                    underlineShow={false}
                    required={false}
                  />
                  <div style={STYLES.otpResendBox} className="text-right employee-resend-otp-text">
                    <Label id="otp-trigger" className="otp-prompt" label="CORE_OTP_NOT_RECEIVE" />
                    <span style={STYLES.otpLabel} onClick={() => resendOTP()}>
                      <Label id="otp-resend" className="otp-resend" label="CORE_OTP_RESEND" />
                    </span>
                  </div>
                  <TextField
                    onChange={(e, value) => handleFieldChange("username", value)}
                    {...fields.username}
                    hintStyle={STYLES.hintStyle}
                    inputStyle={STYLES.inputStyle}
                    style={STYLES.inputField}
                    underlineShow={false}
                    required={false}
                  />

                  <TextField
                    onChange={(e, value) => handleFieldChange("newPassword", value)}
                    {...fields.newPassword}
                    hintStyle={STYLES.hintStyle}
                    inputStyle={STYLES.inputStyle}
                    style={STYLES.inputField}
                    underlineShow={false}
                    required={false}
                  />
                  <TextField
                    onChange={(e, value) => handleFieldChange("confirmnewpassword", value)}
                    {...fields.confirmnewpassword}
                    hintStyle={STYLES.hintStyle}
                    inputStyle={STYLES.inputStyle}
                    style={STYLES.inputField}
                    underlineShow={false}
                    required={false}
                  />

                  {/* <Button
                    {...submit}
                    onClick={(e) => {
                      if (newPassword.value !== confirmnewpassword.value) {
                        e.preventDefault();
                        toggleSnackbarAndSetText(
                          true,
                          {
                            labelName: "Password do not match",
                            labelKey: "ERR_PASSWORD_DO_NOT_MATCH",
                          },
                          "error"
                        );
                      }
                    }}
                    style={{ marginBottom: "20px" }}
                    fullWidth={true}
                    primary={true}
                  /> */}
                  <Button
                    {...submit}
                    style={STYLES.continueBtn}
                    variant={"contained"}
                    color={"primary"}
                    onClick={(e) => {
                      if (newPassword.value !== confirmnewpassword.value) {
                        e.preventDefault();
                        toggleSnackbarAndSetText(
                          true,
                          {
                            labelName: "Password do not match",
                            labelKey: "ERR_PASSWORD_DO_NOT_MATCH",
                          },
                          "error"
                        );
                      }
                    }}
                  >
                    <Label buttonLabel={true} labelStyle={STYLES.continueBtnLabel} label="CORE_COMMON_CONTINUE" />
                  </Button>
                </form>
              </div>
            </React.Fragment>
          }
        />
      </div>
    </React.Fragment>
  );
};

export default OTPForm;
