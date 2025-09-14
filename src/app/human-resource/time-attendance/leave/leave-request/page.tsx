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
  Grid,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { SquareUserRound, Plus } from "lucide-react"
import DashboardLayout from "@/components/shared/DashboardLayout"
import DataTable from "@/components/ui/DataTable"
import MuiDialog from "@/components/ui/DialogBox"
import CustomTextField from "@/components/ui/CustomTextField"
import CustomDateInputField from "@/components/ui/DatePicker"
import CustomSelectField from "@/components/ui/CustomSelectField"

// Initial state for leave request form
const initialLeaveRequestState = {
  request_no: "",
  request_date: new Date().toISOString().split("T")[0],
  employee: "",
  reason: "",
  leave_unit: "Days",
  leave_type: "",
  from_date: new Date().toISOString().split("T")[0],
  till_date: new Date().toISOString().split("T")[0],
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
const leaveRequestReducer = (state, action) => {
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
        attachments: state.attachments.filter((_, index) => index !== action.index),
      }
    default:
      return state
  }
}

// Reducer for attachment form
const attachmentReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }
    case "RESET_FORM":
      return initialAttachmentState
    default:
      return state
  }
}

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
    name: "reason",
    label: "Reason",
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

// --- Static options (add after imports) ---
const employeeOptions = [
  { label: "Ali Khan", value: "emp001" },
  { label: "Sara Ahmed", value: "emp002" },
  { label: "Bilal Hussain", value: "emp003" },
]

const leaveUnitOptions = [
  { label: "Days", value: "Days" },
  { label: "Hours", value: "Hours" },
]

const leaveTypeOptions = [
  { label: "Annual Leave", value: "annual" },
  { label: "Sick Leave", value: "sick" },
  { label: "Casual Leave", value: "casual" },
]

// Data table columns
const columns = [
  { key: "actions", label: "Actions", sortable: false, searchable: false },
  { key: "sno", label: "S.No", sortable: true, searchable: false },
  { key: "request_no", label: "Request No", sortable: true, searchable: true },
  { key: "request_date", label: "Request Date", sortable: true, searchable: true },
  { key: "employee_id", label: "Employee ID", sortable: true, searchable: true },
  { key: "employee_name", label: "Employee Name", sortable: true, searchable: true },
  { key: "leave_type", label: "Leave Type", sortable: true, searchable: true },
  { key: "from_date", label: "From Date", sortable: true, searchable: true },
  { key: "till_date", label: "Till Date", sortable: true, searchable: true },
  { key: "leave_days", label: "Leave Days", sortable: true, searchable: true },
]

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
  const [leaveRequests, setLeaveRequests] = useState([])
  const [loading, setLoading] = useState(false)

  // Mock data for demonstration
  const mockLeaveRequests = []

  useEffect(() => {
    setLeaveRequests(mockLeaveRequests)
  }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      // API call would go here
      // const response = await apiClient.get('/resource/LeaveRequest')
      setLeaveRequests(mockLeaveRequests)
    } catch (error) {
      console.error("Error fetching leave requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveRequestSubmit = async () => {
    try {
      setLoading(true)
      // API call would go here
      // await createLeaveRequest(leaveRequestState)
      console.log("Leave Request submitted:", leaveRequestState)

      setIsLeaveRequestModalOpen(false)
      leaveRequestDispatch({ type: "RESET_FORM" })
      setActiveTab(0)
    } catch (error) {
      console.error("Error submitting leave request:", error)
    } finally {
      setLoading(false)
    }
  }

  const renderFormField = (field, state, dispatch) => {
    const value = state[field.name] || ""

    if (field.type === "date") {
      return (
        <CustomDateInputField
          label={field.label}
          value={value}
          onChange={(newValue) => dispatch({ type: "SET_FIELD", field: field.name, value: newValue })}
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
        placeholder={field.placeholder}
        required={field.required}
        multiline={field.type === "textarea"}
        rows={field.rows}
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
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => setIsLeaveRequestModalOpen(true)}
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
          <DataTable columns={columns} data={leaveRequests} loading={loading} onEdit={() => {}} onDelete={() => {}} />
        )}

      {/* Leave Request Modal */}
      <MuiDialog
        open={isLeaveRequestModalOpen}
        onClose={() => {
          setIsLeaveRequestModalOpen(false)
          leaveRequestDispatch({ type: "RESET_FORM" })
        }}
        multiple_btn={true}
        title="Leave Request"
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
              <Grid container spacing={2}>
                {/* Request No */}
                <Grid item xs={12} md={6}>
                  <CustomTextField
                    input_label="Request No"
                    input_name="request_no"
                    input_value={leaveRequestState.request_no}
                    onchange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "request_no", value: e.target.value })
                    }
                  />
                </Grid>

                {/* Request Date */}
                <Grid item xs={12} md={6}>
                  <CustomDateInputField
                    input_label="Request Date"
                    input_value={leaveRequestState.request_date}
                    onchange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "request_date", value: e.target.value })
                    }
                  />
                </Grid>

                {/* Employee */}
                <Grid item xs={12} md={6}>
                  <CustomSelectField
                    label="Employee"
                    value={leaveRequestState.employee}
                    options={employeeOptions}
                    onChange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "employee", value: e.target.value })
                    }
                    required
                  />
                </Grid>

                {/* Reason */}
                <Grid item xs={12} md={12}>
                  <CustomTextField
                    input_label="Reason"
                    input_name="reason"
                    input_value={leaveRequestState.reason}
                    onchange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "reason", value: e.target.value })
                    }
                    multiline
                    rows={3}
                    required
                  />
                </Grid>
              </Grid>
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
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <CustomSelectField
                    label="Leave Unit"
                    value={leaveRequestState.leave_unit}
                    options={leaveUnitOptions}
                    onChange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "leave_unit", value: e.target.value })
                    }
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomSelectField
                    label="Leave Type"
                    value={leaveRequestState.leave_type}
                    options={leaveTypeOptions}
                    onChange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "leave_type", value: e.target.value })
                    }
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomDateInputField
                    input_label="From Date"
                    input_value={leaveRequestState.from_date}
                    onchange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "from_date", value: e.target.value })
                    }
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomDateInputField
                    input_label="Till Date"
                    input_value={leaveRequestState.till_date}
                    onchange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "till_date", value: e.target.value })
                    }
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <CustomTextField
                    input_label="Leave Days"
                    input_name="leave_days"
                    input_value={leaveRequestState.leave_days}
                    onchange={(e) =>
                      leaveRequestDispatch({ type: "SET_FIELD", field: "leave_days", value: e.target.value })
                    }
                  />
                </Grid>

                <Grid item xs={12} md={6}>
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
                </Grid>
              </Grid>
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
              <DataTable columns={attachmentColumns} data={leaveRequestState.attachments || []} style={{ width: "100%" }} />
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
        <Grid container spacing={2}>
          {/* Left column: all fields */}
          <Grid item xs={12} md={8}>
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
          </Grid>

          {/* Right column: storage info */}
          <Grid item xs={12} md={4}>
            <div className="p-3 border rounded-lg bg-gray-50 h-full">
              <h4 className="font-medium mb-2">Storage (% full)</h4>
              <p className="mb-1">Usage: 0 GB (0 MB)</p>
              <p className="mb-1">Free: 15 GB (15,360 MB)</p>
              <p className="mb-1">Limit: 15 GB (15,360 MB)</p>
            </div>
          </Grid>
        </Grid>
  
        <StatusFooter status={leaveRequestState.status} />

      </MuiDialog>

     
  </div>
)
}