// LabeledSelect.tsx
import React from "react";
import { Search } from "lucide-react";
import { defaultColor } from "@/utils/constant";

type Option = { value: string; label: string };

interface LabeledSelectProps {
  label: string;
  required?: boolean;
  options: Option[];
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  name?: string;
  id?: string;
}

const LabeledSelect: React.FC<LabeledSelectProps> = ({
  label,
  required,
  options,
  value = "",
  onChange,
  placeholder = "Select…",
  name,
  id,
}) => {
  return (
    <div style={{ width: "100%", marginBottom: "12px" }}>
      {/* Label */}
      <label
        htmlFor={id}
        style={{
          display: "block",
          fontSize: "12px",
          fontFamily: "sans-serif",
         fontWeight:600,color:defaultColor.main_grey_2,paddingBottom:10 ,
        }}
      >
        {label}
        {required ? <span style={{ color: "red" }}> *</span>:null}
      </label>

      {/* Wrapper for icon + select */}
      <div style={{ position: "relative", width: "100%" }}>
        {/* Start Icon */}
        <span
          style={{
            position: "absolute",
            left: 8,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            color: "#1d4ed8", // blue-ish like your screenshot
          }}
        >
          <Search size={14} />
        </span>

        {/* Native Select */}
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          // required={required}
          style={{
            width: "100%",
            height: "26px",
            background: "transparent",
            border: "1px solid #000000", // light gray border like in screenshot
            borderRadius: 4,
            fontSize: "12px",
            padding: "0 8px 0 28px", // left space for icon
            outline: "none",
            fontFamily: "sans-serif",
          }}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>

          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LabeledSelect;
