import React from "react";
import { withRouter } from "react-router";
import { Icon, Image } from "components";
import logo from "egov-ui-kit/assets/images/punjab-logo.png";
import "./index.css";

const SLIDE_DURATION = 5000; // 3 seconds
class Banner extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentIndex: 0,
      animate: false
    };

    this.interval = null;
  }

  componentDidMount() {
    const { bannerUrl } = this.props;

    if (Array.isArray(bannerUrl) && bannerUrl.length > 1) {
      this.interval = setInterval(() => {
        this.setState({ animate: true }, () => {
          setTimeout(() => {
            this.setState(prevState => ({
              currentIndex:
                prevState.currentIndex === bannerUrl.length - 1
                  ? 0
                  : prevState.currentIndex + 1,
              animate: false
            }));
          }, 300); // animation duration
        });
      }, SLIDE_DURATION);

    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  getActiveBannerUrl = () => {
    const { bannerUrl } = this.props;
    const { currentIndex } = this.state;

    if (Array.isArray(bannerUrl)) {
      return bannerUrl[currentIndex];
    }
    return bannerUrl;
  };

  render() {
    const {
      children,
      hideBackButton,
      history,
      className = ""
    } = this.props;

    const activeBannerUrl = this.getActiveBannerUrl();

    return (
      <div>
        <div className={`${className} user-screens-wrapper`}>
          <div
            className={`banner-image ${this.state.animate ? "banner-fade-animate" : ""}`}
            style={
              activeBannerUrl && {
                // backgroundImage: `url(${activeBannerUrl})`,
                backgroundImage: `url("https://s7ap1.scene7.com/is/image/incredibleindia/dal-lake-srinagar-jammu-&-kashmir-2-attr-hero?qlt=82&ts=1726816668703")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                position: "relative",
                // background:"linear-gradient(to left, #155cd1 105%,#05ae70 )"
              }
            }
          >
            <div className="banner-overlay" />
            <div className="banner-main-content">
              {!hideBackButton && (
                <Icon
                  onClick={() => history.goBack()}
                  className="banner-back-button"
                  action="navigation"
                  name="arrow-back"
                />
              )}

              <div className="banner-form-cont">{children}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Banner);
