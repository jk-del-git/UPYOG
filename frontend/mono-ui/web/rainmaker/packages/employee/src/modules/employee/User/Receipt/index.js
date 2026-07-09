import React, { Component } from "react";
import { connect } from "react-redux";
import { Screen } from "modules/common";
import formHoc from "egov-ui-kit/hocs/form";
import PaymentReceipts from "./components/PaymentReceipts";
import { httpRequest } from "egov-ui-framework/ui-utils/api";
import formConfig from "../../../../config/forms/specs/paymentReceipt";
import "./index.css";

const ReceiptFormHOC = formHoc({formKey:"paymentReceipt"})(PaymentReceipts)

const ReceiptContainer = ({ tenantId }) => {
  // let allImages = [banner1, banner2, banner3, banner4];
  return (
    
      <ReceiptFormHOC tenantId={tenantId}  />
  );
};

const mapStateToProps = (state) => {
  return {
    tenantId: state.auth.tenantId,
  };;
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReceiptContainer);
