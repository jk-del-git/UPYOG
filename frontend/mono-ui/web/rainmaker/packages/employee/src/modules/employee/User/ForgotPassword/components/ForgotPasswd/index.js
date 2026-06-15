import React from "react";
import { Card, TextField, Image } from "components";
import { Button} from "egov-ui-framework/ui-atoms";
import Label from "egov-ui-kit/utils/translationNode";
import logo from "egov-ui-kit/assets/images/logo_black.png";
import "./index.css";
import { CityPicker, CityPickerNew } from "modules/common";
import FieldNew from "egov-ui-kit/utils/fieldNew";
import { connect } from "react-redux";

const ForgotPasswd = ({ form, handleFieldChange,logoUrl,cities }) => {
  const fields = form.fields || {};
  const city = fields.city || {};
  const citySelected = city.value || "";
  const submit = form.submit;
  
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

  return (
    <React.Fragment>
     
      <div className="mn-content">
    
    <div className="left-emblem">
          <div
            style={{
        marginBottom: "20px", 
        display: "flex",
        justifyContent: "center",
        marginTop: "8px",
        alignItems: "center",
      }}
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" style={{ width: "auto", height: "103px", padding: "0px 11px" }} />
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
      className="login-card user-screens-card col-lg-offset-4 col-lg-4 col-md-offset-4 col-md-4 col-sm-offset-4 col-sm-4"

      textChildren={<React.Fragment>
        <div className="inside-login-card" style={{width:"100%"}}>
          <Label
            className="text-center" color={"rgb(12, 58, 96)"} bolder={true} fontSize={22}
            label="CORE_COMMON_FORGOT_PASSWORD_LABEL"
          />
          <FieldNew mobileNumber={true} fieldKey="username" field={fields.username} handleFieldChange={handleFieldChange} />
          {/* <CityPickerNew onChange={handleFieldChange} fieldKey="tenantId" field={fields.tenantId} /> */}
          <CityPickerNew onChange={handleFieldChange} fieldKey="city" field={fields.city} flag={false} />
          {
                      Array.isArray(groupByParent(cities)[citySelected]) && groupByParent(cities)[citySelected].length > 0 && 
                       <CityPickerNew mappedOptions={groupByParent(cities)[citySelected]} onChange={handleFieldChange} flag={true} fieldKey="mappedUlb" field={fields.mappedUlb} />
                    }
          <Button
           id="login-submit-action"
                {...submit}
            style={{
              height: "48px",     
              width:"100%",
              marginTop: "20px",
              marginBottom: "15px"       
            }}
            variant={"contained"}
            color={"primary"}
          >
            <Label buttonLabel={true}   labelStyle={{fontWeight:500 }}  label="CORE_COMMON_CONTINUE" />
          </Button>
          {/* <Button id="login-submit-action" primary={true} label="CONTINUE" fullWidth={true} {...submit} /> */}
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
// export default ForgotPasswd;
 export default connect(mapStateToProps)(ForgotPasswd)
