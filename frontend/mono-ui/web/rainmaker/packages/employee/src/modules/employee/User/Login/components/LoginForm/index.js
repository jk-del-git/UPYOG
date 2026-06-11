import React, {  useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, TextField, Image, UsernameFieldWithIcon, OTPInputField } from "components";
import { Button } from "egov-ui-framework/ui-atoms";
import {  CityPickerNew} from "modules/common";
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


const LoginForm = ({ handleFieldChange, form, onForgotPasswdCLick, logoUrl, cities, toggleSnackbarAndSetText }) => {
  const [generatedCaptcha, setGeneratedCaptcha] = useState("");
  const [errorCaptcha, setErrorCaptcha] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const [isTimerComplete, setIsTimerComplete] = useState(false);
  const fields = form.fields || {};
  const city = fields.city || {};
  const citySelected = city.value || "";
  const submit = form.submit;
  const generate = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 6;
    let captcha = "";//

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      captcha += chars[randomIndex];
    }

    localStorage.setItem("captcha", captcha);
    setGeneratedCaptcha(captcha);
  };

  function groupByParent(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return {};
    }

    const result = {};

    for (const item of data) {
      if (!item || !item.parent) continue;

      if (!result[item.parent]) {
        result[item.parent] = [];
      }

      // Push a shallow copy to avoid mutating original objects
      result[item.parent].push({ ...item });
    }

    // Sort each parent's array alphabetically by `name`
    for (const parentKey in result) {
      result[parentKey].sort((a, b) => {
        const nameA = typeof a.name === "string" ? a.name : "";
        const nameB = typeof b.name === "string" ? b.name : "";

        return nameA.localeCompare(nameB, undefined, {
          sensitivity: "base", // case-insensitive
          numeric: true        // "Item 2" < "Item 10"
        });
      });
    }

    return result;
  }

  const onClickOTPgeneration = async () => {
    try {
      const username = fields.username && fields.username.value ? fields.username.value : "";
      const tenantId = (Array.isArray(groupByParent(cities)[citySelected]) && groupByParent(cities)[citySelected].length > 0) ?
        (fields.mappedUlb && fields.mappedUlb.value ? fields.mappedUlb.value : "") :
        (fields.city && fields.city.value ? fields.city.value : "");

      if (!username || !tenantId) {
        alert("Please enter username and select city before sending OTP");
        return;
      }

      // ===== STEP 1: Call user/v1/_search API =====
      const userSearchRequestBody = {
        RequestInfo: {
          apiId: "ap.public",
          ver: "1",
          ts: null,
          action: "POST",
          did: "null",
          key: "null",
          authToken: null,
        },
        username: username,
        tenantId: tenantId,
      };

      const userSearchResponse = await axios.post(
        "/user/v1/_search",
        userSearchRequestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      // Extract user details from response
      const userData = userSearchResponse.data && userSearchResponse.data.user && userSearchResponse.data.user[0];

      if (!userData) {
        alert("User not found. Please check username and try again.");
        return;
      }

      const userMobileNumber = userData.mobileNumber;

      if (!userMobileNumber) {
        alert("Mobile number not found for this user.");
        return;
      }

      // ===== STEP 2: Call user-otp/v1/_send API =====
      const otpSendRequestBody = {
        RequestInfo: {
          api_id: "1",
          ver: "1",
          ts: null,
          action: "create",
          did: "",
          key: "",
          msg_id: "",
          requester_id: "",
          auth_token: null,
        },
        otp: {
          tenantId: tenantId,
          mobileNumber: userMobileNumber,
        }
      };

      const otpSendResponse = await axios.post(
        "/user-otp/v1/_send",
        otpSendRequestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setShowOTPField(true);
      setIsTimerComplete(false);
      // alert("CORE_OTP_SENT_MESSAGE" + userMobileNumber);

        // Get localized labels
    const localizationLabels = transformById(
      JSON.parse(getLocalization(`localization_${getLocale()}`)),
      "code"
    );
    const translatedMessage = getLocaleLabels("CORE_OTP_SENT_MESSAGE", localizationLabels);
    const finalMessage = `${translatedMessage} ${userMobileNumber}`;
      toggleSnackbarAndSetText(
        true,
        { labelKey: finalMessage },
        "success"
      )

    } catch (error) {
      alert("Failed to send OTP. Please try again.");
    }
  }


  useEffect(() => {
    generate();

  }, []);


  return (
    <React.Fragment>
      <div className="mn-content" >
         <div className="left-emblem"
        >
          <div
          className="inside-left-dv"
            
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" className="login-emblem-img" />
            <h3 className="main-login-header">
              <strong style={{
                color: "#0C3A60",
                // color:"white",
                paddingRight: "15px", lineHeight: "1.2"
              }}>
                Housing and Urban <br /> Development Deparment
              </strong>
              <br />
              <p style={{
                color: "#0C3A60",
                fontWeight: "500",
                fontSize: "14px", marginTop: "5px"
              }}>
                Government of Jammu & Kashmir
              </p>
            </h3>
          </div>
        </div>
        <Card
          className="login-card user-screens-card col-lg-offset-4 col-lg-4 col-md-offset-4 col-md-4 col-sm-offset-4 col-sm-4"
          textChildren={<React.Fragment>
            <div style={{ width: "100%" }}>
              <Label className="text-center" color={"rgb(12, 58, 96)"} bolder={true} fontSize={22} label="CORE_COMMON_LOGIN" />
              <UsernameFieldWithIcon onChange={(e, value) => handleFieldChange("username", value)} {...fields.username} />
              <UsernameFieldWithIcon onChange={(e, value) => handleFieldChange("password", value)} {...fields.password} />
              <CityPickerNew onChange={handleFieldChange} fieldKey="city" field={fields.city} flag={false} />
              {/* Adding one more dropdown */}
              {
                Array.isArray(groupByParent(cities)[citySelected]) && groupByParent(cities)[citySelected].length > 0 &&
                <CityPickerNew mappedOptions={groupByParent(cities)[citySelected]} onChange={handleFieldChange} flag={true} fieldKey="mappedUlb" field={fields.mappedUlb} />
              }
              {/* OTP Field */}

              {showOTPField && (<div>
                {!isTimerComplete ? (
                  <React.Fragment>
                  <div style={{ display: "flex" }}>
                    <React.Fragment>
                      <Label id="otp-resend" className="otp-prompt" label="CORE_ANOTHER_OTP" />
                      <CountdownTimer
                        timeLeft={30000}
                        tickCallback={(remainingTime) => {
                          if (remainingTime <= 0) {
                            setIsTimerComplete(true);
                          }
                        }}
                      />
                      <Label id="otp-resend" className="otp-timer" label="CORE_OTP_SECONDS" />
                    </React.Fragment>
                  </div>
                  <OTPInputField
                  length={6}
                  onChange={(value) => handleFieldChange("otp", value)}
                />
                </React.Fragment>
                ) : null}
                </div>)
          }
                
               <div className="get-otp-btn">
                {(!showOTPField || isTimerComplete) && <Button style={{
                  height: "48px",
                  width: "100%",
                  margin: "10px 0px"
                }}
                  variant={"contained"}
                  color={"primary"} onClick={() => onClickOTPgeneration()}>
                  <Label
                    buttonLabel={true} labelStyle={{ fontWeight: 500 }}
                    // label="CORE_GET_OTP_BUTTON"
                    label={!isTimerComplete ? "CORE_GET_OTP_BUTTON" : "CORE_OTP_RESEND"}
                  />
                </Button>}

              </div>
              {/* --------------------- */}
              {/* ------------ Captcha section start ------------- */}

              {/* <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop:"4%",
                      marginBottom:"4%"
                    }}
>
                    <div style={{
                      display: "flex",
                      justifyContent: "center",
                      width:"100%",
                      backgroundColor:"#f0f0f0",
                      backgroundSize:"cover",
                      backgroundPosition:"center",
                      backgroundRepeat:"no-repeat",
                    }}>
                     <span
                  className="captcha"
                  style={{
                    
                    fontSize: "29px",
                    fontWeight: "400",
                  }}
>
                  {generatedCaptcha}
</span></div>
</div>

<div style={{display:"grid", gridTemplateColumns:"9fr 1fr",  marginTop:"4%",
                      marginBottom:"4%"}}>
<div>
 <TextField
 required={false}
  {...fields.captcha}
 floatingLabelText={[null,null]}
 hintStyle={{
  fontSize: "14px",
  fontWeight:"400",
  color:"rgb(38,38,38,0.62)",
 }}
 inputStyle={{marginTop:"4px",}}
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
  letterSpacing: "0.7px",}} 
  underlineShow={false}
 onChange={(e, value) => {
   if(value !== generatedCaptcha) {
    setErrorCaptcha(true);
   }else{
    setErrorCaptcha(false)
   }
   handleFieldChange("captcha", value)
 }
 
}
                  />
</div>
                <div className="refresh-loop-div" style={{width:"100%", display:"flex", justifyContent:"end", alignItems:"center"}}>
<span
                    className="reload"
                    onClick={(event) => {
                      event.stopPropagation();
                      generate();
                    }}
>
<i class="material-icons">loop</i>
</span>
</div>

</div> */}
              {/* <div className="login__field field_disabled">
<Label fieldKey="captcha" field={fields.captcha} handleFieldChange={handleFieldChange} />
              {errorCaptcha && <span style={{ fontSize: "12px", color: "red" }}>Invalid Captcha</span> }
</div> */}
              {/* --------------Captcha section end */}
              {showOTPField && !isTimerComplete && (<Button
                {...submit}
                //  onClick={(e) => {
                //     if (generatedCaptcha !== fields.captcha.value) {
                //       e.preventDefault();
                //     }
                //   }}
                style={{
                  height: "48px",
                  width: "100%",
                }}
                variant={"contained"}
                color={"primary"}
              >
                <Label buttonLabel={true} labelStyle={{ fontWeight: 500 }} label="CORE_COMMON_CONTINUE" />
              </Button>)}
              <Link to="/forgot-password">
                <div style={{ float: "left" }}>
                  <Label
                    containerStyle={{ cursor: "pointer", position: "relative", zIndex: 10 }}
                    labelStyle={{ marginBottom: "12px" }}
                    className="forgot-passwd"
                    fontSize={14}
                    label="CORE_COMMON_FORGOT_PASSWORD"
                  />
                </div>
              </Link>
              {/* <Button {...submit} fullWidth={true} primary={true} /> */}
            </div>
          </React.Fragment>}
        />
      </div>
    </React.Fragment>);
};
const mapStateToProps = (state) => ({
  cities: state.common.cities,
  selectedCity: state.common.selectedCity
});

const mapDispatchToProps = (dispatch) => ({
  toggleSnackbarAndSetText: (open, message, variant) =>
    dispatch(toggleSnackbarAndSetText(open, message, variant))
});

// export default LoginForm;
export default connect(mapStateToProps, mapDispatchToProps)(LoginForm)
