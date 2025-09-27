"use client"

import { useReducer, useState, useEffect } from "react"
import {
  Box,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tab,
  Tabs,
  Checkbox,
  FormControlLabel,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { SquareUserRound, Plus, Edit, Trash } from "lucide-react"
//import DashboardLayout from "@/components/shared/DashboardLayout"
import DataTable from "@/components/ui/DataTable"
import MuiDialog from "@/components/ui/DialogBox"
import CustomTextField from "@/components/ui/CustomTextField"
import CustomDateInputField from "@/components/ui/DatePicker"
import CustomSelectField from "@/components/ui/CustomSelectField"
import request from "@/services/apiClient"

// Initial state for leave request form
const initialLeaveRequestState = {
  request_no: "",
  request_date: new Date().toISOString().split("T")[0],
  employee: "",
  reason: "",
  description: "", // API field
  company: "The Benchmark", // API field - default value
  leave_unit: "Days",
  leave_type: "",
  from_date: new Date().toISOString().split("T")[0],
  till_date: new Date().toISOString().split("T")[0],
  to_date: new Date().toISOString().split("T")[0], // API field
  leave_days: "1",
  un_paid: false,
  attachments: [],
  status: "Pending",
}
const StatusFooter = ({ status }: { status: string }) => (
  <div className="mt-4 border-t pt-2 text-sm">
    <span className="font-semibold">Status:</span>{" "}
    <span
      className={
        status === "Pending"
          ? "text-yellow-600"
          : status === "Approved"
          ? "text-green-600"
          : "text-red-600"
      }
    >
      {status}
    </span>
  </div>
)

// Initial state for attachment form (note: added notes)
const initialAttachmentState = {
  attachment_no: "",
  document_type: "",
  document_name: "",
  external_link: "",
  file: null,
  notes: "",
}

// Reducer for leave request form
const leaveRequestReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }
    case "RESET_FORM":
      return initialLeaveRequestState
    case "ADD_ATTACHMENT":
      return { ...state, attachments: [...state.attachments, action.attachment] }
    case "REMOVE_ATTACHMENT":
      return {
        ...state,
        attachments: state.attachments.filter((_: any, index: any) => index !== action.index),
      }
    default:
      return state
  }
}

// Reducer for attachment form
const attachmentReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }
    case "RESET_FORM":
      return initialAttachmentState
    default:
      return state
  }
}


const companyOptions = [
  { label: "The Benchmark", value: "The Benchmark" },
  { label: "Other Company", value: "Other Company" },
]

const leaveUnitOptions = [
  { label: "Days", value: "Days" },
  { label: "Hours", value: "Hours" },
]


// Form field configurations
const basicInfoFields = [
  {
    name: "request_no",
    label: "Request No",
    type: "text",
    placeholder: "Enter Request No",
    required: false,
    gridSize: 6,
  },
  {
    name: "request_date",
    label: "Request Date",
    type: "date",
    required: true,
    gridSize: 6,
  },
  {
    name: "employee",
    label: "Employee",
    type: "select",
    required: true,
    startIcon: <SquareUserRound size={16} />,
    gridSize: 12,
  },
  {
    name: "company",
    label: "Company",
    type: "select",
    options: companyOptions,
    required: true,
    gridSize: 6,
  },
  {
    name: "reason",
    label: "Reason",
    type: "textarea",
    required: true,
    rows: 4,
    gridSize: 12,
  },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    required: true,
    rows: 4,
    gridSize: 12,
  },
]

const attachmentFields = [
  {
    name: "attachment_no",
    label: "Attachment No",
    type: "text",
    placeholder: "Enter Attachment No",
    required: false,
    gridSize: 6,
  },
  {
    name: "document_type",
    label: "Document Type",
    type: "select",
    required: true,
    startIcon: <SquareUserRound size={16} />,
    gridSize: 6,
  },
  {
    name: "document_name",
    label: "Document Name",
    type: "text",
    placeholder: "Enter Document Name",
    required: true,
    gridSize: 12,
  },
  {
    name: "external_link",
    label: "External Link",
    type: "text",
    placeholder: "Enter External Link",
    required: false,
    gridSize: 12,
  },
  {
    name: "file",
    label: "Upload File",
    type: "file",
    gridSize: 12,
  },
]


