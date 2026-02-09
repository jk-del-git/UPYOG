import React from "react";
import { AppBar, Icon } from "components";
import Label from "egov-ui-kit/utils/translationNode";
import UserSettings from "../UserSettings";
import Toolbar from "material-ui/Toolbar";
import Badge from "@material-ui/core/Badge";
import digitLogo from "egov-ui-kit/assets/images/Digit_logo.png";
import pbLogo from "egov-ui-kit/assets/images/pblogo.png";
import IconButton from "material-ui/IconButton";
import { onNotificationClick } from "egov-ui-kit/utils/commons";
import "./index.css";
import { connect } from "react-redux";
import get from "lodash/get";
import { LabelContainer } from "egov-ui-framework/ui-containers";

const styles = {
  titleStyle: { fontSize: "20px", fontWeight: 500, marginLeft: "-17px" },
};

const iconButtonStyle = {
  paddingLeft: 0,
  paddingRight: 0,
  width: 35,
};

// handle listners
const EgovAppBar = ({
  className,
  ulbName,
  defaultTitle,
  ulbLogo,
  title,
  titleAddon,
  isHomeScreen,
  role,
  fetchLocalizationLabel,
  userInfo = {},
  onToolBarIconClick,
  refreshButton,
  sortButton,
  searchButton,
  helpButton,
  notificationButton,
  sortDialogOpen,
  history,
  handleItemClick,
  hasLocalisation,
  notificationsCount,
  isUserSetting,
  logoImage,
  ...rest
}) => {
  return (
    <div>
      <AppBar
        // className={isHomeScreen && role === "citizen" ? "home-screen-appbar" : className || "header-with-drawer"}
        className={className || "header-with-drawer"}
        title={
          <div className="citizen-header-logo-label">
            <div className="citizen-header-logo" style={{ width: "44px", height: "47px" }}>
              {<img style={{ width: "45px", height: "45px", transform: "translateY(-2px)" }} src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" />}
            </div>
            <LabelContainer style={{ marginLeft: "12px", color: "#FFFFFF", fontWeight: 700, fontSize: "16px" }} className="screenHeaderLabelStyle appbar-title-label" labelKey={title}/>
            {titleAddon && (
              <Label
                containerStyle={{ display: "inline-block", marginLeft: 5 }}
                className="screenHeaderLabelStyle appbar-title-label"
                label={titleAddon}
              />
            )}
            {isUserSetting && <div className="rainmaker-displayInline">
              <h3 className="header-h3" style={{ transform: "translate(12px, -12px)" }}>
                <strong style={{fontSize: "20px", color: "#0C3A60"}}>Housing and Urban Development Department</strong>
                {/* <img src={homePageLogo} style={{ height: "30px", marginTop: "2px", marginBottom: "5px" }} /> */}
                <br /><p style={{ fontSize: "14px", marginTop: "4px", color:"#000000" }}>Government of Jammu & Kashmir</p>
              </h3>
              {/* <Label
                containerStyle={{ marginLeft: "10px" }}
                className="screenHeaderLabelStyle appbar-municipal-label"
                label={ulbName && `TENANT_TENANTS_${ulbName.toUpperCase().replace(/[.]/g, "_")}`}
              /> */}
              {/* <Label containerStyle={{ marginLeft: "4px" }} className="screenHeaderLabelStyle appbar-municipal-label" label={defaultTitle} /> */}
            </div>}
            <div className="finance-title">
            <h5>Financial Accounting System</h5>
            </div>
          </div>
        }
        titleStyle={styles.titleStyle}
        {...rest}
      >
        <Toolbar className="app-toolbar" style={{ padding: "0px", height: "64px", background: "#ffffff" }}>
          <UserSettings
            hasLocalisation={hasLocalisation}
            fetchLocalizationLabel={fetchLocalizationLabel}
            onIconClick={onToolBarIconClick}
            userInfo={userInfo}
            handleItemClick={handleItemClick}
            isUserSetting={isUserSetting}
          />
        </Toolbar>
        {notificationButton && role === "citizen" && (
          <div className="notification-icon-web notification-icon" onClick={(e) => onNotificationClick(history)}>
            {notificationsCount ? (
              <IconButton aria-label="4 pending messages">
                <Badge badgeContent={notificationsCount} color="primary">
                  <Icon action="social" name="notifications-none" color="#000000" fill="#000000" />
                </Badge>
              </IconButton>
            ) : (
              <Icon action="social" name="notifications-none" color="#000000" fill="#000000" />
            )}
          </div>
        )}

        {/* <div className="appbar-right-logo">
          <img src={logoImage?logoImage:digitLogo} />
        </div> */}
        <div className="icon-button">
          {refreshButton && (
            <IconButton style={iconButtonStyle} onClick={(e) => location.reload()}>
              <Icon action="navigation" name="refresh" color="#fff" />
            </IconButton>
          )}
          {sortButton && (
            <IconButton style={iconButtonStyle} onClick={sortDialogOpen}>
              <Icon action="action" name="swap-vert" color="#fff" />
            </IconButton>
          )}
          {searchButton && role === "ao" && (
            <IconButton style={iconButtonStyle} onClick={(e) => onSearchClick(history)}>
              <Icon action="action" name="search" color="#fff" />
            </IconButton>
          )}
          {helpButton && role === "citizen" && (
            <IconButton style={iconButtonStyle}>
              <Icon action="action" name="help" color="#fff" />
            </IconButton>
          )}
        </div>
        {notificationButton && role === "citizen" && (
          <div className="notification-icon-mobile notification-icon" onClick={(e) => onNotificationClick(history)}>
            {notificationsCount ? (
              <IconButton aria-label="4 pending messages">
                <Badge badgeContent={notificationsCount} color="primary">
                  <Icon action="social" name="notifications-none" color="#fff" />
                </Badge>
              </IconButton>
            ) : (
              <Icon action="social" name="notifications-none" color="#fff" />
            )}
          </div>
        )}
      </AppBar>
    </div>
  );
};

const onSearchClick = (history) => {
  history.push("search-complaint");
};

const mapStateToProps = ({ common }) => {
  const { stateInfoById } = common;
  let logoImage = get(stateInfoById, "0.logoUrl");
  return {  logoImage };
};

export default connect(
  mapStateToProps,
  null
)(EgovAppBar);
