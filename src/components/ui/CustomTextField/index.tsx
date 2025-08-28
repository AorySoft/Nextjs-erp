/*
  Created By Muhammad Hassaan
  Date 15 April 2022
*/
import React, { useRef } from "react";
import PropTypes from "prop-types";
import { InputAdornment, TextField } from "@mui/material";
import { styled, useMediaQuery, useTheme } from "@mui/system";

const CustomTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      border: "none",
      fontFamily: "montserrat-Regular",
      padding:"2px !important",
    
    },
  },
});
export default function CustomInputField(props: any) {
  const {
    startIcon,
    input_label,
    input_value,
    input_name,
    input_style,
    placeHolder,
    onchange,
    input_type,
    endIicon,
    input_rows,
    required,
    isMultiLine,
    readonly,
    isDisable,
    onKeyDown,
    Onfocus,
    customSx,
  } = props;
  // const { sx: customSx, ...rest } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const screen_1024 = useMediaQuery(theme.breakpoints.up(1025));

  // Disable scroll behavior when focused
  const preventScroll = (event: React.WheelEvent) => {
    if (document.activeElement === inputRef.current) {
      event.preventDefault();
    }
  };
  return (
    <form
      style={{ width: "100%" }}
      autoComplete="off"
      onSubmit={(e) => e.preventDefault()}
    >
      {input_label && (
        <label
          
          style={{ fontSize: "16px",  display: "flex",color:"#000000",paddingBottom:10 ,fontFamily:'sans-serif'}}
        >
          {input_label}
          {required ? <span style={{ color: "red" }}> *</span> : ""}
        </label>
      )}
      <CustomTextField
        onFocus={(e) => {
          if (typeof Onfocus === "function") {
            Onfocus(e);
          }
        }}
        ref={inputRef}
        disabled={isDisable}
        multiline={isMultiLine}
        type={input_type}
        onWheel={preventScroll}
        rows={input_rows}
        fullWidth
        placeholder={placeHolder}
        onChange={onchange}
        margin="none"
        name={input_name}
        style={input_style}
        onKeyDown={onKeyDown}
        id="outlined-start-adornment"
        sx={{
         
           
          "& .MuiInputBase-input::placeholder": {
            color: "#8F8E9C", // Change this to your desired color
            opacity: 1, // Ensure the opacity is 1 to fully apply the color
          },
        
          // border: "none",
          border:"1px solid #000000",
          borderRadius:"2px",
          outline: "",
          padding:"2px !important",


          fontFamily: "sans-serif",
          "& .MuiInputBase-input": {
            fontFamily: "sans-serif",
            ...customSx,

          },
          "& .MuiInputLabel-root": {
            fontFamily: "sans-serif",
            padding:"2px !important",

          },
          "& .MuiOutlinedInput-root": {
            height: "21px" ,  padding:"2px !important",
            

            "& fieldset": {
              fontFamily: " sans-serif",
            },
          },

        }}
        value={input_value}
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
CustomInputField.defaultProps = {
  startIcon: "",
  endIicon: "",
  input_label: "",
  input_value: "",
  input_name: "",
  placeHolder: "",
  onchange: {},
  Onfocus: undefined, // Set default to undefined
  input_type: "",
  input_style: {
    fontFamily: "montserrat-Regular",
  },
  input_rows: 1,
  isMultiLine: false,
  readonly: false,
  isDisable: false,
  required:false
};

CustomInputField.propTypes = {
  startIcon: PropTypes.any,
  endIicon: PropTypes.any,
  input_label: PropTypes.string,
  input_value: PropTypes.any,
  input_name: PropTypes.any,
  input_style: PropTypes.any,
  placeHolder: PropTypes.any,
  onchange: PropTypes.func,
  input_type: PropTypes.string,
  input_rows: PropTypes.number,
  isMultiLine: PropTypes.bool,
  readonly: PropTypes.bool,
  isDisable: PropTypes.bool,
  onKeyDown: PropTypes.any,
  Onfocus: PropTypes.any,
  required: PropTypes.any,
  customSx:PropTypes.any,
};