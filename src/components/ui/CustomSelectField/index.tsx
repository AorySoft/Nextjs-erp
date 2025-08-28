import React from "react";
import {
  FormControl,
  Select,
  MenuItem,
  SelectProps,
  Box,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"; // custom dropdown icon
import { height } from "@mui/system";
import { defaultColor } from "@/utils/constant";
import { SearchIcon } from "lucide-react";

interface CustomSelectFieldProps extends Omit<SelectProps, "label"> {
  label?: string;
  labelColor?: string;
  borderColor?: string;
  borderRadius?: string;
  backgroundColor?: string;
  focusBorderColor?: string;
  errorBorderColor?: string;
  options: Array<{ value: string; label: string }>;
  readOnly?: boolean;
}

const StyledFormControl = styled(FormControl)<
  Omit<CustomSelectFieldProps, "options" | "readOnly">
>(
  ({
    borderColor = "#F4F3F6",
    borderRadius = "8px",
    backgroundColor = "#F4F3F6",
    focusBorderColor = "#EAF3E8",
    errorBorderColor = "#FF4C4C",
  }) => ({
    "& .MuiOutlinedInput-root": {
      fontFamily: "sans-serif !important",
      fontSize: "14px",
      color: "#000000",
      backgroundColor: "transparent",
      borderRadius: "2px",
      border: `1px solid #000000`,
      transition: "all 0.2s ease-in-out",
      padding: "0px",

      "&:hover": {
        //   borderColor: focusBorderColor,
        //   boxShadow: `0 0 0 2px ${focusBorderColor}20`,
      },

      "&.Mui-focused": {
        //   borderColor: focusBorderColor,
        //   boxShadow: `0 0 0 2px ${focusBorderColor}30`,
      },

      "&.Mui-error": {
        borderColor: errorBorderColor,
        boxShadow: `0 0 0 2px ${errorBorderColor}30`,
      },

      "& .MuiSelect-select": {
        //   padding: "12px 16px",
        fontFamily: "sans-serif",
        fontSize: "14px",
        color: "#000000",

        backgroundColor: "#F4F3F6",
        height: "21px",
        padding:"0px"
      },

      "& fieldset": {
        border: "none",
      },
    },
  })
);

const LabelWrapper = styled(Typography)<{ labelColor?: string }>(
  ({ labelColor = "#070707" }) => ({
    fontFamily: "montserrat-Regular !important",
    fontSize: "14px !important",
    color: "#808080 !important",
    marginBottom: "4px",
    marginLeft: "16px",
  })
);

const StyledMenuItem = styled(MenuItem)({
  fontFamily: " sans-serif",
  fontSize: "14px",
  color: "#070707",
  "&:hover": {
    backgroundColor: "#EAF3E8",
  },
  "&.Mui-selected": {
    backgroundColor: "#EAF3E8 !important",
    color: "#070707",
    padding: "0px 8px", // adjust padding so text is centered

    "&:hover": {
      backgroundColor: "#EAF3E8",
    },
  },
});

const CustomSelectField: React.FC<CustomSelectFieldProps> = ({
  label,
  labelColor,
  borderColor,
  borderRadius,
  backgroundColor,
  focusBorderColor,
  errorBorderColor,
  options,
  fullWidth = true,
  readOnly = false,
  ...props
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      {label && <LabelWrapper labelColor={labelColor}>{label}</LabelWrapper>}
      <StyledFormControl
        fullWidth={fullWidth}
        borderColor={borderColor}
        borderRadius={borderRadius}
        backgroundColor={backgroundColor}
        focusBorderColor={focusBorderColor}
        errorBorderColor={errorBorderColor}
      >
        <Select
          displayEmpty
          readOnly={readOnly}
          //   IconComponent={ExpandMoreIcon} // 👈 custom icon here
          IconComponent={props.value ? () => null : ExpandMoreIcon}
          renderValue={(selected: any) => {

            if (!selected) {
              return (
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span
                  style={{
                    color: "#000000",
                    fontSize: "14px",
                    fontFamily: "montserrat-Regular",
                  }}
                >
                  Pays
                </span>
              </Box>
              );
            }
            const option = options.find((opt) => opt.value === selected);
            return (
                <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <SearchIcon color={defaultColor.main_blue} size="16" /> {/* 👈 Same icon for selected */}
                  <span
                    style={{
                      color: "#000000",
                      fontSize: "14px",
                      fontFamily: "montserrat-Regular",
                    }}
                  >
                    {option ? option.label : selected}
                  </span>
                </Box>
              );
          }}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: 240,
                overflow: "auto",
              },
            },
          }}
          {...props}
        >
          {options.map((option) => (
            <StyledMenuItem key={option.value} value={option.value}>
              {option.label}
            </StyledMenuItem>
          ))}
        </Select>
      </StyledFormControl>
    </Box>
  );
};

export default CustomSelectField;
