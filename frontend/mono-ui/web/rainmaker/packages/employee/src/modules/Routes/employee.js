import Loadable from "react-loadable";
// Keep these as normal imports
// because they are route definitions, not screens
import frameworkScreens from "./frameworkScreens";
import externalRoutes from "./exterenalURL";

// Generic loader
const Loading = () => null;

const lazyLoad = (loader) =>
  Loadable({
    loader,
    loading: Loading,
  });


// User related routes
const Login = lazyLoad(() =>
  import("modules/employee/User/Login")
);

const OTP = lazyLoad(() =>
  import("modules/employee/User/OTP")
);

const LanguageSelection = lazyLoad(() =>
  import("modules/employee/User/LanguageSelection")
);

const ChangePassword = lazyLoad(() =>
  import("modules/employee/User/ChangePassword")
);

const Profile = lazyLoad(() =>
  import("modules/employee/User/Profile")
);

const ForgotPassword = lazyLoad(() =>
  import("modules/employee/User/ForgotPassword")
);

const Receipt = lazyLoad(() =>
  import("modules/employee/User/Receipt")
);



const LandingPage = lazyLoad(() =>
  import("modules/employee/LandingPage")
);

const Inbox = lazyLoad(() =>
  import("modules/employee/Inbox")
);

const MDMS = lazyLoad(() =>
  import("modules/common/MDMS")
);

const Home = lazyLoad(() =>
  import("modules/employee/Home")
);

const Report = lazyLoad(() =>
  import("modules/employee/reports/report")
);

const EGFFinance = lazyLoad(() =>
  import("modules/employee/Erp/EGF")
);

const Dashboard = lazyLoad(() =>
  import("modules/employee/Dashboard")
);




//Redirection Url
const redirectionUrl = "/user/login";

const routes = [
  {
    path: "services/collection/receipts/editreceipt",
    component: Receipt,
    needsAuthentication: true,
    // options: { hideFooter: true, title: "CORE_COMMON_EDIT_RECEIPT_HEADER" },
  },
  {
    path: "user/login",
    component: Login,
    needsAuthentication: false,
    redirectionUrl: "/inbox",
  },
  {
    path: "user/otp",
    component: OTP,
    needsAuthentication: false,
    redirectionUrl: "/inbox",
  },
  {
    path: "forgot-password",
    component: ForgotPassword,
    needsAuthentication: false,
    // redirectionUrl: "/inbox",
  },
  {
    path: "language-selection",
    component: LanguageSelection,
    needsAuthentication: false,
    redirectionUrl: "/user/login",
  },
  // {
  //   path: "privacy-policy",
  //   component: PrivacyPolicy,
  //   needsAuthentication: false,
  //   redirectionUrl: "/",
  // },
  {
    path: "user/change-password",
    component: ChangePassword,
    needsAuthentication: true,
    options: { hideFooter: true, title: "CORE_COMMON_CHANGE_PASSWORD" },
  },
  {
    path: "user/profile",
    component: Profile,
    needsAuthentication: true,
    options: { hideFooter: true, title: "CS_HOME_HEADER_PROFILE" },
  },

  {
    path: "services/*",
    component: EGFFinance,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideTitle: true,
      isHomeScreen: true,
      hideFor: "ao",
      customFor: "csr",
    },
  },
  {
    path: "landing-page",
    component: LandingPage,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      redirectionUrl,
      title: "Home",
      hideTitle: true,
      isHomeScreen: true,
    },
  },
  {
    path: "inbox",
    component: Inbox,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      redirectionUrl,
      title: "Inbox",
      hideTitle: true,
      isHomeScreen: true,
    },
  },
 
  {
    path: "mdms/:moduleName/:masterName",
    component: MDMS,
    needsAuthentication: true,
    options: {
      title: "CS_HEADER_MDMS_COMMON",
      hideFooter: true,
      redirectionUrl,
    },
  },
  {
    path: "/",
    component: Home,
    needsAuthentication: true,
    options: {
      title: "COMMON_BOTTOM_NAVIGATION_HOME",
      hideFooter: false,
      redirectionUrl: "/user/login",
      //isHomeScreen: true,
    },
  },
  // {
  //   path: "map",
  //   component: TrackLocation,
  //   needsAuthentication: true,
  //   options: { hideHeader: true, hideFooter: true, title: "CS_HEADER_TRACK_LOCATION", hideTitle: true, hideActionMenu: true },
  // },
  {
    path: "report/:moduleName/:reportName",
    component: Report,
    needsAuthentication: true,

    options: {
      hideFooter: true,
      title: "CS_PGR_REPORTS_HEADER",
      hideTitle: true,
      redirectionUrl,
    },
  },
   {
    path: "mis-dashboard",
    component: Dashboard,
    needsAuthentication: true,
    options: {
      hideFooter: true,
      hideTitle: true,
      isHomeScreen: true,
    },
  },
  ...frameworkScreens,
  ...externalRoutes,
];

export default routes;