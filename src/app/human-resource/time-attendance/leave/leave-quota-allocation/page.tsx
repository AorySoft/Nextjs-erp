"use client"

import { useReducer, useState } from "react"
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material"
import { Plus, Edit, Trash } from "lucide-react"
import DataTable from "@/components/ui/DataTable"
import MuiDialog from "@/components/ui/DialogBox"
import CustomTextField from "@/components/ui/CustomTextField"
import CustomDateInputField from "@/components/ui/DatePicker"
import CustomSelectField from "@/components/ui/CustomSelectField"

// Steps for the wizard
const steps = ["Setup", "Leave Group", "Allocation", "Summary"]

// Initial state for Leave Quota Allocation form
const initialQuotaState = {
  transaction_no: "",
  transaction_date: new Date().toISOString().split("T")[0],
  transaction_type: "",
  transaction_sub_type: "",
  payroll_period: "",
  description: "",
  leave_group: "",
  allocation: [],
}

const quotaReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }
    case "RESET_FORM":
      return initialQuotaState
    default:
      return state
  }
}

export default function LeaveQuotaAllocationPage() {
  const [quotaState, quotaDispatch] = useReducer(quotaReducer, initialQuotaState)
  const [activeStep, setActiveStep] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const columns = [
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className="flex gap-2">
          <button className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded">
            <Edit size={16} />
          </button>
          <button className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded">
            <Trash size={16} />
          </button>
        </div>
      ),
    },
    { key: "sno", label: "S.No" },
    { key: "transaction_no", label: "Transaction No" },
    { key: "transaction_date", label: "Transaction Date" },
    { key: "transaction_type", label: "Transaction Type" },
    { key: "payroll_period", label: "Payroll Period" },
  ]

  const renderStepContent = (step: number) => {
    // Skip Allocation step if Transaction Sub Type is "Opening Quota"
    const shouldSkipAllocation = quotaState.transaction_sub_type === "Opening Quota"
    
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomTextField
              input_label="Transaction No"
              input_name="transaction_no"
              input_value={quotaState.transaction_no}
              onchange={(e) =>
                quotaDispatch({
                  type: "SET_FIELD",
                  field: "transaction_no",
                  value: e.target.value,
                })
              }
            />
  
            <CustomDateInputField
              input_label="Transaction Date"
              input_value={quotaState.transaction_date}
              onchange={(e) =>
                quotaDispatch({
                  type: "SET_FIELD",
                  field: "transaction_date",
                  value: e.target.value,
                })
              }
            />
  
            <CustomSelectField
              label="Transaction Type"
              value={quotaState.transaction_type}
              options={[
                { label: "Opening", value: "Opening" },
                { label: "Adjustment", value: "Adjustment" },
              ]}
              onChange={(e) =>
                quotaDispatch({
                  type: "SET_FIELD",
                  field: "transaction_type",
                  value: e.target.value,
                })
              }
            />
  
            <CustomSelectField
              label="Transaction Sub Type"
              value={quotaState.transaction_sub_type}
              options={[
                { label: "Opening Quota", value: "Opening Quota" },
                { label: "New Quota", value: "New Quota" }
              ]}
              onChange={(e) =>
                quotaDispatch({
                  type: "SET_FIELD",
                  field: "transaction_sub_type",
                  value: e.target.value,
                })
              }
            />
  
            <CustomSelectField
              label="Payroll Period*"
              value={quotaState.payroll_period}
              options={[
                { label: "January 2024", value: "January 2024" },
                { label: "February 2024", value: "February 2024" },
                { label: "March 2024", value: "March 2024" },
                { label: "April 2024", value: "April 2024" },
                { label: "May 2024", value: "May 2024" },
                { label: "June 2024", value: "June 2024" },
              ]}
              onChange={(e) =>
                quotaDispatch({
                  type: "SET_FIELD",
                  field: "payroll_period",
                  value: e.target.value,
                })
              }
            />
  
            <CustomTextField
              input_label="Description"
              input_name="description"
              input_value={quotaState.description}
              onchange={(e) =>
                quotaDispatch({
                  type: "SET_FIELD",
                  field: "description",
                  value: e.target.value,
                })
              }
              isMultiLine
            />
          </div>
        )
  
      case 1: // Leave Group
        // Show different layout based on Transaction Sub Type
        if (quotaState.transaction_sub_type === "Opening Quota") {
          return (
            <div>
              {/* Leave Group and Leave Type Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <CustomSelectField
                    label="Leave Group*"
                    value={quotaState.leave_group}
                    options={[
                      { label: "Annual Leave (15 Days)", value: "Annual Leave (15 Days)" },
                      { label: "Annual Leave (6 Days)", value: "Annual Leave (6 Days)" },
                    ]}
                    onChange={(e) =>
                      quotaDispatch({
                        type: "SET_FIELD",
                        field: "leave_group",
                        value: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <CustomSelectField
                    label="Leave Type*"
                    value=""
                    options={[
                      { label: "Summer Vacations", value: "Summer Vacations" },
                      { label: "Winter Vacations", value: "Winter Vacations" },
                      { label: "Umrah", value: "Umrah" },
                      { label: "Emergency", value: "Emergency" },
                      { label: "Medical Leave", value: "Medical Leave" },
                      { label: "Maternity Leave", value: "Maternity Leave" },
                    ]}
                    onChange={() => {}}
                  />
                </div>
              </div>
              
              {/* Browse File Section */}
              <div className="mb-4">
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: 'none' }}
                  onChange={() => {}}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  Browse File...
                </label>
                <span className="ml-2 text-gray-500">No file chosen</span>
              </div>
              
              {/* Save Button */}
              <div className="mb-4">
                <Button variant="outlined" size="small">
                  💾 Save
                </Button>
              </div>
        
              {/* Table */}
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">S.No</th>
                    <th className="border px-2 py-1">Code</th>
                    <th className="border px-2 py-1">Employee</th>
                    <th className="border px-2 py-1">Leave Type</th>
                    <th className="border px-2 py-1">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      🔍 No Record Found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        } else if (quotaState.transaction_sub_type === "New Quota") {
          return (
            <div>
              {/* Leave Group Search Input */}
              <div className="mb-4">
                <CustomSelectField
                  label="Leave Group*"
                  value={quotaState.leave_group}
                  options={[
                    { label: "Annual Leave (15 Days)", value: "Annual Leave (15 Days)" },
                    { label: "Annual Leave (6 Days)", value: "Annual Leave (6 Days)" },
                  ]}
                  onChange={(e) =>
                    quotaDispatch({
                      type: "SET_FIELD",
                      field: "leave_group",
                      value: e.target.value,
                    })
                  }
                />
              </div>
        
              {/* Table with checkbox selection */}
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">
                      <input type="checkbox" />
                    </th>
                    <th className="border px-2 py-1">S.No</th>
                    <th className="border px-2 py-1">Leave Type</th>
                    <th className="border px-2 py-1">Leave Days</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-2 text-4xl">🔍</div>
                        <p>No Record Found</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        } else {
          // Default view when no Transaction Sub Type is selected
          return (
            <div>
              <div className="mb-4">
                <CustomTextField
                  input_label="Leave Group*"
                  input_name="leave_group"
                  input_value={quotaState.leave_group}
                  onchange={(e) =>
                    quotaDispatch({
                      type: "SET_FIELD",
                      field: "leave_group",
                      value: e.target.value,
                    })
                  }
                />
              </div>
              
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">
                      <input type="checkbox" />
                    </th>
                    <th className="border px-2 py-1">S.No</th>
                    <th className="border px-2 py-1">Leave Type</th>
                    <th className="border px-2 py-1">Leave Days</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      🔍 No Record Found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        }
      
  
      case 2: // Allocation
        const allocationData = [
          { sno: 1, type: "Annual Leave (15d)", leave: 15, total: 110, allocate: 42, notAllocate: 68 },
          { sno: 2, type: "Umrah Leaves", leave: 25, total: 110, allocate: 0, notAllocate: 110 },
          { sno: 3, type: "Medical Leaves for HOD's", leave: 30, total: 110, allocate: 0, notAllocate: 110 },
          { sno: 4, type: "Watchman leaves (for family ...)", leave: 7, total: 110, allocate: 0, notAllocate: 110 },
          { sno: 5, type: "Unpaid Leaves", leave: 31, total: 110, allocate: 0, notAllocate: 110 },
          { sno: 6, type: "Emergency", leave: 31, total: 110, allocate: 0, notAllocate: 110 },
          { sno: 7, type: "Maternity leaves", leave: 45, total: 110, allocate: 0, notAllocate: 110 },
          { sno: 8, type: "Winter vacations", leave: 10, total: 110, allocate: 0, notAllocate: 110 },
          { sno: 9, type: "Summer vacations", leave: 45, total: 110, allocate: 0, notAllocate: 110 },
        ]
  
        return (
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">S.No</th>
                <th className="border px-2 py-1">Leave Type</th>
                <th className="border px-2 py-1">Leave</th>
                <th className="border px-2 py-1">Total</th>
                <th className="border px-2 py-1">Allocate</th>
                <th className="border px-2 py-1">Not Allocate</th>
                <th className="border px-2 py-1">Status</th>
              </tr>
            </thead>
            <tbody>
              {allocationData.map((row) => (
                <tr key={row.sno}>
                  <td className="border px-2 py-1">{row.sno}</td>
                  <td className="border px-2 py-1">{row.type}</td>
                  <td className="border px-2 py-1">{row.leave}</td>
                  <td className="border px-2 py-1">{row.total}</td>
                  <td className="border px-2 py-1">{row.allocate}</td>
                  <td className="border px-2 py-1">{row.notAllocate}</td>
                  <td className="border px-2 py-1 text-center">
                    <Button size="small" variant="outlined">Allocate</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
  
      case 3: // Summary
        return (
          <div>
            {/* Summary Table Header */}
            <table className="w-full border text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-1">S.No</th>
                  <th className="border px-2 py-1">Leave Type</th>
                  <th className="border px-2 py-1">No Of Emp</th>
                  <th className="border px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="text-center py-16 text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="mb-2 text-4xl">🔍</div>
                      <p>No Record Found</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )
  
      default:
        return null
    }
  }
  

  return (
    <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Leave Quota Allocation</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            New
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={[]} />

      {/* Modal */}
      <MuiDialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        multiple_btn={true}
        title={isEditMode ? "Edit Quota Allocation" : "Leave Quota Allocation"}
        onSave={() => setIsModalOpen(false)}
        maxWidth="lg"
      >
        <Box>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div className="mt-4">{renderStepContent(activeStep)}</div>

          <div className="flex justify-between mt-6">
            <Button 
              disabled={activeStep === 0} 
              onClick={() => {
                const shouldSkipAllocation = quotaState.transaction_sub_type === "Opening Quota"
                if (shouldSkipAllocation && activeStep === 3) {
                  // Skip back from summary to leave group (skip allocation)
                  setActiveStep(1)
                } else {
                  setActiveStep((prev) => prev - 1)
                }
              }}
            >
              Back
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={() => {
                  const shouldSkipAllocation = quotaState.transaction_sub_type === "Opening Quota"
                  if (shouldSkipAllocation && activeStep === 1) {
                    // Skip allocation step and go directly to summary
                    setActiveStep(3)
                  } else {
                    setActiveStep((prev) => prev + 1)
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={() => setIsModalOpen(false)}>
                Submit
              </Button>
            )}
          </div>
        </Box>
      </MuiDialog>
    </div>
  )
}