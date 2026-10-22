import React, { useEffect, useState } from "react";
import {
  StandaloneSearchBar,
  Loader,
  // CardBasedOptions,
  ComplaintIcon,
  PTIcon,
  CaseIcon,
  DropIcon,
  HomeIcon,
  // Calender,
  // DocumentIcon,
  HelpIcon,
  WhatsNewCard,
  OBPSIcon,
  WSICon,
} from "@upyog/digit-ui-react-components";
import { CardBasedOptions } from "../../../../../../react-components/src/index";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { CitizenSideBar } from "../../../components/TopBarSideBar/SideBar/CitizenSideBar";
import StaticCitizenSideBar from "../../../components/TopBarSideBar/SideBar/StaticCitizenSideBar";
import ChatBot from "./ChatBot";
const Home = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const tenantId = Digit.ULBService.getCitizenCurrentTenant(true);
  const [user, setUser] = useState(null);
  const DEFAULT_REDIRECT_URL = "/upyog-ui/citizen";
  const { data: { stateInfo, uiHomePage } = {}, isLoading } = Digit.Hooks.useStore.getInitData();
  let isMobile = window.Digit.Utils.browser.isMobile();
  if (window.Digit.SessionStorage.get("TL_CREATE_TRADE")) window.Digit.SessionStorage.set("TL_CREATE_TRADE", {})

  const conditionsToDisableNotificationCountTrigger = () => {
    if (Digit.UserService?.getUser()?.info?.type === "EMPLOYEE") return false;
    if (!Digit.UserService?.getUser()?.access_token) return false;
    return true;
  };

  const { data: EventsData, isLoading: EventsDataLoading } = Digit.Hooks.useEvents({
    tenantId,
    variant: "whats-new",
    config: {
      enabled: conditionsToDisableNotificationCountTrigger(),
    },
  });

  if (!tenantId) {
    Digit.SessionStorage.get("locale") === null
      ? history.push(`/upyog-ui/citizen/select-language`)
      : history.push(`/upyog-ui/citizen/select-location`);
  }

  const appBannerWebObj = uiHomePage?.appBannerDesktop;
  const appBannerMobObj = uiHomePage?.appBannerMobile;
  const citizenServicesObj = uiHomePage?.citizenServicesCard;
  const infoAndUpdatesObj = uiHomePage?.informationAndUpdatesCard;
  const whatsAppBannerWebObj = uiHomePage?.whatsAppBannerDesktop;
  const whatsAppBannerMobObj = uiHomePage?.whatsAppBannerMobile;
  const whatsNewSectionObj = uiHomePage?.whatsNewSection;

  const handleClickOnWhatsAppBanner = (obj) => {
    window.open(obj?.navigationUrl);
  };
  /* set citizen details to enable backward compatiable */
  const setCitizenDetail = (userObject, token, tenantId) => {
    let locale = JSON.parse(sessionStorage.getItem("Digit.initData"))?.value?.selectedLanguage;
    localStorage.setItem("Citizen.tenant-id", tenantId);
    localStorage.setItem("tenant-id", tenantId);
    localStorage.setItem("citizen.userRequestObject", JSON.stringify(userObject));
    localStorage.setItem("locale", locale);
    localStorage.setItem("Citizen.locale", locale);
    localStorage.setItem("token", token);
    localStorage.setItem("Citizen.token", token);
    localStorage.setItem("user-info", JSON.stringify(userObject));
    localStorage.setItem("Citizen.user-info", JSON.stringify(userObject));
  };

  const DocumentIcon = () => (
    <svg width="100" height="100" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 0H2C0.9 0 0 0.9 0 2V16C0 17.1 0.9 18 2 18H16C17.1 18 18 17.1 18 16V2C18 0.9 17.1 0 16 0ZM11 14H4V12H11V14ZM14 10H4V8H14V10ZM14 6H4V4H14V6Z"
        fill="#FE7A51"
      />
    </svg>
  );

  useEffect(async () => {
    //sessionStorage.setItem("DigiLocker.token1","cf87055822e4aa49b0ba74778518dc400a0277e5")
    if (window.location.href.includes("code")) {
      let code = window.location.href.split("=")[1].split("&")[0]
      let TokenReq = {
        dlReqRef: localStorage.getItem('code_verfier_register'),
        code: code, module: "SSO"

      }
      const { ResponseInfo, UserRequest: info, ...tokens } = await Digit.DigiLockerService.token({ TokenReq })
      setUser({ info, ...tokens });
      setCitizenDetail(info, tokens?.access_token, info?.tenantId)
    }
  }, [])
  useEffect(() => {
    if (!user) {
      return;
    }
    Digit.SessionStorage.set("citizen.userRequestObject", user);
    Digit.UserService.setUser(user);
    setCitizenDetail(user?.info, user?.access_token, "pg");
    const redirectPath = location.state?.from || DEFAULT_REDIRECT_URL;
    if (!Digit.ULBService.getCitizenCurrentTenant(true)) {
      history.replace("/upyog-ui/citizen/select-location", {
        redirectBackTo: redirectPath,
      });
    } else {
      history.replace(redirectPath);
    }
  }, [user]);
  console.log("citizenServicesObjcitizenServicesObj", citizenServicesObj)

  const cardsList = [
    {
      "code": "CITIZEN_SERVICE_PGR",
      "name": "New eDCR Scrutiny",
      "label": "ES_PGR_HEADER_COMPLAINT",
      "enabled": true,
      "navigationUrl": "/upyog-ui/citizen/obps/edcrscrutiny/apply/home"
    },
    {
      "code": "CITIZEN_SERVICE_WS",
      "name": "eDCR Inbox",
      "label": "ACTION_TEST_WATER_AND_SEWERAGE",
      "enabled": true,
      "navigationUrl": "/upyog-ui/citizen/obps/home"
    },
    {
      "code": "CITIZEN_SERVICE_PT",
      "name": "Apply for Building Permit",
      "label": "MODULE_PT",
      "enabled": true,
      "navigationUrl": "/upyog-ui/citizen/obps/bpa/building_plan_scrutiny/new_construction/docs-required"
    },
    {
      "code": "CITIZEN_SERVICE_TL",
      "name": "View Building Permit Applications",
      "label": "MODULE_TL",
      "enabled": true,
      "navigationUrl": "/upyog-ui/citizen/obps/my-applications"
    },
    {
      "code": "CITIZEN_SERVICE_CHB",
      "name": "Register as a Stakeholder",
      "label": "ACTION_TEST_CHB",
      "enabled": true,
      "navigationUrl": "/upyog-ui/citizen/obps/stakeholder/apply/stakeholder-docs-required"
    },
    {
      "code": "CITIZEN_SERVICE_PGR",
      "name": "New OC Plan Scrutiny",
      "label": "ES_PGR_HEADER_COMPLAINT",
      "enabled": true,
      "navigationUrl": "/upyog-ui/citizen/obps/edcrscrutiny/oc-apply/docs-required"
    },
    {
      "code": "CITIZEN_SERVICE_WS",
      "name": "Apply for Occupancy Certificate",
      "label": "ACTION_TEST_WATER_AND_SEWERAGE",
      "enabled": true,
      "navigationUrl": "/upyog-ui/citizen/obps/ocbpa/building_oc_plan_scrutiny/new_construction/docs_required"
    },
    {
      "code": "CITIZEN_SERVICE_WS",
      "name": "View Occupancy Certificate Applications",
      "label": "ACTION_TEST_WATER_AND_SEWERAGE",
      "enabled": true,
      "navigationUrl": "/upyog-ui/citizen/obps/my-applications"
    },
    {
      "code": "CITIZEN_SERVICE_WS",
      "name": "Apply for Pre-approved Plan",
      "label": "ACTION_TEST_WATER_AND_SEWERAGE",
      "enabled": true,
      "navigationUrl": "/upyog-ui/citizen/obps/preApprovedPlan/documents-required"
    },
    {
      "code": "CITIZEN_SERVICE_WS",
      "name": "View Pre-approved Plan Applications",
      "label": "ACTION_TEST_WATER_AND_SEWERAGE",
      "enabled": true,
      "navigationUrl": "/upyog-ui/citizen/obps/my-applications"
    },
    {
      "code": "CITIZEN_SERVICE_WS",
      "name": "Land and Building Regularization",
      "label": "ACTION_TEST_WATER_AND_SEWERAGE",
      "enabled": true,
      "navigationUrl": "/upyog-ui/citizen/all-services"
    },
    {
      "code": "CITIZEN_SERVICE_WS",
      "name": "Revalidation of Permission",
      "label": "ACTION_TEST_WATER_AND_SEWERAGE",
      "enabled": true,
      "navigationUrl": "/upyog-ui/citizen/all-services"
    },
  ]

  const EDCRIcon = ({ className }) => (
    <svg width="30" height="32" viewBox="0 0 30 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 15.3333V5.33333L15 0.333334L10 5.33333V8.66667H0V32H30V15.3333H20ZM6.66667 28.6667H3.33333V25.3333H6.66667V28.6667ZM6.66667 22H3.33333V18.6667H6.66667V22ZM6.66667 15.3333H3.33333V12H6.66667V15.3333ZM16.6667 28.6667H13.3333V25.3333H16.6667V28.6667ZM16.6667 22H13.3333V18.6667H16.6667V22ZM16.6667 15.3333H13.3333V12H16.6667V15.3333ZM16.6667 8.66667H13.3333V5.33333H16.6667V8.66667ZM26.6667 28.6667H23.3333V25.3333H26.6667V28.6667ZM26.6667 22H23.3333V18.6667H26.6667V22Z"
        fill="#FE7A51"
      />
    </svg>
  );

  const BillsIcon = ({ styles, className }) => (
    <svg width="24" height="27" className={className} style={{ ...styles }} viewBox="0 0 24 27" fill="#D40000" xmlns="http://www.w3.org/2000/svg">
      <path d="M21.3333 2.99967H15.76C15.2 1.45301 13.7333 0.333008 12 0.333008C10.2667 0.333008 8.8 1.45301 8.24 2.99967H2.66667C1.2 2.99967 0 4.19967 0 5.66634V24.333C0 25.7997 1.2 26.9997 2.66667 26.9997H21.3333C22.8 26.9997 24 25.7997 24 24.333V5.66634C24 4.19967 22.8 2.99967 21.3333 2.99967ZM12 2.99967C12.7333 2.99967 13.3333 3.59967 13.3333 4.33301C13.3333 5.06634 12.7333 5.66634 12 5.66634C11.2667 5.66634 10.6667 5.06634 10.6667 4.33301C10.6667 3.59967 11.2667 2.99967 12 2.99967ZM14.6667 21.6663H5.33333V18.9997H14.6667V21.6663ZM18.6667 16.333H5.33333V13.6663H18.6667V16.333ZM18.6667 10.9997H5.33333V8.33301H18.6667V10.9997Z" />
    </svg>
  );

  const RegisterIcon = ({styles, className}) => (
    <svg class="jss200 jss201 module-page-icon" focusable="false" viewBox="0 0 24 24" aria-hidden="true"><g xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" fill="#FE7A51"><path d="M9 17l3-2.94c-.39-.04-.68-.06-1-.06-2.67 0-8 1.34-8 4v2h9l-3-3zm2-5c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4"></path><path d="M15.47 20.5L12 17l1.4-1.41 2.07 2.08 5.13-5.17 1.4 1.41z"></path></g> </svg>
  )

  const PersonIcon = ({ className, styles }) => (
    <svg className={className} style={{ ...styles }} width="24" height="24" viewBox="0 0 38 24" fill="#ffffff" xmlns="http://www.w3.org/2000/svg">
      <path d="M25.6667 10.3333C28.4334 10.3333 30.65 8.1 30.65 5.33333C30.65 2.56666 28.4334 0.333328 25.6667 0.333328C22.9 0.333328 20.6667 2.56666 20.6667 5.33333C20.6667 8.1 22.9 10.3333 25.6667 10.3333ZM12.3334 10.3333C15.1 10.3333 17.3167 8.1 17.3167 5.33333C17.3167 2.56666 15.1 0.333328 12.3334 0.333328C9.56669 0.333328 7.33335 2.56666 7.33335 5.33333C7.33335 8.1 9.56669 10.3333 12.3334 10.3333ZM12.3334 13.6667C8.45002 13.6667 0.666687 15.6167 0.666687 19.5V23.6667H24V19.5C24 15.6167 16.2167 13.6667 12.3334 13.6667ZM25.6667 13.6667C25.1834 13.6667 24.6334 13.7 24.05 13.75C25.9834 15.15 27.3334 17.0333 27.3334 19.5V23.6667H37.3334V19.5C37.3334 15.6167 29.55 13.6667 25.6667 13.6667Z" />
    </svg>
  );

  const Calender = ({ className, onClick }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="black" className={className} style={{ width: "35px", height: "35px" }} onClick={onClick}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"
        fill="#FE7A51" />
    </svg>
  );

  const allCitizenServicesProps = {
    header: t(citizenServicesObj?.headerLabel),
    sideOption: {
      name: t(citizenServicesObj?.sideOption?.name),
      onClick: () => history.push(citizenServicesObj?.sideOption?.navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
    },
    type: "CitizenServices",
    options: [
      {
        name: t(cardsList[0].name),
        Icon: <EDCRIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(cardsList[0].navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(cardsList[1].name),
        Icon: <PersonIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(cardsList[1].navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(cardsList[2].name),
        Icon: <OBPSIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(cardsList[2].navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(cardsList[3].name),
        Icon: <BillsIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(cardsList[3].navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(cardsList[4].name),
        Icon: <RegisterIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(cardsList[4].navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(cardsList[5].name),
        Icon: <EDCRIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(cardsList[5].navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(cardsList[6].name),
        Icon: <OBPSIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(cardsList[6].navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(cardsList[7].name),
        Icon: <BillsIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(cardsList[7].navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(cardsList[8].name),
        Icon: <OBPSIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(cardsList[8].navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(cardsList[9].name),
        Icon: <BillsIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(cardsList[9].navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(cardsList[10].name),
        Icon: <EDCRIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(cardsList[10].navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(cardsList[11].name),
        Icon: <OBPSIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(cardsList[11].navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
    ],
    styles: { display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" },
  };
  const allInfoAndUpdatesProps = {
    header: t(infoAndUpdatesObj?.headerLabel),
    sideOption: {
      name: t(infoAndUpdatesObj?.sideOption?.name),
      onClick: () => history.push(infoAndUpdatesObj?.sideOption?.navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
    },
    type: "Information&Updates",
    options: [
      {
        name: t(infoAndUpdatesObj?.props?.[0]?.label),
        Icon: <HomeIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(infoAndUpdatesObj?.props?.[0]?.navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(infoAndUpdatesObj?.props?.[1]?.label),
        Icon: <Calender styles={{ fill: "#FE7A51", width: "35px", height: "35px" }} />,
        onClick: () => history.push(infoAndUpdatesObj?.props?.[1]?.navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(infoAndUpdatesObj?.props?.[2]?.label),
        Icon: <DocumentIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }}/>,
        onClick: () => history.push(infoAndUpdatesObj?.props?.[2]?.navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      {
        name: t(infoAndUpdatesObj?.props?.[3]?.label),
        Icon: <DocumentIcon styles={{ fill: "#FE7A51", width: "35px", height: "35px" }}/>,
        onClick: () => history.push(infoAndUpdatesObj?.props?.[3]?.navigationUrl.replace("/digit-ui/", "/upyog-ui/")),
      },
      // {
      //     name: t("CS_COMMON_HELP"),
      //     Icon: <HelpIcon/>
      // }
    ],
    styles: { display: "flex", flexWrap: "wrap", justifyContent: "flex-start", width: "100%" },
  };
  sessionStorage.removeItem("type");
  sessionStorage.removeItem("pincode");
  sessionStorage.removeItem("tenantId");
  sessionStorage.removeItem("localityCode");
  sessionStorage.removeItem("landmark");
  sessionStorage.removeItem("propertyid");

  sessionStorage.setItem("isPermitApplication", true);
  sessionStorage.setItem("isEDCRDisable", JSON.stringify(false));

  return isLoading ? (
    <Loader />
  ) : (
    <React.Fragment>
      <style>{
        `.infoHome {
          height: 100px !important;
        }
        .citizenAllServiceGrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(22%, 1fr)); /* up to 4 per row */
          gap: 16px; /* spacing between cards */
        }
        
        @media (max-width: 768px) {
          .citizenAllServiceGrid {
            grid-template-columns: repeat(2, 1fr); /* 2 per row on smaller screens */
          }
        }
        
        @media (max-width: 480px) {
          .citizenAllServiceGrid {
            grid-template-columns: repeat(1, 1fr); /* 1 per row on mobile */
          }
        }
        
        .CardBasedOptions .mainContent .CardBasedOptionsMainChildOption {
          width: 100% !important;
          text-align: center;
          margin: auto;
          padding: 7px
      }
      .CardBasedOptions .mainContent .CardBasedOptionsMainChildOption .ChildOptionImageWrapper {
          height: 4rem !important;
          width: 4rem !important;
      } 
      .CardBasedOptions .mainContent .CardBasedOptionsMainChildOption .ChildOptionImageWrapper svg {
        height: 35px !important;
        width: 35px !important;
      }
      .HomePageWrapper .BannerWithSearch {
        margin-bottom: 24px;
      }
          `
      }</style>
      <div className="HomePageContainer" style={{ width: "100%" }}>
        {/* <div className="SideBarStatic">
        <StaticCitizenSideBar />
      </div> */}
        <div className="HomePageWrapper" style={{ marginTop: "0px" }}>
          {<div className="BannerWithSearch">
            {/* {isMobile ? <img src={"https://niuatt-filestore.s3.ap-south-1.amazonaws.com/pg/logo/Banner+UPYOG.jpg"} /> : <img src={"https://niuatt-filestore.s3.ap-south-1.amazonaws.com/pg/logo/Banner+UPYOG.jpg"} />} */}
            {/* <div className="Search">
            <StandaloneSearchBar placeholder={t("CS_COMMON_SEARCH_PLACEHOLDER")} />
          </div> */}
            <div className="ServicesSection" style={{paddingTop: "25px"}}>
            <strong><h3 style={{ color: "#000000", fontSize: "20px", paddingBottom: "12px", marginLeft: "7px", marginBottom: "4px" }}>Citizen Services</h3></strong>
            <CardBasedOptions style={{ marginTop: "0px", width: "calc(100% - 16px", minHeight: "330px", boxShadow: "0 0 8px rgba(0, 0, 0, 0.15)", borderRadius: "10px" }} {...allCitizenServicesProps} />
              <strong><h3 style={{ color: "#000000", fontSize: "20px", paddingBottom: "12px", marginLeft: "7px" }}>Information and Updates</h3></strong>
              <CardBasedOptions style={isMobile ? { marginTop: "0px", width: "calc(100% - 16px" } : { marginTop: "0px", width: "calc(100% - 16px", maxHeight: "150px", boxShadow: "0 0 8px rgba(0, 0, 0, 0.15)", borderRadius: "10px" }} {...allInfoAndUpdatesProps} />
            </div>
          </div>}


          {/* {(whatsAppBannerMobObj || whatsAppBannerWebObj) && (
            <div className="WhatsAppBanner">
              {isMobile ? (
                <img src={"https://nugp-assets.s3.ap-south-1.amazonaws.com/nugp+asset/Banner+UPYOG+%281920x500%29B+%282%29.jpg"} onClick={() => handleClickOnWhatsAppBanner(whatsAppBannerMobObj)} style={{ "width": "100%" }} />
              ) : (
                <img src={"https://nugp-assets.s3.ap-south-1.amazonaws.com/nugp+asset/Banner+UPYOG+%281920x500%29B+%282%29.jpg"} onClick={() => handleClickOnWhatsAppBanner(whatsAppBannerWebObj)} style={{ "width": "100%" }} />
              )}
            </div>
          )} */}

          {conditionsToDisableNotificationCountTrigger() ? (
            EventsDataLoading ? (
              <Loader />
            ) : (
              <div className="WhatsNewSection">
                <div className="headSection">
                <strong><h3 style={{ color: "#000000", fontSize: "20px", marginLeft: "7px", marginBottom: "4px" }}>{t(whatsNewSectionObj?.headerLabel)}</h3></strong>
                  <p onClick={() => history.push(whatsNewSectionObj?.sideOption?.navigationUrl)}>{t(whatsNewSectionObj?.sideOption?.name)}</p>
                </div>
                <WhatsNewCard {...EventsData?.[0]} />
              </div>
            )
          ) : null}
          <ChatBot />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Home;
