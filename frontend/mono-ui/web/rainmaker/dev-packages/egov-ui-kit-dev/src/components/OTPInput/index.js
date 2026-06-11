import React from "react";
import PropTypes from "prop-types";
import TextField from "../TextField";

const containerStyle = {
    display: "flex",
    justifyContent: "center",
    gap: window.innerWidth < 390 ? "1%" :
        window.innerWidth < 410 ? "2%" :
            window.innerWidth < 440 ? "3%" :
                "14px",
    margin: "1rem 0",
};

const inputBaseStyle = {
    textAlign: "center",
    border: "1.5px solid #ccc",
    borderRadius: "8px",
    fontSize: "20px",
    fontWeight: "500",
    width: "45px",
    height: "45px",
    outline: "none",
    color: "#1B1B1B",
    backgroundColor: "#fff",
    boxSizing: "border-box",
    transition: "all 0.2s ease",
};

const inputFocusStyle = {
    borderColor: "#0060BD",
    boxShadow: "0 0 0 3px rgba(0,96,189,0.15)",
};

const inputFilledStyle = {
    borderColor: "#fe7a51",
    boxShadow: "0 0 6px rgba(14,159,110,0.3)",
};

class OTPInputField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otpValues: Array(props.length || 6).fill(""),
            focusedIndex: null,
        };
        this.inputs = [];
    }

    handleChange = (index, value) => {
        const { otpValues } = this.state;
        const { onChange } = this.props;

        // Only allow single digits
        if (/^[0-9]?$/.test(value)) {
            const newOtpValues = [...otpValues];
            newOtpValues[index] = value;

            this.setState({ otpValues: newOtpValues }, () => {
                // Move focus to next input when one digit entered
                if (value && index < otpValues.length - 1) {
                    const nextInput = this.inputs[index + 1];
                    if (nextInput && nextInput.focus) nextInput.focus();
                }
                // Trigger parent onChange with full OTP string
                onChange && onChange(newOtpValues.join(""));
            });
        }
    };

    handleKeyDown = (index, e) => {
        const { otpValues } = this.state;

        if (e.key === "Backspace") {
            // Clear current and move focus back if empty
            if (!otpValues[index] && index > 0) {
                const prevInput = this.inputs[index - 1];
                if (prevInput && prevInput.focus) prevInput.focus();
            }
        }

        if (e.key === "ArrowLeft" && index > 0) {
            const prevInput = this.inputs[index - 1];
            if (prevInput && prevInput.focus) prevInput.focus();
        }

        if (e.key === "ArrowRight" && index < otpValues.length - 1) {
            const nextInput = this.inputs[index + 1];
            if (nextInput && nextInput.focus) nextInput.focus();
        }
    };

    handleFocus = (index) => {
        this.setState({ focusedIndex: index });
    };

    handleBlur = () => {
        this.setState({ focusedIndex: null });
    };

    render() {
        const { otpValues, focusedIndex } = this.state;
        const { length = 6 } = this.props;

        return (
            <div style={containerStyle}>
                {Array.from({ length }).map((_, index) => {
                    const isFocused = focusedIndex === index;
                    const isFilled = otpValues[index] !== "";

                    return (
                        // <TextField
                        //   key={index}
                        //   type="tel"
                        //   underlineShow={false}
                        //   inputStyle={{
                        //     ...inputBaseStyle,
                        //     ...(isFocused ? inputFocusStyle : {}),
                        //     ...(isFilled ? inputFilledStyle : {}),
                        //   }}
                        //   value={otpValues[index]}
                        //   onChange={(e, value) => this.handleChange(index, value)}
                        //   onFocus={() => this.handleFocus(index)}
                        //   onBlur={this.handleBlur}
                        //   onKeyDown={(e) => this.handleKeyDown(index, e)}
                        //   // 👇 Important: access internal <input> DOM node
                        //   inputRef={(input) => (this.inputs[index] = input)}
                        // />
                        <input
                            key={index}
                            type="tel"
                            value={otpValues[index]}
                            onChange={(e) => this.handleChange(index, e.target.value)}
                            onFocus={() => this.handleFocus(index)}
                            onBlur={this.handleBlur}
                            onKeyDown={(e) => this.handleKeyDown(index, e)}
                            ref={(input) => (this.inputs[index] = input)}
                            style={{
                                ...inputBaseStyle,
                                ...(isFocused ? inputFocusStyle : {}),
                                ...(isFilled ? inputFilledStyle : {}),
                            }}
                        />

                    );
                })}
            </div>
        );
    }
}

OTPInputField.propTypes = {
    length: PropTypes.number,
    onChange: PropTypes.func,
};

export default OTPInputField;
