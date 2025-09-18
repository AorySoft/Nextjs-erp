// 'use client';

// import React, { useState, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faTimes,
//   faBars,
//   faCalendarAlt,
//   faSearch,
//   faPlus,
//   faSave,
//   faChevronUp,
// } from '@fortawesome/free-solid-svg-icons';

// interface LeaveTypeData {
//   code: string;
//   leave_type: string;
//   leave_unit: string;
//   leaves: number | '';
//   renew_on: string;
//   max_avail: number | '';
//   max_avail_unit: string;
//   marital_status: string;
//   carry_forward: string;
//   encashment: string;
//   gender: string;
//   entitle_on: string;
//   accrual_unit: string;
//   request_before: string;
//   request_unit: string;
//   restrictions: {
//     allow_in_prob: boolean;
//     quota_validate: boolean;
//     paid_leave: boolean;
//     late_adjustable: boolean;
//     include_holidays: boolean;
//     early_dep_adjustable: boolean;
//   };
// }

// interface LeaveTypeModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave?: (data: LeaveTypeData) => void;
//   leaveTypeData?: LeaveTypeData;
// }

// const LeaveTypeModal: React.FC<LeaveTypeModalProps> = ({
//   isOpen,
//   onClose,
//   onSave,
//   leaveTypeData,
// }) => {
//   const [formData, setFormData] = useState<LeaveTypeData>({
//     code: leaveTypeData?.code || '',
//     leave_type: leaveTypeData?.leave_type || '',
//     leave_unit: leaveTypeData?.leave_unit || '',
//     leaves: leaveTypeData?.leaves || '',
//     renew_on: leaveTypeData?.renew_on || '',
//     max_avail: leaveTypeData?.max_avail || '',
//     max_avail_unit: leaveTypeData?.max_avail_unit || '',
//     marital_status: leaveTypeData?.marital_status || '',
//     carry_forward: leaveTypeData?.carry_forward || '',
//     encashment: leaveTypeData?.encashment || '',
//     gender: leaveTypeData?.gender || '',
//     entitle_on: leaveTypeData?.entitle_on || '',
//     accrual_unit: leaveTypeData?.accrual_unit || '',
//     request_before: leaveTypeData?.request_before || '',
//     request_unit: leaveTypeData?.request_unit || '',
//     restrictions: leaveTypeData?.restrictions || {
//       allow_in_prob: false,
//       quota_validate: false,
//       paid_leave: false,
//       late_adjustable: false,
//       include_holidays: false,
//       early_dep_adjustable: false,
//     },
//   });

//   const handleInputChange = (
//     field: keyof LeaveTypeData,
//     value: string | number
//   ) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleCheckboxChange = (field: keyof LeaveTypeData['restrictions']) => {
//     setFormData((prev) => ({
//       ...prev,
//       restrictions: {
//         ...prev.restrictions,
//         [field]: !prev.restrictions[field],
//       },
//     }));
//   };

//   const handleSave = () => {
//     // Basic validation for required fields
//     if (!formData.code || !formData.leave_type || !formData.leave_unit) {
//       alert('Code, Leave Type, and Leave Unit are required!');
//       return;
//     }
//     onSave?.(formData);
//     onClose();
//   };

//   useEffect(() => {
//     if (isOpen && !leaveTypeData) {
//       // reset for new leave type
//       setFormData({
//         code: '',
//         leave_type: '',
//         leave_unit: '',
//         leaves: '',
//         renew_on: '',
//         max_avail: '',
//         max_avail_unit: '',
//         marital_status: '',
//         carry_forward: '',
//         encashment: '',
//         gender: '',
//         entitle_on: '',
//         accrual_unit: '',
//         request_before: '',
//         request_unit: '',
//         restrictions: {
//           allow_in_prob: false,
//           quota_validate: false,
//           paid_leave: false,
//           late_adjustable: false,
//           include_holidays: false,
//           early_dep_adjustable: false,
//         },
//       });
//     }
//   }, [isOpen, leaveTypeData]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg w-[90%] max-w-6xl h-[90%] max-h-[800px] flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
//           <div className="flex items-center gap-3">
//             <FontAwesomeIcon icon={faBars} className="text-gray-600" />
//             <h2 className="text-xl font-semibold text-gray-800">Leave Type</h2>
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={handleSave}
//               className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
//             >
//               <FontAwesomeIcon icon={faSave} className="mr-2" />
//               Save
//             </button>
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
//             >
//               <FontAwesomeIcon icon={faTimes} />
//             </button>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="flex-1 p-6 overflow-y-auto">
//           <div className="grid grid-cols-2 gap-4">
//             {/* Basic Information */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Code *
//               </label>
//               <input
//                 type="text"
//                 value={formData.code}
//                 onChange={(e) => handleInputChange('code', e.target.value)}
//                 className="w-full px-3 py-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Leave Type *
//               </label>
//               <input
//                 type="text"
//                 value={formData.leave_type}
//                 onChange={(e) =>
//                   handleInputChange('leave_type', e.target.value)
//                 }
//                 className="w-full px-3 py-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Leave Unit *
//               </label>
//               <input
//                 type="text"
//                 value={formData.leave_unit}
//                 onChange={(e) =>
//                   handleInputChange('leave_unit', e.target.value)
//                 }
//                 className="w-full px-3 py-2 border rounded-md"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Renew On
//               </label>
//               <input
//                 type="text"
//                 value={formData.renew_on}
//                 onChange={(e) => handleInputChange('renew_on', e.target.value)}
//                 className="w-full px-3 py-2 border rounded-md"
//               />
//             </div>

//             {/* Policy Section */}
//             <div className="col-span-2 mt-6">
//               <div className="flex items-center gap-2 mb-2">
//                 <FontAwesomeIcon icon={faChevronUp} className="text-gray-600" />
//                 <h3 className="text-lg font-semibold text-gray-800">Policy</h3>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <input
//                   type="text"
//                   placeholder="Max Avail Unit"
//                   value={formData.max_avail_unit}
//                   onChange={(e) =>
//                     handleInputChange('max_avail_unit', e.target.value)
//                   }
//                   className="px-3 py-2 border rounded-md"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Max Avail"
//                   value={formData.max_avail}
//                   onChange={(e) =>
//                     handleInputChange('max_avail', e.target.value)
//                   }
//                   className="px-3 py-2 border rounded-md"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Marital Status"
//                   value={formData.marital_status}
//                   onChange={(e) =>
//                     handleInputChange('marital_status', e.target.value)
//                   }
//                   className="px-3 py-2 border rounded-md"
//                 />
//                 <input
//                   type="text"
//                   placeholder="Gender"
//                   value={formData.gender}
//                   onChange={(e) => handleInputChange('gender', e.target.value)}
//                   className="px-3 py-2 border rounded-md"
//                 />
//               </div>
//             </div>

//             {/* Restrictions */}
//             <div className="col-span-2 mt-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                 Restrictions
//               </h3>
//               <div className="grid grid-cols-2 gap-2">
//                 {Object.keys(formData.restrictions).map((key) => (
//                   <label
//                     key={key}
//                     className="flex items-center space-x-2 text-sm text-gray-700"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={
//                         formData.restrictions[
//                           key as keyof LeaveTypeData['restrictions']
//                         ]
//                       }
//                       onChange={() =>
//                         handleCheckboxChange(
//                           key as keyof LeaveTypeData['restrictions']
//                         )
//                       }
//                       className="h-4 w-4 text-blue-600 border-gray-300 rounded"
//                     />
//                     <span>{key.replace(/_/g, ' ')}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LeaveTypeModal;
