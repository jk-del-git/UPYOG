const formConfig = {
  name: "employeeForgotPasswd",
  fields: {
    username: {
      id: "person-phone",
      jsonPath: "otp.mobileNumber",
      required: true,
      floatingLabelText: "CORE_COMMON_MOBILE_NUMBER",
      errorMessage: "CORE_COMMON_PHONENO_INVALIDMSG",
      hintText: "CORE_COMMON_PHONE_NUMBER_PLACEHOLDER",
     // pattern: "^([0-9]){10}$",
     value: "",
    },
    type: {
      id: "otp-type",
      jsonPath: "otp.type",
      value: "passwordreset",
    },
    tenantId: {
      id: "employee-forgot-password-tenantId",
      jsonPath: "employee.tenantId",
      // required: true,
      required:false,
      floatingLabelText: "CORE_COMMON_CITY",
      hintText: "CORE_COMMON_CITY_PLACEHOLDER",
      value:""
    },
    userType: {
      id: "user-type",
      jsonPath: "otp.userType",
      value: "EMPLOYEE",
    },
    city:  {
      id: "person-city",
      jsonPath: "otp.tenantId",
      required: true,
      floatingLabelText: "CORE_COMMON_CITY",
      hintText: "CORE_COMMON_CITY_PLACEHOLDER",
      hintText: "CORE_COMMON_ORGANISATION",
    },
    mappedUlb: {
      id: "person-mappedUlb",
      jsonPath: "otp.mappedUlb",
      required: false,
      floatingLabelText: "CORE_COMMON_CITY",
      hintText: "CORE_COMMON_CITY_PLACEHOLDER",
      hintText: "CORE_COMMON_ULB",
    },
  },
  submit: {
    type: "submit",
    label: "CORE_COMMON_CONTINUE",
    id: "employee-forgot-password-submit-action",
    // id:"login-submit-action",
  },
  saveUrl: "/user-otp/v1/_send",
  redirectionRoute: "/user/otp",
  action: "token",
};
export default formConfig;
