import React from "react";
import { useTranslation } from "react-i18next";
import { Loader } from "@upyog/digit-ui-react-components"

const Header = () => {
  const { data: storeData, isLoading } = Digit.Hooks.useStore.getInitData();
  const { stateInfo } = storeData || {};
  const { t } = useTranslation()

  if (isLoading) return <Loader />;

  return (
    <div className="bannerHeader" style={{ paddingBottom: "10px", borderBottom: "1px solid #192771" }}>
      <img src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg" style={{ width: "47px", height: "47px" }} />
      <h3 style={{ fontSize: "20px", marginLeft: "10px" }}>
        <strong style={{ color: "#0C3A60" }}>
          Housing and Urban Development Deparment
        </strong>
        <br />
        <p style={{ color: "#000000", fontSize: "14px" }}>
          Government of Jammu & Kashmir
        </p>
      </h3>
    </div>
  );
}

export default Header;