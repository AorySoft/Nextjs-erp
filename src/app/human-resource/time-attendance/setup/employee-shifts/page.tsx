"use client"
import { useState, useEffect, useReducer } from "react"
import DataTable from "@/components/ui/DataTable"
import { defaultColor } from "@/utils/constant"
import { toast } from "react-toastify"
import { Plus, ChevronDown, Trash, Edit, SquareUserRound, Calendar, Check } from "lucide-react"
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

interface ScheduleItem {
  id: string
  in_time: string
  out_time: string
  duration: number
  start_date: string
  end_date: string
  remarks: string
}

const TestPage = () => {
  const [shiftTypes, setShiftTypes] = useState<ShiftType[]>([])
  const [loading, setLoading] = useState(false)

  const [state, setState] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {
    modal_open: false,
    schedule_modal_open: false,
    isEditing: false,
    editingId: null,
    name: "",
    custom_shift_name: "",
    start_time: "",
    end_time: "",
    custom_late_arrival_policy: "",
    custom_early_departure_policy: "",
    holiday_periods: [],
    selectedDays: {
      monday: true,
      tuesday: false    ,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
    } as Record<string, boolean>,
    schedules: [],
    employees: [],
    scheduleForm: {
      employee: "",
      in_time: "",
      out_time: "",
      start_date: "",
      end_date: "",
      copy_to: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      }
    },
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
      isEditing: false,
      editingId: null,
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

      let response;
      
      if (state.isEditing && state.editingId) {
        // Update existing shift type using PUT request
        const requestBody = {
          start_time: state.start_time,
          end_time: state.end_time
        }

        response = await fetch(`${apiUrl}/resource/Shift Type/${state.editingId}`, {
          method: 'PUT',
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
        console.log("✅ Shift updated successfully:", result)
        toast.success("Shift updated successfully")
      } else {
        // Create new shift type using POST request
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

        const requestBody = {
          custom_shift_name: state.custom_shift_name
        }

        response = await fetch(`${apiUrl}/resource/Shift Type?${queryParams.toString()}`, {
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
      }

      setState({ 
        modal_open: false,
        isEditing: false,
        editingId: null
      })
      
      // Refresh the shift types list
      await fetchShiftTypes()
    } catch (error) {
      console.error("Error saving shift:", error)
      toast.error(`Failed to save shift: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleDeleteShiftType = async (shiftType: ShiftType) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://erp.thebenchmark.com.pk/api'
      const erpToken = process.env.NEXT_PUBLIC_ERP_TOKEN || '25e8251c3cbaf25:6bd816c6a21d16e'

      const response = await fetch(`${apiUrl}/resource/Shift Type/${shiftType.name}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `token ${erpToken}`,
          'Content-Type': 'application/json',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("✅ Shift type deleted successfully")
      toast.success("Shift type deleted successfully")
      
      // Refresh the shift types list
      await fetchShiftTypes()
    } catch (error) {
      console.error("Error deleting shift type:", error)
      toast.error("Failed to delete shift type")
    }
  }

  const handleEditShiftType = (shiftType: ShiftType) => {
    setState({
      modal_open: true,
      isEditing: true,
      editingId: shiftType.name, // Using name as the ID for the API call
      name: shiftType.name,
      custom_shift_name: shiftType.custom_shift_name || "",
      start_time: shiftType.start_time,
      end_time: shiftType.end_time,
      custom_late_arrival_policy: "",
      custom_early_departure_policy: "",
      holiday_periods: [],
    })
  }

  const handleViewShiftType = (shiftType: ShiftType) => {
    console.log("View shift type:", shiftType)
    toast.info(`Viewing details for: ${shiftType.name}`)
    // You can implement a view modal or navigate to a details page here
  }

  const toggleDay = (day: string) => {
    setState({
      selectedDays: {
        ...state.selectedDays,
        [day]: !state.selectedDays[day]
      }
    })
  }

  const fetchEmployees = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://erp.thebenchmark.com.pk/api'
      const erpToken = process.env.NEXT_PUBLIC_ERP_TOKEN || '25e8251c3cbaf25:6bd816c6a21d16e'
      
      const response = await fetch(`${apiUrl}/resource/Employee?fields=["name","employee_name"]&limit=false`, {
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
        setState({ employees: result.data })
        console.log("✅ Employees fetched successfully:", result.data)
      } else {
        setState({ employees: [] })
        console.log("No employees found")
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast.error("Failed to fetch employees")
    }
  }

  const addSchedule = () => {
    fetchEmployees() // Fetch employees when opening the modal
    setState({
      schedule_modal_open: true,
      scheduleForm: {
        employee: "",
        in_time: "",
        out_time: "",
        start_date: "",
        end_date: "",
        copy_to: {
          monday: false,
          tuesday: false,
          wednesday: false,
          thursday: false,
          friday: false,
          saturday: false,
          sunday: false,
        }
      }
    })
    console.log("Schedule modal opened, form state:", {
      employee: "",
      in_time: "",
      out_time: "",
      start_date: "",
      end_date: ""
    })
  }

  const saveSchedule = async () => {
    if (!state.scheduleForm.employee || !state.scheduleForm.in_time || !state.scheduleForm.out_time || !state.scheduleForm.start_date || !state.scheduleForm.end_date) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://erp.thebenchmark.com.pk/api'
      const erpToken = process.env.NEXT_PUBLIC_ERP_TOKEN || '25e8251c3cbaf25:6bd816c6a21d16e'

      // Get selected days for repeat_on_days
      const selectedDays = Object.entries(state.scheduleForm.copy_to)
        .filter(([_, isSelected]) => isSelected)
        .map(([day, _]) => day.charAt(0).toUpperCase() + day.slice(1)) // Capitalize first letter

      const requestBody = {
        employee: state.scheduleForm.employee,
        company: "The Benchmark",
        shift_type: state.name, // Using the shift type name from parent
        status: "Active",
        start_date: state.scheduleForm.start_date,
        end_date: state.scheduleForm.end_date,
        frequency: "Every Week",
        repeat_on_days: selectedDays
      }

      const response = await fetch(`${apiUrl}/method/hrms.api.roster.create_shift_schedule_assignment`, {
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
      console.log("✅ Shift schedule assignment created successfully:", result)
      
      // Add to local schedules for display
      const newSchedule: ScheduleItem = {
        id: Date.now().toString(),
        in_time: state.scheduleForm.in_time,
        out_time: state.scheduleForm.out_time,
        duration: 2.2, // You can calculate this based on in_time and out_time
        start_date: state.scheduleForm.start_date,
        end_date: state.scheduleForm.end_date,
        remarks: ""
      }
      
      setState({
        schedules: [...state.schedules, newSchedule],
        schedule_modal_open: false,
        scheduleForm: {
          employee: "",
          in_time: "",
          out_time: "",
          start_date: "",
          end_date: "",
          copy_to: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false,
          }
        }
      })
      
      toast.success("Shift schedule assignment created successfully")
    } catch (error) {
      console.error("Error creating shift schedule assignment:", error)
      toast.error(`Failed to create shift schedule assignment: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const removeSchedule = (id: string) => {
    setState({
      schedules: state.schedules.filter((schedule: ScheduleItem) => schedule.id !== id)
    })
  }

  const updateSchedule = (id: string, field: string, value: string | number) => {
    setState({
      schedules: state.schedules.map((schedule: ScheduleItem) =>
        schedule.id === id ? { ...schedule, [field]: value } : schedule
      )
    })
  }

  const columns = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: (row: unknown, index: number) => {
        const shiftType = row as ShiftType;
        return (
          <div className="flex gap-2">
            <div title="Delete shift type">
              <Trash
                size={16}
                color={defaultColor?.main_blue}
                style={{cursor:"pointer"}}
                onClick={() => {}}
              />
            </div>
            <div title="Edit shift type">
              <Edit
                size={16}
                color={defaultColor?.main_blue}
                style={{cursor:"pointer"}}
                onClick={() => handleEditShiftType(shiftType)}
              />
            </div>
            <div title="View shift type details">
              <SquareUserRound
                size={16}
                color={defaultColor?.main_blue}
                style={{cursor:"pointer"}}
                onClick={() => handleViewShiftType(shiftType)}
              />
            </div>
          </div>
        );
      },
    },
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
        onClose={() => setState({ modal_open: false, isEditing: false, editingId: null })}
        multiple_btn={true}
        title={state.isEditing ? "Edit Shift Type" : "Shift Type"}
        maxWidth="lg"
        onSave={handleSave}
      >
        <div className="space-y-6">
          {/* Basic Information Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
              <div className="flex items-center justify-between">
                <Typography fontWeight={600} className="text-gray-800">Basic Information</Typography>
                <ChevronDown className="text-gray-500" size={20} />
              </div>
            </div>
            <div className="p-4">
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
            </div>
          </div>

          {/* Day Selection Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="p-4">
              <Typography fontWeight={600} className="text-gray-800 mb-4">Select Working Days</Typography>
              <div className="flex flex-wrap gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                  const isSelected = state.selectedDays[day];
                  return (
                    <button
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
                        isSelected
                          ? 'bg-gradient-to-r  bg-[#2878aa] text-white border-transparent shadow-md'
                          : 'bg-white text-[#2878aa]  '
                      }`}
                    >
                      <div className="relative">
                        <Calendar size={16} />
                        <Check 
                          size={12} 
                          className={`absolute -top-1 -right-1 ${
                            isSelected ? 'text-white' : 'text-blue-600'
                          }`} 
                        />
                      </div>
                      <span className="capitalize font-medium">{day}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 border-b border-blue-200"></div>
            </div>
          </div>

          {/* Schedule Section */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 rounded-t-lg">
              <div className="flex items-center justify-between">
                <Typography fontWeight={600} className="text-gray-800">Schedule</Typography>
                <button
                  onClick={addSchedule}
                  className="flex items-center gap-2 px-3 py-1.5  text-[#2878aa] rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus size={16} />
                  Add Schedule
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 border border-gray-300 text-left font-semibold w-12">
                        <Checkbox size="small" />
                      </th>
                      <th className="p-3 border border-gray-300 text-left font-semibold w-12">S.No</th>
                      <th className="p-3 border border-gray-300 text-left font-semibold">In Time</th>
                      <th className="p-3 border border-gray-300 text-left font-semibold">Out Time</th>
                      <th className="p-3 border border-gray-300 text-left font-semibold">Duration</th>
                      <th className="p-3 border border-gray-300 text-left font-semibold">Start Date</th>
                      <th className="p-3 border border-gray-300 text-left font-semibold">End Date</th>
                      <th className="p-3 border border-gray-300 text-left font-semibold">Remarks</th>
                      <th className="p-3 border border-gray-300 text-left font-semibold w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.schedules.length > 0 ? (
                      state.schedules.map((schedule: ScheduleItem, index: number) => (
                        <tr key={schedule.id} className="hover:bg-gray-50">
                          <td className="p-3 border border-gray-300 text-center">
                            <Checkbox size="small" />
                          </td>
                          <td className="p-3 border border-gray-300 text-center">{index + 1}</td>
                          <td className="p-3 border border-gray-300">
                            <input
                              type="time"
                              value={schedule.in_time}
                              onChange={(e) => updateSchedule(schedule.id, 'in_time', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </td>
                          <td className="p-3 border border-gray-300">
                            <input
                              type="time"
                              value={schedule.out_time}
                              onChange={(e) => updateSchedule(schedule.id, 'out_time', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </td>
                          <td className="p-3 border border-gray-300">
                            <input
                              type="number"
                              step="0.1"
                              value={schedule.duration}
                              onChange={(e) => updateSchedule(schedule.id, 'duration', parseFloat(e.target.value))}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </td>
                          <td className="p-3 border border-gray-300">
                            <input
                              type="date"
                              value={schedule.start_date}
                              onChange={(e) => updateSchedule(schedule.id, 'start_date', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </td>
                          <td className="p-3 border border-gray-300">
                            <input
                              type="date"
                              value={schedule.end_date}
                              onChange={(e) => updateSchedule(schedule.id, 'end_date', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </td>
                          <td className="p-3 border border-gray-300">
                            <input
                              type="text"
                              value={schedule.remarks}
                              onChange={(e) => updateSchedule(schedule.id, 'remarks', e.target.value)}
                              placeholder="Enter remarks"
                              className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </td>
                          <td className="p-3 border border-gray-300 text-center">
                            <button
                              onClick={() => removeSchedule(schedule.id)}
                              className="p-1 hover:bg-red-100 rounded transition-colors text-red-600"
                              title="Remove schedule"
                            >
                              <Trash size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="p-8 text-center text-gray-500" colSpan={9}>
                          <Calendar size={48} className="mx-auto mb-2 text-gray-300" />
                          <p>No schedules added yet. Click "Add Schedule" to get started.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </MuiDialog>

      {/* Schedule Modal */}
      <MuiDialog
        open={state.schedule_modal_open}
        onClose={() => setState({ schedule_modal_open: false })}
        multiple_btn={true}
        title="Schedule"
        maxWidth="sm"
        onSave={saveSchedule}
      >
        <div className="space-y-6">
          {/* Employee Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee <span className="text-red-500">*</span>
            </label>
            <select
              value={state.scheduleForm.employee}
              onChange={(e) => setState({ 
                scheduleForm: { ...state.scheduleForm, employee: e.target.value }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Employee</option>
              {state.employees.map((emp: any) => (
                <option key={emp.name} value={emp.name}>
                  {emp.employee_name} ({emp.name})
                </option>
              ))}
            </select>
          </div>

          {/* Time and Date Fields */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  In Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={state.scheduleForm.in_time}
                    onChange={(e) => {
                      console.log("In time changed:", e.target.value)
                      setState({ 
                        scheduleForm: { ...state.scheduleForm, in_time: e.target.value }
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Out Time <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={state.scheduleForm.out_time}
                    onChange={(e) => {
                      console.log("Out time changed:", e.target.value)
                      setState({ 
                        scheduleForm: { ...state.scheduleForm, out_time: e.target.value }
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={state.scheduleForm.start_date}
                    onChange={(e) => {
                      console.log("Start date changed:", e.target.value)
                      setState({ 
                        scheduleForm: { ...state.scheduleForm, start_date: e.target.value }
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={state.scheduleForm.end_date}
                    onChange={(e) => {
                      console.log("End date changed:", e.target.value)
                      setState({ 
                        scheduleForm: { ...state.scheduleForm, end_date: e.target.value }
                      })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copy To Section */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Copy To</h3>
              <ChevronDown className="text-gray-400" size={16} />
            </div>
            <div className="flex flex-wrap gap-4">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                <label key={day} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={state.scheduleForm.copy_to[day]}
                    onChange={(e) => setState({
                      scheduleForm: {
                        ...state.scheduleForm,
                        copy_to: {
                          ...state.scheduleForm.copy_to,
                          [day]: e.target.checked
                        }
                      }
                    })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 capitalize">{day}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </MuiDialog>
    </div>
  )
}

export default TestPage
