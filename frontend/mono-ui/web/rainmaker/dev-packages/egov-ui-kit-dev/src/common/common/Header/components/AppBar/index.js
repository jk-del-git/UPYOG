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
        style={{backgroundImage:"unset",color:"#FFFFFF"}}
        // className={isHomeScreen && role === "citizen" ? "home-screen-appbar" : className || "header-with-drawer"}
        className={window.innerWidth > 700 ? className : "header-with-drawer"}
        title={
          <div className="citizen-header-logo-label">
            <div id="emblem-lg" className="citizen-header-logo" style={{width: "44px", height: "47px" }}>
              <img style={{ width: "45px", height: "45px", transform: "translateY(-2px)" }} alt="Emblem of India" src={`${process.env.PUBLIC_URL}/emblem_of_India.webp`}/>
            </div>
            {titleAddon && (
              <Label
                containerStyle={{ display: "inline-block", marginLeft: 5 }}
                className="screenHeaderLabelStyle appbar-title-label"
                label={titleAddon}
              />
            )}
            {isUserSetting && <div className="rainmaker-displayInline">
              <h3 className="header-h3">
                <strong >Housing and Urban Development Department</strong>
                <br /><p style={{ fontSize: "14px", marginTop: "4px", color:"#000000" }}>Government of Jammu & Kashmir</p>
              </h3>
            </div>}
            <div className="finance-title">
            <Label 
            containerStyle={{display:"flex", justifyContent:"center", 
              alignItems:"center",marginBottom  : "0rem"}} 
            labelStyle={{color:"rgb(12, 58, 96)",fontWeight:"800",
              }} 
              fontSize={18}
            label={"CORE_COMMON_FINANCE_HEADER"} />
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
