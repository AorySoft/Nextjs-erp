"use client"
import { useState, useEffect, useReducer } from "react"
import DataTable from "@/components/ui/DataTable"
import { defaultColor } from "@/utils/constant"
import { toast } from "react-toastify"
import { Plus, ChevronDown } from "lucide-react"
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Checkbox } from "@mui/material"
import CustomTextField from "@/components/ui/CustomTextField"
import CustomSelectField from "@/components/ui/CustomSelectField"
import MuiDialog from "@/components/ui/DialogBox"

interface ShiftType {
  name: string
  custom_shift_name: string | null
  start_time: string
  end_time: string
}

const TestPage = () => {
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([])
  const [loading, setLoading] = useState(false)

  const [state, setState] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {
    modal_open: false,
    name: "",
    custom_shift_name: "",
    start_time: "",
    end_time: "",
    custom_late_arrival_policy: "",
    custom_early_departure_policy: "",
    holiday_periods: [],
    formFields: [
      {
        input_name: "name",
        input_label: "Name",
        placeholder: "Enter Shift Name",
        type: "text",
        required: true,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "custom_shift_name",
        input_label: "Custom Shift Name",
        placeholder: "Enter Custom Shift Name",
        type: "text",
        required: true,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "start_time",
        input_label: "Start Time",
        placeholder: "Select Start Time",
        type: "time",
        required: true,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "end_time",
        input_label: "End Time",
        placeholder: "Select End Time",
        type: "time",
        required: true,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "custom_late_arrival_policy",
        input_label: "Late Arrival Policy",
        placeholder: "Select Late Arrival Policy",
        type: "select",
        required: true,
        grid_size: 6,
        options: [
          { label: "Late Arrival Policy (5 mins grace)", value: "Late Arrival Policy (5 mins grace)" },
          { label: "Late Arrival Policy (10 mins grace)", value: "Late Arrival Policy (10 mins grace)" },
          { label: "No Grace Period", value: "No Grace Period" },
        ],
      },
      {
        input_name: "custom_early_departure_policy",
        input_label: "Early Departure Policy",
        placeholder: "Select Early Departure Policy",
        type: "select",
        required: true,
        grid_size: 6,
        options: [
          { label: "Early Departure Policy", value: "Early Departure Policy" },
          { label: "Flexible Departure", value: "Flexible Departure" },
          { label: "Strict Departure", value: "Strict Departure" },
        ],
      },
    ],
  })

  const fetchShiftTypes = async () => {
    try {
      setLoading(true)
      console.log("Fetching shift types from API...")
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://erp.thebenchmark.com.pk/api'
      const erpToken = process.env.NEXT_PUBLIC_ERP_TOKEN || '25e8251c3cbaf25:6bd816c6a21d16e'
      
      const response = await fetch(`${apiUrl}/resource/Shift Type?fields=["name","custom_shift_name", "start_time", "end_time" ]&limit_page_length=0`, {
        headers: {
          'Authorization': `token ${erpToken}`,
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (result.data) {
        setShiftTypes(result.data)
        console.log("✅ Shift types fetched successfully:", result.data)
        toast.success("Shift types loaded successfully")
      } else {
        setShiftTypes([])
        console.log("No shift types found")
        toast.warning("No shift types found")
      }
    } catch (error) {
      console.error("Error fetching shift types:", error)
      toast.error("Failed to fetch shift types")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShiftTypes()
  }, [])

  const handleNewClick = () => {
    setState({
      modal_open: true,
      name: "",
      custom_shift_name: "",
      start_time: "",
      end_time: "",
      custom_late_arrival_policy: "",
      custom_early_departure_policy: "",
      holiday_periods: [],
    })
  }

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!state.name.trim()) {
        toast.error("Please enter shift name")
        return
      }
      if (!state.custom_shift_name.trim()) {
        toast.error("Please enter custom shift name")
        return
      }
      if (!state.start_time) {
        toast.error("Please select start time")
        return
      }
      if (!state.end_time) {
        toast.error("Please select end time")
        return
      }
      if (!state.custom_late_arrival_policy) {
        toast.error("Please select late arrival policy")
        return
      }
      if (!state.custom_early_departure_policy) {
        toast.error("Please select early departure policy")
        return
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://erp.thebenchmark.com.pk/api'
      const erpToken = process.env.NEXT_PUBLIC_ERP_TOKEN || '25e8251c3cbaf25:6bd816c6a21d16e'

      // Build query parameters for the URL
      const queryParams = new URLSearchParams({
        start_time: state.start_time,
        end_time: state.end_time,
        enable_auto_attendance: '1',
        name: state.name,
        determine_check_in_and_check_out: 'Strictly based on Log Type in Employee Checkin',
        auto_update_last_sync: '1',
        custom_late_arrival_policy: state.custom_late_arrival_policy,
        custom_early_departure_policy: state.custom_early_departure_policy
      })

      // Request body with required fields
      const requestBody = {
        custom_shift_name: state.custom_shift_name
      }

      const response = await fetch(`${apiUrl}/resource/Shift Type?${queryParams.toString()}`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${erpToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Shift created successfully:", result)
      toast.success("Shift created successfully")
      setState({ modal_open: false })
      
      // Refresh the shift types list
      await fetchShiftTypes()
    } catch (error) {
      console.error("Error creating shift:", error)
      toast.error(`Failed to create shift: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const columns = [
    {
      key: "sno",
      label: "S.No",
      searchable: false,
      render: (_: unknown, index: number) => index + 1,
    },
    {
      key: "name",
      label: "Name",
      searchable: true,
    },
    {
      key: "custom_shift_name",
      label: "Custom Shift Name",
      searchable: true,
      render: (row: unknown) => {
        const shift = row as ShiftType
        return shift.custom_shift_name || "N/A"
      },
    },
    {
      key: "start_time",
      label: "Start Time",
      searchable: true,
    },
    {
      key: "end_time",
      label: "End Time",
      searchable: true,
    },
  ]

  return (
    <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Shift Types</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchShiftTypes}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={handleNewClick}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading shift types...</div>
        </div>
      ) : (
        <DataTable columns={columns} data={shiftTypes} />
      )}

      {/* Modal */}
      <MuiDialog
        open={state.modal_open}
        onClose={() => setState({ modal_open: false })}
        multiple_btn={true}
        title="Shift Type"
        maxWidth="lg"
        onSave={handleSave}
      >
        <div id="calendar-holiday-parent">
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ChevronDown />} sx={{ backgroundColor: defaultColor.main_grey }}>
              <Typography fontWeight={600}>Basic Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="grid grid-cols-12 gap-4">
                {state.formFields.map((field: any, idx: number) => (
                  <div key={idx} className={`col-span-12 md:col-span-${field.grid_size}`}>
                    {field.type === "select" ? (
                      <CustomSelectField
                        name={field.input_name}
                        label={field.input_label}
                        value={state[field.input_name]}
                        onChange={(e) => setState({ [field.input_name]: e.target.value })}
                        placeholder={field.placeholder}
                        options={field.options}
                        required={field.required}
                      />
                    ) : (
                      <CustomTextField
                        input_name={field.input_name}
                        input_value={state[field.input_name]}
                        onchange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          setState({ [field.input_name]: e.target.value })
                        }
                        placeholder={field.placeholder}
                        input_label={field.input_label}
                        required={field.required}
                        startIcon={field.startIcon}
                        input_type={field.type === "time" ? "time" : "text"}
                      />
                    )}
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ChevronDown />} sx={{ backgroundColor: defaultColor.main_grey }}>
              <Typography fontWeight={600}>Holiday Periods</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 border border-gray-300 text-left font-semibold">Action</th>
                      <th className="p-3 border border-gray-300 text-left font-semibold">S.No</th>
                      <th className="p-3 border border-gray-300 text-left font-semibold">Date</th>
                      <th className="p-3 border border-gray-300 text-left font-semibold">Description</th>
                      <th className="p-3 border border-gray-300 text-left font-semibold">Weekly Off</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.holiday_periods?.length > 0 ? (
                      state.holiday_periods.map((row: any, index: number) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="p-3 border border-gray-300 text-center">
                            <div className="flex gap-2 justify-center">
                              <button 
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Edit holiday period"
                              >
                                Edit
                              </button>
                              <button 
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Delete holiday period"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                          <td className="p-3 border border-gray-300 text-center">{index + 1}</td>
                          <td className="p-3 border border-gray-300">{row.holiday_date}</td>
                          <td className="p-3 border border-gray-300">
                            <div 
                              dangerouslySetInnerHTML={{ __html: row.description || '' }}
                              className="prose prose-sm max-w-none"
                            />
                          </td>
                          <td className="p-3 border border-gray-300 text-center">
                            {row.weekly_off ? (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Yes</span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">No</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-3 border border-gray-300 text-center text-gray-500" colSpan={5}>
                          No records found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      </MuiDialog>
    </div>
  )
}

export default TestPage
