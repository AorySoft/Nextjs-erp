import React from "react";

interface EditableFieldProps {
  type: "input" | "select";
  value: string;
  onChange: (value: string) => void;
  options?: string[];
}

const EditableField: React.FC<EditableFieldProps> = ({
  type,
  value,
  onChange,
  options = [],
}) => {
  if (type === "select") {
    return (
      <select
     
      className=" border-1 bg-transparent backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#2878aa] focus:border-[#2878aa] text-sm sm:text-base text-black placeholder-gray-400 border-t border-b border-transparent border-l border-r border-l-transparent border-r-transparent text-sm w-full"

        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {/* <option value="">Select</option> */}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type="text"
      className="p-1 border-1 bg-transparent backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#2878aa] focus:border-[#2878aa] text-sm sm:text-base text-black placeholder-gray-400 border-t border-b border-[#e9e9e9] border-l border-r border-l-transparent border-r-transparent text-sm w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default EditableField;
