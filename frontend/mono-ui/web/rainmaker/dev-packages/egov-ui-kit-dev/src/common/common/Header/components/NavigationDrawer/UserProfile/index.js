import React, {useEffect,useState} from "react";
import { ProfileSection } from "components";
import { getCityNameByCode } from "egov-ui-kit/utils/commons";
import { connect } from "react-redux";
import get from "lodash/get";
import emptyFace from "egov-ui-kit/assets/images/download.png";

const styles = {
  imageStyle: { width: 89, height: 88, margin: "0 auto", marginBottom: "16px" },
  cardStyles: {
    height: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "0 auto",
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: "#e0e0e0",
  },
  nameStyle: {
    paddingTop: 10,
    fontFamily: "Roboto",
    fontSize: 7,
    fontWeight: 900,
    fontStyle: "normal",
    fontStretch: "normal",
    lineHeight: "normal",
    letterSpacing: 0.3,
    color: "#484848",
    padding: 0,
    textTransform: "none",
  },
  iconStyle: {
    height: "18px",
    width: "18px",
    paddingTop: 12,
  },

  locationStyle: {
    fontSize: 7,
    fontWeight: 500,
  },
};

const prepareUserInfo = (userInfo = {}, cities = [],localizationLabels) => {
  const { photo, name, emailId, permanentCity, tenantId } = userInfo;
  const location = getCityNameByCode(permanentCity, localizationLabels) || getCityNameByCode(tenantId, localizationLabels);
  return { photo, name, emailId, location };
};


// check below one
const UserProfile = ({ role = "citizen", cities = [], userInfo={}, reduxUserInfo ,localizationLabels}) => {
   const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
    // useEffect(() => {
    //   const fetchPhoto = async () => {
    //     try {
    //       const tenantId = reduxUserInfo.tenantId;
    //       const uuid = reduxUserInfo.uuid;
    //       if (!uuid || !tenantId) return;
  
    //       const userPayload = await httpRequest(
    //         "post",
    //         "/user/_search",
    //         "_search",
    //         [],
    //         {
    //           tenantId,
    //           uuid: [uuid],
    //         }
    //       );      
  
    //       const photoId = userPayload.user[0].photo;
    //       if (!photoId) return;
  
    //       const fileResponse = await httpRequest(
    //         "get",
    //         "/filestore/v1/files/url",
    //         "",
    //         [
    //           { key: "tenantId", value: "pg" },
    //           { key: "fileStoreIds", value: photoId },
    //         ]
    //       );
  
    //       const url = fileResponse.fileStoreIds[0].url;
    //       if (url) {
    //         setProfilePhotoUrl(url);
    //       }
    //     } catch (error) {
    //       console.error("Error fetching user photo:", error);
    //     }
    //   };
  
    //   fetchPhoto();
    // }, []);
  userInfo = prepareUserInfo(userInfo, cities,localizationLabels);
  return (
    <ProfileSection
      imgStyle={styles.imageStyle}
      cardStyles={styles.cardStyles}
      nameStyle={styles.nameStyle}
      locationStyle={styles.locationStyle}
      emailIdStyle={styles.nameStyle}
      name={userInfo.name || ""}
      emailId={role === "citizen" ? userInfo.emailId || "" : ""}
      location={userInfo.location || ""}
      iconStyle={styles.iconStyle}
      imgSrc={profilePhotoUrl || emptyFace}
    />
  );
};

// export default UserProfile;

const mapStateToProps = (state) => {
  const localizationLabels = get(state.app, "localizationLabels", {});
  const reduxUserInfo = get(state.auth, "userInfo", {});
  return {  localizationLabels, reduxUserInfo };
};

export default connect(mapStateToProps)(UserProfile);