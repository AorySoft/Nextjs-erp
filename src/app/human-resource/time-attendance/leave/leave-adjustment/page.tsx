"use client"
import type React from "react"
import { useState, useEffect, useReducer } from "react"
import DataTable from "@/components/ui/DataTable"
import { Edit, Trash, Plus, ChevronDown, SquareUserRound } from "lucide-react"
import MuiDialog from "@/components/ui/DialogBox"

import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from "@mui/material"
import CustomTextField from "@/components/ui/CustomTextField"
import { defaultColor } from "@/utils/constant"
import CustomSelectField from "@/components/ui/CustomSelectField"
import CustomDateInputField from "@/components/ui/DatePicker"
import { toast } from "react-toastify"

interface TableLeaveAdjustment {
  transaction_no: string
  transaction_date: string
  adjustment_type: string
  payroll_period: string
  employee: string
  department: string
  designation: string
  leave_type: string
  leave_balance: number
  adjustment: number
  new_balance: number
  remarks: string
}

interface APILeaveAdjustment {
  transaction_no?: string
  transaction_date?: string
  adjustment_type?: string
  payroll_period?: string
  employee?: string
  department?: string
  designation?: string
  leave_type?: string
  leave_balance?: number
  adjustment?: number
  new_balance?: number
  remarks?: string
}

