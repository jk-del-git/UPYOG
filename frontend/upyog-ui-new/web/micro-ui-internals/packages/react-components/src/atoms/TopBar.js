import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Hamburger from "./Hamburger";
import { NotificationBell } from "./svgindex";
import { useLocation } from "react-router-dom";
import BackButton from "./BackButton";

const TopBar = ({
  img,
  isMobile,
  logoUrl,
  onLogout,
  toggleSidebar,
  ulb,
  userDetails,
  notificationCount,
  notificationCountLoaded,
  cityOfCitizenShownBesideLogo,
  onNotificationIconClick,
  hideNotificationIconOnSomeUrlsWhenNotLoggedIn,
  changeLanguage,
}) => {
  const { pathname } = useLocation();

  // const showHaburgerorBackButton = () => {
  //   if (pathname === "/upyog-ui/citizen" || pathname === "/upyog-ui/citizen/" || pathname === "/upyog-ui/citizen/select-language") {
  //     return <Hamburger handleClick={toggleSidebar} />;
  //   } else {
  //     return <BackButton className="top-back-btn" />;
  //   }
  // };
  return (
    <React.Fragment>
      <style>{`
    .navbar {
      background: #FFFFFF !important;
      padding: 10px !important;
    }
  `}
      </style>
      <div className="navbar" style={{ background: "#FFFFFF", boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.2)" }}>
        <div className="center-container back-wrapper" style={{ display: "flex", marginRight: "1rem", marginLeft: "0rem", justifyContent: "space-between" }}>
          <div className="hambuger-back-wrapper" style={{ display: "flex", alignItems: "center" }}>
            {window.innerWidth <= 660 && <Hamburger handleClick={toggleSidebar} />}
            <a href={window.location.href.includes("citizen") ? "/upyog-ui/citizen" : "/upyog-ui/employee"}><img
              className="city"
              id="topbar-logo"
              src={"https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"}
              alt="UPYOG"
              style={{ minWidth: "54px", height: "59px", marginLeft: "10px" }}
            />
            </a>
            <strong>
              <h3 style={{ fontSize: "20px" }}>
                <span style={{ color: "#0C3A60" }}>
                  Housing and Urban Development Deparment
                </span>
                <br />
                <p style={{ color: "#000000", fontSize: "14px" }}>
                  Government of Jammu & Kashmir
                </p>
              </h3>
            </strong>
          </div>

          <div className="RightMostTopBarOptions" style={{ alignItems: "center" }}>
            {!hideNotificationIconOnSomeUrlsWhenNotLoggedIn ? changeLanguage : null}
            {!hideNotificationIconOnSomeUrlsWhenNotLoggedIn ? (
              <div className="EventNotificationWrapper" onClick={onNotificationIconClick}>
                {notificationCountLoaded && notificationCount ? (
                  <span>
                    <p>{notificationCount}</p>
                  </span>
                ) : null}
                <NotificationBell />
              </div>
            ) : null}
            {/* <h3></h3> */}
            {/* <img
              className="city"
              id="topbar-logo"
              src={"https://upload.wikimedia.org/wikipedia/commons/3/36/Emblem_of_Haryana.svg"}
              alt="mSeva"
              style={{ minWidth: "47px", height: "47px" }}
            /> */}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

TopBar.propTypes = {
  img: PropTypes.string,
};

TopBar.defaultProps = {
  img: undefined,
};

export default TopBar;
