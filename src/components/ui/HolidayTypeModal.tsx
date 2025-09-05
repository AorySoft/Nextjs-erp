// "use client"

// import type React from "react"
// import { useState } from "react"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faTimes, faPlus, faChevronUp, faSave } from "@fortawesome/free-solid-svg-icons"

// interface HolidayTypeData {
//   code?: string
//   holiday_type?: string
//   description?: string
//   color_code?: string
//   is_active?: boolean
// }

// interface HolidayTypeModalProps {
//   isOpen: boolean
//   onClose: () => void
//   onSave?: (data: HolidayTypeData) => void
//   holidayData?: HolidayTypeData
// }

// const HolidayTypeModal: React.FC<HolidayTypeModalProps> = ({ isOpen, onClose, onSave, holidayData }) => {
//   const [formData, setFormData] = useState<HolidayTypeData>({
//     code: holidayData?.code || "",
//     holiday_type: holidayData?.holiday_type || "",
//     description: holidayData?.description || "",
//     color_code: holidayData?.color_code || "#000000",
//     is_active: holidayData?.is_active ?? true,
//   })

//   const [isBasicInfoExpanded, setIsBasicInfoExpanded] = useState(true)

//   const handleInputChange = (field: keyof HolidayTypeData, value: string | boolean) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

//   const handleSave = async () => {
//     try {
//       // Frontend validation for required fields
//       const requiredFields: (keyof HolidayTypeData)[] = ["code", "holiday_type"]

//       const missingFields = requiredFields.filter((field) => !formData[field] || String(formData[field]).trim() === "")

//       if (missingFields.length > 0) {
//         alert("Please fill in all required fields")
//         return
//       }

//       // API call would go here
//       // const response = await apiClient.post('/holiday-types', formData)

//       onSave?.(formData)
//       onClose()
//     } catch (error) {
//       console.error("Error saving holiday type:", error)
//       alert("Error saving holiday type data")
//     }
//   }

//   const handleSaveAndClose = async () => {
//     await handleSave()
//     onClose()
//   }

//   const handleNew = () => {
//     setFormData({
//       code: "",
//       holiday_type: "",
//       description: "",
//       color_code: "#000000",
//       is_active: true,
//     })
//   }

//   // Helper function to check if a field is filled
//   const isFieldFilled = (field: keyof HolidayTypeData) => {
//     const value = formData[field]
//     return value && String(value).trim() !== ""
//   }

//   // Helper function to get field validation class
//   const getFieldValidationClass = (field: keyof HolidayTypeData) => {
//     const isRequired = ["code", "holiday_type"].includes(field)

//     if (!isRequired) return "border-gray-300"

//     if (isFieldFilled(field)) {
//       return "border-green-500 focus:ring-green-500"
//     } else {
//       return "border-red-300 focus:ring-red-500"
//     }
//   }

//   if (!isOpen) return null

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg w-[90%] max-w-4xl h-[80%] max-h-[600px] flex flex-col">
//       <div className="flex items-center justify-between p-3 bg-blue-500 text-white rounded-t-lg">
//   <h2 className="text-lg font-medium">Holiday Type</h2>
//   <div className="flex gap-2">
//     <button
//       onClick={handleNew}
//       className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
//     >
//       <FontAwesomeIcon icon={faPlus} />
//       New
//     </button>
//     <button
//       onClick={handleSave}
//       className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
//     >
//       <FontAwesomeIcon icon={faSave} />
//       Save
//     </button>
//     <button
//       onClick={handleSaveAndClose}
//       className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
//     >
//       <FontAwesomeIcon icon={faSave} />
//       Save & Close
//     </button>
//     <button
//       onClick={onClose}
//       className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
//       title="Close"
//     >
//       <FontAwesomeIcon icon={faTimes} />
//     </button>
//   </div>
// </div>


//         <div className="flex-1 p-4 overflow-y-auto">
//           {/* Basic Information Accordion */}
//           <div className="border border-gray-300 rounded mb-4">
//             <div
//               className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-300 cursor-pointer"
//               onClick={() => setIsBasicInfoExpanded(!isBasicInfoExpanded)}
//             >
//               <h3 className="text-sm font-medium text-gray-700">Basic Information</h3>
//               <FontAwesomeIcon
//                 icon={faChevronUp}
//                 className={`text-gray-500 transition-transform ${isBasicInfoExpanded ? "" : "rotate-180"}`}
//               />
//             </div>

//             {isBasicInfoExpanded && (
//               <div className="p-4">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm text-gray-600 mb-1">
//                       Code<span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.code || ""}
//                       onChange={(e) => handleInputChange("code", e.target.value)}
//                       placeholder="Enter Code"
//                       className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${getFieldValidationClass("code")}`}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm text-gray-600 mb-1">
//                       Holiday Type<span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.holiday_type || ""}
//                       onChange={(e) => handleInputChange("holiday_type", e.target.value)}
//                       placeholder="Enter Holiday Type"
//                       className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 ${getFieldValidationClass("holiday_type")}`}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm text-gray-600 mb-1">Description</label>
//                     <textarea
//                       value={formData.description || ""}
//                       onChange={(e) => handleInputChange("description", e.target.value)}
//                       placeholder="Enter Description"
//                       rows={4}
//                       className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm text-gray-600 mb-1">Color Code</label>
//                     <div className="flex items-center gap-2">
//                       <div
//                         className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
//                         style={{ backgroundColor: formData.color_code || "#000000" }}
//                         onClick={() => document.getElementById("colorPicker")?.click()}
//                       />
//                       <input
//                         id="colorPicker"
//                         type="color"
//                         value={formData.color_code || "#000000"}
//                         onChange={(e) => handleInputChange("color_code", e.target.value)}
//                         className="hidden"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default HolidayTypeModal
