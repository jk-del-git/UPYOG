import React, { Component } from "react";
import { connect } from "react-redux";
// import Banner from "egov-ui-kit/common/common/Banner";
// import LanguageSelectionForm from "egov-ui-kit/common/User/components/LanguageSelectionForm";
import { fetchLocalizationLabel } from "egov-ui-kit/redux/app/actions";
import { getLocale } from "egov-ui-kit/utils/localStorageUtils";
import get from "lodash/get";
import Loadable from "react-loadable";

const Loading = () => <h1>...loading</h1>;


const Banner = Loadable({
  loader: () =>
    import("egov-ui-kit/common/common/Banner"),
  loading: Loading,
});


const LanguageSelectionForm = Loadable({
  loader: () =>
    import("egov-ui-kit/common/User/components/LanguageSelectionForm"),
  loading: Loading,
});

class LanguageSelection extends Component {
  state = {
    value: getLocale(),
  };

  onClick = (value) => {
    this.setState({ value });
    this.props.fetchLocalizationLabel(value);
  };

  onLanguageSelect = () => {
    this.props.history.push("/user/login");
  };

  render() {
    const { value } = this.state;
    const { onLanguageSelect, onClick } = this;
    const { bannerUrl, logoUrl, languages } = this.props;
    // let allImages = [banner3, banner4, banner1, banner2];
    return (
      <Banner className="language-selection" bannerUrl={bannerUrl} logoUrl={logoUrl}>
        <LanguageSelectionForm logoUrl={logoUrl} items={languages} value={value} onLanguageSelect={onLanguageSelect} onClick={onClick} />
      </Banner>
    );
  }
}

const mapStateToProps = ({ common }) => {
  const { stateInfoById } = common;
  let bannerUrl = get(stateInfoById, "0.bannerUrl");
  let logoUrl = get(stateInfoById, "0.logoUrl");
  let languages = get(stateInfoById, "0.languages", []);
  return { bannerUrl, logoUrl, languages };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLocalizationLabel: (locale) => dispatch(fetchLocalizationLabel(locale)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguageSelection);