const LeaveAdjustment = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [leaveAdjustments, setLeaveAdjustments] = useState<TableLeaveAdjustment[]>([])
  const [loading, setLoading] = useState(false)

  const [state, setState] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {
    // Form fields for Leave Adjustment
    formFields: [
      {
        input_name: "transaction_no",
        input_label: "Transaction No",
        placeholder: "Enter Transaction No.",
        type: "text",
        required: true,
        startIcon: <></>,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "transaction_date",
        input_label: "Transaction Date",
        placeholder: "Select transaction date",
        type: "date",
        required: true,
        startIcon: <></>,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "adjustment_type",
        input_label: "Adjustment Type",
        placeholder: "Select adjustment type",
        type: "select",
        required: true,
        startIcon: <SquareUserRound size={16} />,
        grid_size: 6,
        isDisable: false,
        options: [
          { value: "opening_quota", label: "Opening Quota" },
          { value: "manual_adjustment", label: "Manual Adjustment" },
          { value: "system_adjustment", label: "System Adjustment" },
        ],
      },
      {
        input_name: "payroll_period",
        input_label: "Payroll Period",
        placeholder: "Select payroll period",
        type: "select",
        required: true,
        startIcon: <SquareUserRound size={16} />,
        grid_size: 6,
        isDisable: false,
        options: [
          { value: "bms_2024_25", label: "BMS 2024-25" },
          { value: "bms_2025_26", label: "BMS 2025-26" },
        ],
      },
      {
        input_name: "employee",
        input_label: "Employee",
        placeholder: "Select employee",
        type: "select",
        required: true,
        startIcon: <SquareUserRound size={16} />,
        grid_size: 6,
        isDisable: false,
        options: [
          { value: "anees_ur_rehman", label: "Anees ur Rehman" },
          { value: "muhammad", label: "Muhammad" },
          { value: "rehan", label: "Rehan" },
          { value: "junaid_iqbal", label: "Junaid Iqbal" },
        ],
      },
      {
        input_name: "department",
        input_label: "Department",
        placeholder: "Enter department",
        type: "text",
        required: false,
        startIcon: <></>,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "designation",
        input_label: "Designation",
        placeholder: "Enter designation",
        type: "text",
        required: false,
        startIcon: <></>,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "leave_type",
        input_label: "Leave Type",
        placeholder: "Select leave type",
        type: "select",
        required: true,
        startIcon: <SquareUserRound size={16} />,
        grid_size: 6,
        isDisable: false,
        options: [
          { value: "annual_leave", label: "Annual Leave" },
          { value: "sick_leave", label: "Sick Leave" },
          { value: "casual_leave", label: "Casual Leave" },
        ],
      },
      {
        input_name: "leave_balance",
        input_label: "Leave Balance",
        placeholder: "Enter leave balance",
        type: "text",
        required: true,
        startIcon: <></>,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "adjustment",
        input_label: "Adjustment",
        placeholder: "Enter Adjustment",
        type: "text",
        required: true,
        startIcon: <></>,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "new_balance",
        input_label: "New Balance",
        placeholder: "Enter new balance",
        type: "text",
        required: true,
        startIcon: <></>,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "remarks",
        input_label: "Remarks",
        placeholder: "Enter Remarks",
        type: "textarea",
        required: false,
        startIcon: <></>,
        grid_size: 12,
        isDisable: false,
      },
    ],
    leave_adjustment_dialog: false,
    // Form state
    transaction_no: "",
    transaction_date: new Date().toISOString().split("T")[0],
    adjustment_type: "",
    payroll_period: "",
    employee: "",
    department: "",
    designation: "",
    leave_type: "",
    leave_balance: "",
    adjustment: "",
    new_balance: "",
    remarks: "",
  })

  const mockData: TableLeaveAdjustment[] = [
    {
      transaction_no: "2025-03-01T000000",
      transaction_date: "2025-03-01",
      adjustment_type: "Opening Quota",
      payroll_period: "BMS 2024-25",
      employee: "Anees ur Rehman",
      department: "Academic",
      designation: "Teacher",
      leave_type: "Annual Leave",
      leave_balance: 20,
      adjustment: 5,
      new_balance: 25,
      remarks: "Opening balance adjustment",
    },
    {
      transaction_no: "2025-03-01T000000",
      transaction_date: "2025-03-01",
      adjustment_type: "Opening Quota",
      payroll_period: "BMS 2024-25",
      employee: "Muhammad",
      department: "Academic",
      designation: "Teacher",
      leave_type: "Annual Leave",
      leave_balance: 18,
      adjustment: 7,
      new_balance: 25,
      remarks: "Opening balance adjustment",
    },
    // ... more mock data
  ]

  const fetchAll = async () => {
    try {
      // const res: any = await apiClient.get('/resource/LeaveAdjustment?fields=["transaction_no","transaction_date","adjustment_type","payroll_period","employee"]');

      // Using mock data for now
      setLeaveAdjustments(mockData)
    } catch (err: any) {
      console.error("API error ❌", err.response?.data || err.message)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const columns = [
  
    {
      key: "sno",
      label: "S.No",
      searchable: false,
      render: (_: any, index: number) => index + 1,
    },
    { key: "transaction_no", label: "Transaction no", searchable: true },
    { key: "transaction_date", label: "Transaction Date", searchable: true },
    { key: "adjustment_type", label: "Adjustment Type", searchable: true },
    { key: "payroll_period", label: "Payroll Period", searchable: true },
    { key: "employee", label: "Employee", searchable: true },
  ]

  const validateForm = (formFields: any[], formState: any) => {
    for (const field of formFields) {
      if (field.required && field.isDisable == false) {
        const value = formState[field.input_name]

        if (!value || value.toString().trim() === "") {
          toast.error(`${field.input_label} is required`)
          console.log(`${field.input_label} is required`)
          return false
        }
      }
    }
    return true
  }

  const handleCreateLeaveAdjustment = async () => {
    try {
      if (!state.transaction_no) {
        toast.error("Please enter transaction number")
        return
      }
      if (!state.adjustment_type) {
        toast.error("Please select adjustment type")
        return
      }
      if (!state.employee) {
        toast.error("Please select employee")
        return
      }
      if (!state.leave_type) {
        toast.error("Please select leave type")
        return
      }

      const send_object = {
        transaction_no: state.transaction_no,
        transaction_date: state.transaction_date,
        adjustment_type: state.adjustment_type,
        payroll_period: state.payroll_period,
        employee: state.employee,
        department: state.department,
        designation: state.designation,
        leave_type: state.leave_type,
        leave_balance: state.leave_balance,
        adjustment: state.adjustment,
        new_balance: state.new_balance,
        remarks: state.remarks,
      }

      console.log("send_object", send_object)

      // const response = await apiClient.post('/resource/LeaveAdjustment', send_object);

      console.log("Leave Adjustment created successfully")
      toast.success("Leave Adjustment created successfully")
      setState({ leave_adjustment_dialog: false })
      fetchAll()
    } catch (error) {
      console.error("Error creating leave adjustment:", error)
    }
  }

  return (
    <>
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Leave Adjustment</h1>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                setState({ leave_adjustment_dialog: true })
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              New
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Loading leave adjustments...</div>
          </div>
        ) : (
          <DataTable columns={columns} data={leaveAdjustments} />
        )}
      </div>
      <MuiDialog
        open={state?.leave_adjustment_dialog}
        onClose={() => {
          setState({ leave_adjustment_dialog: false })
        }}
        multiple_btn={true}
        title="Leave Adjustment"
        description={false}
        maxWidth="lg"
        onSave={() => handleCreateLeaveAdjustment()}
        onPrint={() => console.log(state, "s")}
      >
        <div id="leave_adjustment-parent">
          <Accordion defaultExpanded>
            <AccordionSummary
              sx={{ margin: 0, backgroundColor: defaultColor.main_grey }}
              expandIcon={<ChevronDown />}
              aria-controls="basic-info-content"
              id="basic-info-header"
            >
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "12px",
                  fontFamily: "sans-serif",
                  margin: 0,
                }}
              >
                Basic Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ margin: 0, backgroundColor: defaultColor.main_grey }}>
              <Grid container spacing={2}>
                {state.formFields.map((field: any, index: number) => (
                  <Grid
                    size={{
                      xs: 12,
                      md: field.grid_size,
                    }}
                    key={index}
                  >
                    {field.type === "select" ? (
                      <CustomSelectField
                        label={field.input_label}
                        value={state[field.input_name]}
                        options={field.options}
                        required={field.required}
                        onChange={(e: any) => setState({ [field.input_name]: e.target.value })}
                      />
                    ) : field.type === "date" ? (
                        <CustomDateInputField
                        input_label={field.input_label}   // ✅ correct prop name
                        input_value={state[field.input_name]} // ✅ matches prop
                        onchange={(e: any) => setState({ [field.input_name]: e.target.value })}
                        required={field.required}
                      />
                    ) : field.type === "textarea" ? (
                      <CustomTextField
                        input_label={field.input_label}
                        input_name={field.input_name}
                        input_value={state[field.input_name]}
                        onchange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          setState({ [field.input_name]: e.target.value })
                        }
                        required={field.required}
                        isDisable={field.isDisable}
                        placeholder={field.placeholder}
                        multiline={true}
                        rows={4}
                      />
                    ) : (
                      <CustomTextField
                        input_label={field.input_label}
                        input_name={field.input_name}
                        input_value={state[field.input_name]}
                        onchange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          setState({ [field.input_name]: e.target.value })
                        }
                        required={field.required}
                        isDisable={field.isDisable}
                        placeholder={field.placeholder}
                        startIcon={field.startIcon}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </div>
      </MuiDialog>
    </>
  )
}

export default LeaveAdjustment
