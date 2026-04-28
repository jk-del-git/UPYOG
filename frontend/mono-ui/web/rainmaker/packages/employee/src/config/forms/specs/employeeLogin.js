const formConfig = {
  name: "employeeLogin",
  fields: {
    username: {
      id: "employee-phone",
      jsonPath: "employee.username",
      required: true,
      floatingLabelText: "CORE_LOGIN_USERNAME",
      errorMessage: "CORE_COMMON_USERNAME_INVALIDMSG",
      hintText: "CORE_LOGIN_USERNAME_PLACEHOLDER",
      pattern: "^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$",
      value: "",
    },
    password: {
      id: "employee-password",
      jsonPath: "employee.password",
      required: true,
      type: "password",
      floatingLabelText: "CORE_LOGIN_PASSWORD",
      errorMessage: "CORE_LOGIN_PASSWORD_ERRORMSG",
      hintText: "CORE_LOGIN_PASSWORD_PLACEHOLDER",
      pattern: "^([a-zA-Z0-9@#$%])+$",
      value: "",
      style:{},
    },
    city: {
      id: "person-city",
      jsonPath: "employee.tenantId",
      required: true,
      floatingLabelText: "CORE_COMMON_CITY",
      hintText: "CORE_COMMON_ORGANISATION",
    },
    mappedUlb: {
      id: "person-mappedUlb",
      jsonPath: "employee.mappedUlb",
      required: false,
      floatingLabelText: "CORE_COMMON_CITY",
      hintText: "CORE_COMMON_ULB",
    },
    captcha: {
      id: "employee-captcha",
      jsonPath: "employee.captcha",
      required: false,  
      value:"",
      floatingLabelText: "",
      hintText: "CORE_COMMON_CAPTCHA",
    },
  },
  submit: {
    label: "CORE_COMMON_LOGIN",
    id: "login-submit-action",
    type: "submit",
  },
  saveUrl: "/user-otp/v1/_send",
  redirectionRoute: "/inbox",
  action: "token",
};

export default formConfig;
