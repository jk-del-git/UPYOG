import React from "react";
import { Button, Card, TextField, Image } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import logo from "egov-ui-kit/assets/images/logo_black.png"
import "./index.css";

const OTPForm = ({ handleFieldChange, toggleSnackbarAndSetText, form, resendOTP, phoneNumber,logoUrl }) => {
  const fields = form.fields || {};
  const submit = form.submit;
  const { newPassword, confirmnewpassword } = fields || {};
  
  return (
    <React.Fragment>
      <div style={{display:"flex", justifyContent:"center", marginTop:"0%", marginBottom:"2%"}}>
    <div style={{
      
      display: "flex",
      alignItems: "anchorCenter",}}
    >
          <div
            style={{
        marginBottom: "20px", 
        display: "flex",
        justifyContent: "center",
        marginTop: "8px",
        alignItems: "center",
      }}
            >
              
            <h3 style={{ fontSize: "27px", marginLeft: "12px", marginTop: "17px", fontWeight:"500" }}>
              <strong style={{ 
                color: "#0C3A60",
                // color:"white",
                 paddingRight: "15px", lineHeight: "1.2" }}>
                Housing and Urban <br /> Development Deparment
              </strong>
              <br />
              <p style={{ 
                color: "#0C3A60",
                fontWeight: "500",
                fontSize: "14px", marginTop: "5px" }}>
                Government of Jammu & Kashmir
              </p>
            </h3>
          </div>
        </div>
    <Card
      className="user-screens-card col-lg-offset-4 col-lg-4 col-md-offset-4 col-md-4 col-sm-offset-4 col-sm-4"
      style={{
    gap: "8%",
    display: "flex",
    marginLeft:"12%",
    width: "40%",
    padding: "25px 28px",
    borderRadius: "5px"
    
  }}
      textChildren={
        <React.Fragment>
        <div style={{width:"100%"}}>
          <Label className="text-center" color={"rgb(12, 58, 96)"} bolder={true} fontSize={22} label="CORE_COMMON_FORGOT_PASSWORD_LABEL" />
          <div className="citizen-otp-sent-message" style={{ marginTop: 24, display:"flex",justifyContent: "space-around" }}>
            <Label label="CORE_OTP_SENT_MESSAGE" />
            <Label  label={phoneNumber} />
          </div>
          <Label label="CORE_EMPLOYEE_OTP_CHECK_MESSAGE" color={"rgba(0, 0, 0, 0.3799999952316284)"} fontSize={"12px"} />
          <form style={{display: "flex",
    flexDirection: "column",
    gap: "16px"}}>
            <TextField
             
              errorStyle={{ bottom: "0px" }}
              onChange={(e, value) => handleFieldChange("otpReference", value)}
              id="otp"
              {...fields.otpReference}
              fullWidth={true}
              type={"number"}
               hintStyle={{
  fontSize: "14px",
  fontWeight:"400",
  color:"rgb(38,38,38,0.62)",
 }}
  inputStyle={{marginTop:"4px"}}
   style={{
  width: "100%",
  height: "44px",
  padding: "0px 15px",
  marginTop:"4px",
  border: "1px solid #b3b3b3",
  // borderRadius: "10px",
  borderRadius: "5px",
  fontSize: "14px !important",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
  backgroundColor: "#fff",
  color: "#1B1B1B",
  letterSpacing: "0.7px"}} 
  underlineShow={false}
  required={false}
            />
            <div style={{ marginBottom: 0 }} className="text-right employee-resend-otp-text">
              <Label id="otp-trigger" className="otp-prompt" label="CORE_OTP_NOT_RECEIVE" />
              <span style={{ cursor: "pointer" }} onClick={() => resendOTP()}>
                <Label id="otp-resend" className="otp-resend" label="CORE_OTP_RESEND" />
              </span>
            </div>
            <TextField
            
             onChange={(e, value) => handleFieldChange("username", value)} {...fields.username} 
              hintStyle={{
  fontSize: "14px",
  fontWeight:"400",
  color:"rgb(38,38,38,0.62)",
 }}
  inputStyle={{marginTop:"4px"}}
   style={{
  width: "100%",
  height: "44px",
  padding: "0px 15px",
  marginTop:"4px",
  border: "1px solid #b3b3b3",
  // borderRadius: "10px",
  borderRadius: "5px",
  fontSize: "14px !important",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
  backgroundColor: "#fff",
  color: "#1B1B1B",
  letterSpacing: "0.7px"}} 
  underlineShow={false}
   required={false}
              />

            <TextField
            
             onChange={(e, value) => handleFieldChange("newPassword", value)} {...fields.newPassword} 
              hintStyle={{
  fontSize: "14px",
  fontWeight:"400",
  color:"rgb(38,38,38,0.62)",
 }}
  inputStyle={{marginTop:"4px"}}
   style={{
  width: "100%",
  height: "44px",
  padding: "0px 15px",
  marginTop:"4px",
  border: "1px solid #b3b3b3",
  // borderRadius: "10px",
  borderRadius: "5px",
  fontSize: "14px !important",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
  backgroundColor: "#fff",
  color: "#1B1B1B",
  letterSpacing: "0.7px"}} 
  underlineShow={false}
   required={false}
              />
            <TextField
            
              onChange={(e, value) => handleFieldChange("confirmnewpassword", value)}
              {...fields.confirmnewpassword}
            hintStyle={{
  fontSize: "14px",
  fontWeight:"400",
  color:"rgb(38,38,38,0.62)",
 }}
  inputStyle={{marginTop:"4px"}}
   style={{
  width: "100%",
  height: "44px",
  padding: "0px 15px",
  marginTop:"4px",
  border: "1px solid #b3b3b3",
  // borderRadius: "10px",
  borderRadius: "5px",
  fontSize: "14px !important",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
  backgroundColor: "#fff",
  color: "#1B1B1B",
  letterSpacing: "0.7px"}} 
  underlineShow={false}
  required={false}
            />

            <Button
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
              fullWidth={true}
              primary={true}
            />
          </form>
        </div>
      </React.Fragment>}
    />
    </div>
  </React.Fragment>);
};

export default OTPForm;
