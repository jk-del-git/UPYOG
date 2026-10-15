import React from "react";
import PropTypes from "prop-types";
import TextField from "../TextField";
import { getLocaleLabels } from "egov-ui-framework/ui-utils/commons";
import PersonIcon from "material-ui/svg-icons/social/person";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const containerStyle = {
  position: "relative",
  width: "100%",
};

const inputStyleBase = {
  width: "100%",
  height: "51px",
  padding: "12px 45px 12px 15px",
  border: "1px solid #b3b3b3",
  borderRadius: "5px",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "all 0.2s ease",
  backgroundColor: "#fff",
  color: "#1B1B1B",
  letterSpacing: "0.7px",
};

const inputFocusStyle = {
  borderColor: "#0060BD",
  boxShadow: "0 0 0 3px rgba(0,96,189,0.15)",
};

const suffixIconStyle = {
  position: "absolute",
  right: "13px",
  top: "57%",
  transform: "translateY(-50%)",
  color: "#757575",
  fontSize: "20px",
};

class UsernamePasswordFieldWithIcon extends React.Component {
  state = {
    isFocused: false,
    showPassword: false,
  };

  handleFocus = () => this.setState({ isFocused: true });

  handleBlur = () => this.setState({ isFocused: false });

  togglePassword = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword,
    }));
  };

  render() {
    const {
      className,
      textFieldStyle = {},
      placeholder,
      suffixIcon,
      type,
      ...textFieldProps
    } = this.props;

    const { isFocused, showPassword } = this.state;

    const isPassword = type === "password";

    return (
      <div style={containerStyle}>
        <TextField
          className={className}
          placeholder={getLocaleLabels(
            textFieldProps.hintText,
            textFieldProps.hintText
          )}
          inputStyle={{
            ...inputStyleBase,
            ...(isFocused ? inputFocusStyle : {}),
            ...textFieldStyle,
          }}
          underlineShow={false}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          type={isPassword && showPassword ? "text" : type}
          {...textFieldProps}
        />

        {isPassword ? (
          <span
            style={{
              ...suffixIconStyle,
              cursor: "pointer",
              pointerEvents: "auto",
            }}
            onClick={this.togglePassword}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        ) : (
          <span style={suffixIconStyle}>
            {suffixIcon || <PersonIcon />}
          </span>
        )}
      </div>
    );
  }
}

UsernamePasswordFieldWithIcon.propTypes = {
  className: PropTypes.string,
  placeholder: PropTypes.string,
  textFieldStyle: PropTypes.object,
  suffixIcon: PropTypes.node,
  type: PropTypes.string,
};

export default UsernamePasswordFieldWithIcon;