// Helper function to format dates
const formatDate = (dateString: string) => {
  if (!dateString) return "-"
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB') // DD/MM/YYYY format
  } catch {
    return dateString
  }
}

// Helper function to format numbers
const formatNumber = (value: number | string) => {
  if (value === null || value === undefined) return "-"
  return typeof value === 'number' ? value.toString() : value
}


const attachmentColumns = [
  { key: "sno", label: "S.No" },
  { key: "attachment_no", label: "Attachment No" },
  { key: "document_name", label: "Document Name" },
  { key: "attachment_type", label: "Attachment Type" },
  { key: "actions", label: "Actions" },
]

export default function LeaveRequestPage() {
  const [leaveRequestState, leaveRequestDispatch] = useReducer(
    leaveRequestReducer,
    initialLeaveRequestState
  )
  const [attachmentState, attachmentDispatch] = useReducer(
    attachmentReducer,
    initialAttachmentState
  )
  const [isLeaveRequestModalOpen, setIsLeaveRequestModalOpen] = useState(false)
  const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [leaveTypes, setLeaveTypes] = useState<any[]>([])
  const [loadingLeaveTypes, setLoadingLeaveTypes] = useState(false)
  const [employees, setEmployees] = useState<any[]>([])
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null)

  // Mock data for demonstration
  const mockLeaveRequests = []

  // Transform leave types for dropdown
  const leaveTypeOptions = leaveTypes.map(leaveType => ({
    label: leaveType.leave_type_name,
    value: leaveType.name
  }))

  // Transform employees for dropdown
  const employeeOptions = employees.map(employee => ({
    label: employee.employee_name,
    value: employee.name
  }))

  useEffect(() => {
    fetchAll()
    fetchLeaveTypes()
    fetchEmployees()
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const response = await request.get('/resource/Leave Application', {
        fields: '["name","leave_type","employee_name","employee","from_date","to_date","total_leave_days"]'
      }) as { data: any[] }
      console.log("Fetched leave requests:", response.data)
      setLeaveRequests(response.data || [])
    } catch (error) {
      console.error("Error fetching leave requests:", error)
      setLeaveRequests([])
    } finally {
      setLoading(false)
    }
  }

  const fetchLeaveTypes = async () => {
    try {
      setLoadingLeaveTypes(true)
      const response = await request.get('/resource/Leave Type', {
        limit: 100,
        fields: '["name","leave_type_name"]'
      }) as { data: any[] }
      setLeaveTypes(response.data || [])
    } catch (error) {
      console.error("Error fetching leave types:", error)
      setLeaveTypes([])
    } finally {
      setLoadingLeaveTypes(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true)
      const response = await request.get('/resource/Employee', {
        fields: '["name","attendance_device_id","employee_name","branch","designation","department","cell_number","custom_employment_category","employment_type"]',
        limit_page_length: 0
      }) as { data: any[] }
      setEmployees(response.data || [])
    } catch (error) {
      console.error("Error fetching employees:", error)
      setEmployees([])
    } finally {
      setLoadingEmployees(false)
    }
  }

  const handleLeaveRequestSubmit = async () => {
    try {
      setLoading(true)
      
      // Validate required fields
      const requiredFields = ['employee', 'leave_type', 'company', 'from_date', 'to_date', 'description']
      const missingFields = requiredFields.filter(field => !leaveRequestState[field])
      
      if (missingFields.length > 0) {
        alert(`Please fill in the following required fields: ${missingFields.join(', ')}`)
        return
      }
      
      // Prepare API body with only the required fields
      const apiBody = {
        employee: leaveRequestState.employee,
        leave_type: leaveRequestState.leave_type,
        company: leaveRequestState.company,
        from_date: leaveRequestState.from_date,
        to_date: leaveRequestState.to_date,
        description: leaveRequestState.description
      }

      console.log("Submitting Leave Request with body:", apiBody)
      
      let response
      if (isEditMode && editingRecordId) {
        // Update existing leave application
        console.log("Updating record with ID:", editingRecordId)
        try {
          response = await request.patch(`/resource/Leave Application/${editingRecordId}`, apiBody)
          console.log("Leave Request updated successfully!")
        } catch (updateError: any) {
          console.error("Update error:", updateError)
          if (updateError.response?.status === 404) {
            alert(`Record with ID "${editingRecordId}" not found. The record may have been deleted. Refreshing the table...`)
            // Refresh the data table to get updated records
            await fetchAll()
            return
          }
          throw updateError
        }
      } else {
        // Create new leave application
        response = await request.post('/resource/Leave Application', apiBody)
        console.log("Leave Request submitted successfully!")
      }
      
      console.log("API Response:", response)
      
      // Refresh the data table
      await fetchAll()
      
      setIsLeaveRequestModalOpen(false)
      setIsEditMode(false)
      setEditingRecordId(null)
      leaveRequestDispatch({ type: "RESET_FORM" })
      setActiveTab(0)
    } catch (error: any) {
      console.error("Error submitting leave request:", error)
      
      // Show more detailed error information
      let errorMessage = "Error submitting leave request. Please try again."
      if (error.response) {
        // Server responded with error status
        errorMessage = `Error ${error.response.status}: ${error.response.statusText}`
        if (error.response.data) {
          console.error("Error response data:", error.response.data)
          errorMessage += ` - ${JSON.stringify(error.response.data)}`
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection."
      }
      
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleEditLeaveRequest = async (row: any) => {
    try {
      console.log("Editing leave request:", row)
      console.log("Record ID being used:", row.name)
      
      // First, let's try to fetch the record to verify it exists
      let fullRecord: any
      try {
        fullRecord = await request.get(`/resource/Leave Application/${row.name}`)
        console.log("Full record details:", fullRecord.data)
      } catch (fetchError: any) {
        console.error("Error fetching record details:", fetchError)
        if (fetchError.response?.status === 404) {
          alert(`Record with ID "${row.name}" not found. The record may have been deleted or the ID is incorrect.`)
          return
        }
        throw fetchError
      }
      
      // Populate form with existing data
      leaveRequestDispatch({
        type: "SET_FIELD",
        field: "request_no",
        value: fullRecord.data.name || ""
      })
      leaveRequestDispatch({
        type: "SET_FIELD",
        field: "request_date",
        value: fullRecord.data.creation || new Date().toISOString().split("T")[0]
      })
      leaveRequestDispatch({
        type: "SET_FIELD",
        field: "employee",
        value: fullRecord.data.employee || ""
      })
      leaveRequestDispatch({
        type: "SET_FIELD",
        field: "company",
        value: fullRecord.data.company || "The Benchmark"
      })
      leaveRequestDispatch({
        type: "SET_FIELD",
        field: "reason",
        value: fullRecord.data.reason || ""
      })
      leaveRequestDispatch({
        type: "SET_FIELD",
        field: "description",
        value: fullRecord.data.description || ""
      })
      leaveRequestDispatch({
        type: "SET_FIELD",
        field: "leave_type",
        value: fullRecord.data.leave_type || ""
      })
      leaveRequestDispatch({
        type: "SET_FIELD",
        field: "from_date",
        value: fullRecord.data.from_date || ""
      })
      leaveRequestDispatch({
        type: "SET_FIELD",
        field: "till_date",
        value: fullRecord.data.to_date || ""
      })
      leaveRequestDispatch({
        type: "SET_FIELD",
        field: "to_date",
        value: fullRecord.data.to_date || ""
      })
      leaveRequestDispatch({
        type: "SET_FIELD",
        field: "total_leave_days",
        value: fullRecord.data.total_leave_days || ""
      })
      
      // Set edit mode and open the modal for editing
      setIsEditMode(true)
      setEditingRecordId(row.name)
      setIsLeaveRequestModalOpen(true)
      
    } catch (error) {
      console.error("Error fetching leave request details:", error)
      alert("Failed to load leave request details for editing")
    }
  }

  const handleDeleteLeaveRequest = async (row: any) => {
    try {
      if (window.confirm(`Are you sure you want to delete leave request "${row.name}"? This action cannot be undone.`)) {
        console.log("Deleting leave request:", row)
        console.log("Record ID being deleted:", row.name)
        
        try {
          await request.delete(`/resource/Leave Application/${row.name}`)
          console.log("Leave request deleted successfully")
          
          // Refresh the data table
          await fetchAll()
          
          alert("Leave request deleted successfully")
        } catch (deleteError: any) {
          console.error("Delete error:", deleteError)
          if (deleteError.response?.status === 404) {
            alert(`Record with ID "${row.name}" not found. The record may have already been deleted. Refreshing the table...`)
            // Refresh the data table to get updated records
            await fetchAll()
            return
          } else if (deleteError.response?.status === 403) {
            alert("You don't have permission to delete this leave request.")
            return
          } else if (deleteError.response?.status === 400) {
            alert("Cannot delete this leave request. It may be in a state that prevents deletion.")
            return
          }
          throw deleteError
        }
      }
    } catch (error: any) {
      console.error("Error deleting leave request:", error)
      if (error.response?.status === 404) {
        alert("Record not found. It may have already been deleted.")
      } else if (error.response?.status === 403) {
        alert("You don't have permission to delete this leave request.")
      } else if (error.response?.status === 400) {
        alert("Cannot delete this leave request. It may be in a state that prevents deletion.")
      } else {
        alert(`Error deleting leave request: ${error.message || "Please try again."}`)
      }
    }
  }

  // Data table columns - updated to match API response
  const columns = [
    { 
      key: "actions", 
      label: "Actions", 
      sortable: false, 
      searchable: false,
      render: (row: any, index: number) => (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditLeaveRequest(row);
            }}
            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteLeaveRequest(row);
            }}
            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash size={16} />
          </button>
        </div>
      )
    },
    { key: "sno", label: "S.No", sortable: true, searchable: false },
    { key: "name", label: "Request No", sortable: true, searchable: true },
    { key: "employee_name", label: "Employee Name", sortable: true, searchable: true },
    { key: "employee", label: "Employee ID", sortable: true, searchable: true },
    { key: "leave_type", label: "Leave Type", sortable: true, searchable: true },
    { 
      key: "from_date", 
      label: "From Date", 
      sortable: true, 
      searchable: true,
      render: (row: any) => formatDate(row.from_date)
    },
    { 
      key: "to_date", 
      label: "To Date", 
      sortable: true, 
      searchable: true,
      render: (row: any) => formatDate(row.to_date)
    },
    { 
      key: "total_leave_days", 
      label: "Total Leave Days", 
      sortable: true, 
      searchable: true,
      render: (row: any) => formatNumber(row.total_leave_days)
    },
  ]

  const renderFormField = (field: any, state: any, dispatch: any) => {
    const value = state[field.name] || ""

    if (field.type === "date") {
      return (
        <CustomDateInputField
          input_label={field.label}
          input_value={value}
          onchange={(e: any) => dispatch({ type: "SET_FIELD", field: field.name, value: e.target.value })}
          required={field.required}
        />
      )
    }

    // For select fields use CustomSelectField if type === 'select'
    if (field.type === "select") {
      return (
        <CustomSelectField
          label={field.label}
          value={value}
          options={field.options || []}
          onChange={(e) => dispatch({ type: "SET_FIELD", field: field.name, value: e.target.value })}
        />
      )
    }

    return (
      <CustomTextField
        input_label={field.label}
        input_name={field.name}
        input_value={value}
        onchange={(e) => dispatch({ type: "SET_FIELD", field: field.name, value: e.target.value })}
        placeHolder={field.placeholder}
        required={field.required}
        isMultiLine={field.type === "textarea"}
        maxRows={field.rows}
        startIcon={field.startIcon}
      />
    )
  }

  return (
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Leave Request</h1>
          <div className="flex gap-2">
            <button
              onClick={fetchAll}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                setIsEditMode(false)
                setEditingRecordId(null)
                leaveRequestDispatch({ type: "RESET_FORM" })
                setIsLeaveRequestModalOpen(true)
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
            <div className="text-gray-600">Loading leave requests...</div>
          </div>
        ) : (
          <DataTable columns={columns} data={leaveRequests} />
        )}

      {/* Leave Request Modal */}
      <MuiDialog
        open={isLeaveRequestModalOpen}
        onClose={() => {
          setIsLeaveRequestModalOpen(false)
          setIsEditMode(false)
          setEditingRecordId(null)
          leaveRequestDispatch({ type: "RESET_FORM" })
        }}
        multiple_btn={true}
        title={isEditMode ? "Edit Leave Request" : "Leave Request"}
        description={false}
        maxWidth="lg"
        onSave={() => handleLeaveRequestSubmit()}
      >
        <div id="leave-request-parent">
          {/* Basic Information */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: "#f5f5f5" }}>
              <Typography sx={{ fontWeight: 600, fontSize: "12px" }}>Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#f5f5f5" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Request No */}
                <div>
                  <CustomTextField
                    input_label="Request No"
                    input_name="request_no"
                    input_value={leaveRequestState.request_no}
                    onchange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "request_no", value: e.target.value })
                    }
                  />
                </div>

                {/* Request Date */}
                <div>
                  <CustomDateInputField
                    input_label="Request Date"
                    input_value={leaveRequestState.request_date}
                    onchange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "request_date", value: e.target.value })
                    }
                  />
                </div>

                 {/* Employee */}
                 <div>
                   <CustomSelectField
                     label="Employee"
                     value={leaveRequestState.employee}
                     options={employeeOptions}
                     onChange={(e) =>
                       leaveRequestDispatch({ type: "SET_FIELD", field: "employee", value: e.target.value })
                     }
                     required
                   />
                   {loadingEmployees && (
                     <div className="text-xs text-gray-500 mt-1">Loading employees...</div>
                   )}
                   {!loadingEmployees && employeeOptions.length === 0 && (
                     <div className="text-xs text-red-500 mt-1">Failed to load employees</div>
                   )}
                 </div>

                 {/* Company */}
                 <div>
                   <CustomSelectField
                     label="Company"
                     value={leaveRequestState.company}
                     options={companyOptions}
                     onChange={(e) =>
                       leaveRequestDispatch({ type: "SET_FIELD", field: "company", value: e.target.value })
                     }
                     required
                   />
                 </div>

                 {/* Reason */}
                 <div className="md:col-span-2">
                   <CustomTextField
                     input_label="Reason"
                     input_name="reason"
                     input_value={leaveRequestState.reason}
                     onchange={(e) =>
                       leaveRequestDispatch({ type: "SET_FIELD", field: "reason", value: e.target.value })
                     }
                     isMultiLine
                     maxRows={3}
                     required
                   />
                 </div>

                 {/* Description (API field) */}
                 <div className="md:col-span-2">
                   <CustomTextField
                     input_label="Description"
                     input_name="description"
                     input_value={leaveRequestState.description}
                     onchange={(e) =>
                       leaveRequestDispatch({ type: "SET_FIELD", field: "description", value: e.target.value })
                     }
                     isMultiLine
                     maxRows={3}
                     required
                   />
                 </div>
              </div>
            </AccordionDetails>
          </Accordion>

          {/* Tabs: Leave Detail / Attachments */}
          <Tabs value={activeTab} onChange={(e, newVal) => setActiveTab(newVal)}>
            <Tab label="Leave Detail" />
            <Tab label="Attachments" />
          </Tabs>

          {/* Tab Panels */}
          {activeTab === 0 && (
            <div style={{ padding: "16px" }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <CustomSelectField
                    label="Leave Unit"
                    value={leaveRequestState.leave_unit}
                    options={leaveUnitOptions}
                    onChange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "leave_unit", value: e.target.value })
                    }
                    required
                  />
                </div>

                 <div>
                   <CustomSelectField
                     label="Leave Type"
                     value={leaveRequestState.leave_type}
                     options={leaveTypeOptions}
                     onChange={(e) =>
                       leaveRequestDispatch({ type: "SET_FIELD", field: "leave_type", value: e.target.value })
                     }
                     required
                   />
                   {loadingLeaveTypes && (
                     <div className="text-xs text-gray-500 mt-1">Loading leave types...</div>
                   )}
                   {!loadingLeaveTypes && leaveTypeOptions.length === 0 && (
                     <div className="text-xs text-red-500 mt-1">Failed to load leave types</div>
                   )}
                 </div>

                <div>
                  <CustomDateInputField
                    input_label="From Date"
                    input_value={leaveRequestState.from_date}
                    onchange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "from_date", value: e.target.value })
                    }
                    required
                  />
                </div>

                 <div>
                   <CustomDateInputField
                     input_label="Till Date"
                     input_value={leaveRequestState.till_date}
                     onchange={(e) => {
                       const value = e.target.value
                       leaveRequestDispatch({ type: "SET_FIELD", field: "till_date", value })
                       leaveRequestDispatch({ type: "SET_FIELD", field: "to_date", value })
                     }}
                     required
                   />
                 </div>

                <div>
                  <CustomTextField
                    input_label="Leave Days"
                    input_name="leave_days"
                    input_value={leaveRequestState.leave_days}
                    onchange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "leave_days", value: e.target.value })
                    }
                  />
                </div>

                <div>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={leaveRequestState.un_paid}
                        onChange={(e) =>
                          leaveRequestDispatch({ type: "SET_FIELD", field: "un_paid", value: e.target.checked })
                        }
                      />
                    }
                    label="Un Paid"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Attachments Tab */}
          {activeTab === 1 && (
            <div style={{ padding: "16px", width: "100%" }}>
              {/* Top Button */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => {
                    // Reset attachment form & open modal
                    attachmentDispatch({ type: "RESET_FORM" })
                    setIsAttachmentModalOpen(true)
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={20} />
                  New
                </button>
              </div>

              {/* Table Placeholder */}
              <DataTable columns={attachmentColumns} data={leaveRequestState.attachments || []} />
            </div>
          )}
                  <StatusFooter status={leaveRequestState.status} />

        </div>
      </MuiDialog>

      {/* Attachment Modal (separate dialog) */}
      <MuiDialog
        open={isAttachmentModalOpen}
        onClose={() => {
          setIsAttachmentModalOpen(false)
          attachmentDispatch({ type: "RESET_FORM" })
        }}
        multiple_btn={true}
        title="Attachment"
        description={false}
        maxWidth="md"
        onSave={() => {
          // Build new attachment object and add to leave request
          const newAttachment = {
            ...attachmentState,
            id: Date.now(),
            attachment_type: attachmentState.file ? "File" : "Link",
          }
          leaveRequestDispatch({ type: "ADD_ATTACHMENT", attachment: newAttachment })
          setIsAttachmentModalOpen(false)
          attachmentDispatch({ type: "RESET_FORM" })
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left column: all fields */}
          <div className="md:col-span-2">
            <div>
              <CustomTextField
                input_label="Attachment No"
                input_name="attachment_no"
                input_value={attachmentState.attachment_no}
                onchange={(e) =>
                  attachmentDispatch({ type: "SET_FIELD", field: "attachment_no", value: e.target.value })
                }
                placeholder="Enter Attachment No"
              />
            </div>

            <div className="mt-3">
              <CustomSelectField
                label="Document Type*"
                value={attachmentState.document_type}
                options={[
                  { label: "CNIC", value: "cnic" },
                  { label: "Passport", value: "passport" },
                  { label: "Other", value: "other" },
                ]}
                onChange={(e) =>
                  attachmentDispatch({ type: "SET_FIELD", field: "document_type", value: e.target.value })
                }
              />
            </div>

            <div className="mt-3">
              <CustomTextField
                input_label="Document Name*"
                input_name="document_name"
                input_value={attachmentState.document_name}
                onchange={(e) =>
                  attachmentDispatch({ type: "SET_FIELD", field: "document_name", value: e.target.value })
                }
                placeholder="Enter Document Name"
              />
            </div>

            <div className="mt-3">
              <CustomTextField
                input_label="External Link"
                input_name="external_link"
                input_value={attachmentState.external_link}
                onchange={(e) =>
                  attachmentDispatch({ type: "SET_FIELD", field: "external_link", value: e.target.value })
                }
                placeholder="Enter External Link"
              />
            </div>

            <div className="mt-3">
              <label className="block mb-1 text-sm font-medium">Upload File</label>
              <div className="border-dashed border-2 border-gray-400 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="attachment-file-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    attachmentDispatch({ type: "SET_FIELD", field: "file", value: file })
                    // auto-fill document_name if empty
                    if (file && !attachmentState.document_name) {
                      attachmentDispatch({ type: "SET_FIELD", field: "document_name", value: file.name })
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="attachment-file-input" className="cursor-pointer text-blue-600">
                  Choose File or drag and drop here
                </label>
              </div>
              <p className="text-xs text-gray-500">Max size: 15MB</p>
            </div>
          </div>

          {/* Right column: storage info */}
          <div>
            <div className="p-3 border rounded-lg bg-gray-50 h-full">
              <h4 className="font-medium mb-2">Storage (% full)</h4>
              <p className="mb-1">Usage: 0 GB (0 MB)</p>
              <p className="mb-1">Free: 15 GB (15,360 MB)</p>
              <p className="mb-1">Limit: 15 GB (15,360 MB)</p>
            </div>
          </div>
        </div>
  
        <StatusFooter status={leaveRequestState.status} />

      </MuiDialog>

     
  </div>
)
}