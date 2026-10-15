import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { getCityNameByCode } from "egov-ui-kit/utils/commons";
import { getTranslatedLabel } from "egov-ui-framework/ui-utils/commons";
import get from "lodash/get";

const toKey = (key) => `TENANT_TENANTS_${key.toUpperCase().replace(/[.:\-\s/]/g, "_")}`;

const containerStyle = {
  position: "relative",
  width: "100%",
  marginBottom: "1rem",
  marginTop: "12px",
};

const inputBoxStyle = {
  width: "100%",
  height: "51px",
  padding: "12px 40px 12px 15px",
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

const inputErrorStyle = {
  borderColor: "#E54D42",
};

const inputDisabledStyle = {
  backgroundColor: "#f5f5f5",
  color: "#9e9e9e",
  cursor: "not-allowed",
};

// dropdown-only mode: no typing, no text caret, pointer cursor
const inputDropdownModeStyle = {
  cursor: "pointer",
  caretColor: "transparent",
  userSelect: "none",
};

const suffixIconStyle = {
  position: "absolute",
  right: "15px",
  top: "52%",
  transform: "translateY(-50%)",
  color: "#757575",
  pointerEvents: "none",
  fontSize: "22px",
};

// invisible wrapper: creates the extra scroll space below the list
const dropdownWrapperStyle = {
  zIndex: 999,
  position: "absolute",
  top: "110%",
  left: 0,
  right: 0,
  paddingBottom: "20px", // the gap you want below the list
  pointerEvents: "none", // the empty gap shouldn't block clicks on things underneath
};

// the visible list
const dropdownStyle = {
  backgroundColor: "#fff",
  border: "1px solid #ddd",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  maxHeight: "250px",
  overflowY: "auto",
  padding: "4px 0",
  pointerEvents: "auto",
};

const listItemStyle = {
  padding: "6px 15px",
  borderBottom: "1px solid #eee",
  cursor: "pointer",
  fontSize: "15px",
  color: "#484848",
};

const listItemActiveStyle = {
  backgroundColor: "#eef5fc",
};

const listItemSelectedStyle = {
  fontWeight: 600,
  color: "#0060BD",
};

const emptyStyle = { padding: "12px 15px", color: "#999" };

const errorTextStyle = {
  color: "#E54D42",
  fontSize: "12px",
  marginTop: "4px",
  lineHeight: "12px",
};

class CityPickerFieldNew extends React.Component {
  state = {
    isFocused: false,
    open: false,
    searchTerm: "",
    isTyping: false,
    activeIndex: -1,
  };

  componentDidMount() {
    this.syncFromValue();
  }

  componentDidUpdate(prevProps) {
    const prevValue = prevProps.field && prevProps.field.value;
    const currValue = this.props.field && this.props.field.value;
    const labelsChanged = prevProps.localizationLabels !== this.props.localizationLabels;

    // keep the input in sync with the form value (prefill, reset, labels loading late)
    if ((prevValue !== currValue || labelsChanged) && !this.state.isTyping) {
      this.syncFromValue();
    }
  }

  syncFromValue = () => {
    const { field, localizationLabels } = this.props;
    const value = field && field.value;
    this.setState({
      searchTerm: value ? getCityNameByCode(value, localizationLabels) || "" : "",
    });
  };

  isDisabled = () => !!(this.props.field && this.props.field.disabled);

  // true = type-to-search combobox, false = plain dropdown
  isSearchable = () => this.props.searchable !== false;

  // index of the currently selected option, so the list opens on it
  getSelectedIndex = () => {
    const { field } = this.props;
    const value = field && field.value;
    if (!value) return -1;
    return this.getOptions().findIndex((o) => o.key === value);
  };

  openList = () => {
    this.setState({ open: true, isTyping: false, activeIndex: this.getSelectedIndex() });
  };

  closeList = () => {
    this.setState({ open: false, isTyping: false, activeIndex: -1 });
  };

  handleFocus = () => {
    if (this.isDisabled()) return;
    this.setState({ isFocused: true });
    // dropdown mode opens on click only (focus + click would otherwise open then instantly close)
    if (this.isSearchable()) this.openList();
  };

  handleClick = () => {
    if (this.isDisabled()) return;

    if (!this.isSearchable()) {
      // dropdown mode: toggle
      this.state.open ? this.closeList() : this.openList();
      return;
    }

    // search mode: input may already be focused after a selection, so onFocus won't fire again
    if (!this.state.open) this.openList();
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
    this.closeList();
    this.syncFromValue(); // revert any unselected typing back to the real value
  };

  handleSearchChange = (e) => {
    if (!this.isSearchable()) return;
    this.setState({ searchTerm: e.target.value, open: true, isTyping: true, activeIndex: -1 });
  };

  handleCityClick = (cityCode, cityName) => {
    const { fieldKey, onChange, flag, field } = this.props;
    const changed = !field || field.value !== cityCode;

    onChange(fieldKey, cityCode);
    if (flag) {
      onChange("mappedUlb", cityCode);
    } else if (changed) {
      onChange("mappedUlb", "");
    }

    this.setState({ searchTerm: cityName, open: false, isTyping: false, activeIndex: -1 });
  };

  handleKeyDown = (e) => {
    const options = this.getOptions();
    const { open, activeIndex } = this.state;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) return this.openList();
        this.setState({ activeIndex: Math.min(activeIndex + 1, options.length - 1) });
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) return this.openList();
        this.setState({ activeIndex: Math.max(activeIndex - 1, 0) });
        break;
      case " ":
        // Space opens the list in dropdown mode (in search mode it's a normal character)
        if (!this.isSearchable()) {
          e.preventDefault();
          if (!open) {
            this.openList();
          } else if (options[activeIndex]) {
            this.handleCityClick(options[activeIndex].key, options[activeIndex].label);
          }
        }
        break;
      case "Enter":
        if (open && options[activeIndex]) {
          e.preventDefault();
          this.handleCityClick(options[activeIndex].key, options[activeIndex].label);
        } else if (!open && !this.isSearchable()) {
          e.preventDefault();
          this.openList();
        }
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          this.closeList();
          this.syncFromValue();
        }
        break;
      default:
        break;
    }
  };

  // keep input focus when clicking inside the dropdown (incl. its scrollbar),
  // so blur never fires before the selection is handled
  preventBlur = (e) => e.preventDefault();

  getOptions = () => {
  const { cities, mappedOptions, flag, localizationLabels, excludeKeys } = this.props;
  const { searchTerm, isTyping } = this.state;

  const base = flag
    ? Array.isArray(mappedOptions) ? mappedOptions : []
    : (cities || []).filter((c) => c.isParent);

  // filter only in search mode, and only while the user is actively typing
  const q = this.isSearchable() && isTyping ? searchTerm.trim().toLowerCase() : "";

  return base
    .filter((c) => c && c.key)
    .filter((c) => !(excludeKeys || []).includes(c.key)) // hide excluded options
    .map((c) => ({ key: c.key, label: getTranslatedLabel(toKey(c.key), localizationLabels) }))
    .filter((c) => !q || (c.label && c.label.toLowerCase().includes(q)))
    // .sort((a, b) => (a.label || "").localeCompare(b.label || ""));s
};

  render() {
    const { isFocused, open, searchTerm, activeIndex } = this.state;
    const { localizationLabels, field } = this.props;
    const options = this.getOptions();
    const disabled = this.isDisabled();
    const searchable = this.isSearchable();
    const errorText = field && field.errorText;
    const selectedValue = field && field.value;

    return (
      <div style={containerStyle}>
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-autocomplete={searchable ? "list" : "none"}
          aria-invalid={!!errorText}
          autoComplete="off"
          readOnly={!searchable}
          disabled={disabled}
          placeholder={field && field.hintText ? getTranslatedLabel(field.hintText, localizationLabels) : ""}
          value={searchTerm}
          onChange={this.handleSearchChange}
          onFocus={this.handleFocus}
          onClick={this.handleClick}
          onBlur={this.handleBlur}
          onKeyDown={this.handleKeyDown}
          style={{
            ...inputBoxStyle,
            ...(!searchable ? inputDropdownModeStyle : {}),
            ...(errorText ? inputErrorStyle : {}),
            ...(isFocused ? inputFocusStyle : {}),
            ...(disabled ? inputDisabledStyle : {}),
          }}
        />
        <ArrowDropDownIcon style={suffixIconStyle} />

        {open && !disabled && (
          <div style={dropdownWrapperStyle}>
            <div role="listbox" style={dropdownStyle} onMouseDown={this.preventBlur}>
              {options.length > 0 ? (
                options.map((c, i) => {
                  const isSelected = !!selectedValue && c.key === selectedValue;
                  return (
                    <div
                      key={c.key}
                      role="option"
                      aria-selected={isSelected}
                      style={{
                        ...listItemStyle,
                        ...(i === options.length - 1 ? { borderBottom: "none" } : {}),
                        ...(isSelected && !searchable ? listItemSelectedStyle : {}),
                        ...(i === activeIndex ? listItemActiveStyle : {}),
                      }}
                      onMouseEnter={() => this.setState({ activeIndex: i })}
                      onMouseDown={() => this.handleCityClick(c.key, c.label)}
                    >
                      {c.label}
                    </div>
                  );
                })
              ) : (
                <div style={emptyStyle}>No City Found</div>
              )}
            </div>
          </div>
        )}

        {errorText && <div style={errorTextStyle}>{errorText}</div>}
      </div>
    );
  }
}


CityPickerFieldNew.propTypes = {
  fieldKey: PropTypes.string,
  field: PropTypes.object,
  cities: PropTypes.array,
  localizationLabels: PropTypes.object,
  flag: PropTypes.bool,
  searchable: PropTypes.bool,
  excludeKeys: PropTypes.arrayOf(PropTypes.string),
  mappedOptions: PropTypes.array,
  onChange: PropTypes.func.isRequired,
};

CityPickerFieldNew.defaultProps = {
  flag: false,
  searchable: true,
  excludeKeys: [],
  cities: [],
  mappedOptions: [],
};

const mapStateToProps = (state) => {
  const cities = get(state, "common.cities", []);
  const localizationLabels = get(state, "app.localizationLabels", {});
  return { cities, localizationLabels };
};

export default connect(mapStateToProps)(CityPickerFieldNew);
