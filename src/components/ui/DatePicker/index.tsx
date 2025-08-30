/*
  Created By Asad iqbal
  Date 29 Aug 2025
*/
import React, { useRef } from "react";
import PropTypes from "prop-types";
import { InputAdornment, TextField } from "@mui/material";
import { styled, } from "@mui/system";
import { defaultColor } from "@/utils/constant";

const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
      fontFamily: "montserrat-Regular",
      padding: "2px !important",
    },
  },
});

export default function CustomDateInputField(props: any) {
  const {
    startIcon,
    input_label,
    input_value,
    input_name,
    input_style,
    onchange,
    endIicon,
    required,
    readonly,
    isDisable,
    onKeyDown,
    Onfocus,
    customSx,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
//   const theme = useTheme();
//   const screen_1024 = useMediaQuery(theme.breakpoints.up(1025));

  return (
    <form
      style={{ width: "100%" }}
      autoComplete="off"
      onSubmit={(e) => e.preventDefault()}
    >
      {input_label && (
        <label
          style={{
            fontSize: "12px",
            display: "flex",
            fontWeight: 600,
            color: defaultColor.main_grey_2,
            paddingBottom: 10,
            fontFamily: "sans-serif",
          }}
        >
          {input_label}
          {required ? <span style={{ color: "red" }}> *</span> : ""}
        </label>
      )}
      <CustomTextField
        type="date" // 👈 always date type
        onFocus={(e) => {
          if (typeof Onfocus === "function") {
            Onfocus(e);
          }
        }}
        ref={inputRef}
        disabled={isDisable}
        fullWidth
        onChange={onchange}
        margin="none"
        name={input_name}
        style={input_style}
        onKeyDown={onKeyDown}
        id="outlined-date-input"
        value={input_value}
        sx={{
          border: "1px solid #000000",
          borderRadius: "2px",
          outline: "",
          padding: "2px !important",
          fontFamily: "sans-serif",
          "& .MuiInputBase-input": {
            fontFamily: "sans-serif",
            ...customSx,
          },
          "& .MuiOutlinedInput-root": {
            height: "21px",
            padding: "2px !important",
            "& fieldset": {
              fontFamily: "sans-serif",
            },
          },
        }}
        InputProps={{
          readOnly: readonly,
          startAdornment: (
            <InputAdornment position="start">{startIcon ?? ""}</InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">{endIicon ?? ""}</InputAdornment>
          ),
        }}
      />
    </form>
  );
}

CustomDateInputField.defaultProps = {
  startIcon: "",
  endIicon: "",
  input_label: "",
  input_value: "",
  input_name: "",
  onchange: {},
  Onfocus: undefined,
  input_style: {
    fontFamily: "montserrat-Regular",
  },
  readonly: false,
  isDisable: false,
  required: false,
};

CustomDateInputField.propTypes = {
  startIcon: PropTypes.any,
  endIicon: PropTypes.any,
  input_label: PropTypes.string,
  input_value: PropTypes.any,
  input_name: PropTypes.any,
  onchange: PropTypes.func,
  readonly: PropTypes.bool,
  isDisable: PropTypes.bool,
  onKeyDown: PropTypes.any,
  Onfocus: PropTypes.any,
  required: PropTypes.any,
  customSx: PropTypes.any,
};
