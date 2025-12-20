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
import apiClient from '@/services/apiClient';

interface ShiftType {
  name: string
  shift_group_name: string | null
  start_time: string
  end_time: string
}

interface ScheduleItem {
  id: string
  day: string
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
// Admin-test
// cATIU4ih30LwwJ/
  const defaultSelectedDays: Record<string, boolean> = {
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  }

  const [state, setState] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {
    modal_open: false,
    schedule_modal_open: false,
    isEditing: false,
    editingId: null,
    name: "",
    custom_shift_name: "",
    employee: "",
    selectedDays: defaultSelectedDays,
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
        input_name: "shift_group_name",
        input_label: "Shift Group Name",
        placeholder: "Enter Shift Group Name",
        type: "text",
        required: true,
        grid_size: 6,
        isDisable: false,
      },
    ],
  })

  const fetchShiftTypes = async () => {
    try {
      setLoading(true)
      console.log("Fetching shift types from API...")
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://erp.thebenchmark.com.pk/api'
      const erpToken = process.env.NEXT_PUBLIC_ERP_TOKEN || '25e8251c3cbaf25:6bd816c6a21d16e'
      
      // const response = await fetch(`${apiUrl}/resource/Shift Type?fields=["name","custom_shift_name", "start_time", "end_time" ]&limit_page_length=0`, {
      //   headers: {
      //     'Authorization': `token ${erpToken}`,
      //     'Content-Type': 'application/json',
      //   }
      // })
const response: any = await apiClient.get(`/resource/Shift Group?fields=["shift_group_name","name"]`);      
     
      
      
      if (response.data) {
        setShiftTypes(response.data)
        console.log("✅ Shift types fetched successfully:", response.data)
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

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleNewClick = () => {
    setState({
      modal_open: true,
      isEditing: false,
      editingId: null,
      name: "",
      shift_group_name: "",
      employee: "",
      selectedDays: defaultSelectedDays,
      schedules: [],
    })
  }

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!state.shift_group_name?.trim()) {
        toast.error("Please enter shift group name")
        return
      }

      if (!state.employee) {
        toast.error("Please select an employee")
        return
      }

      const schedules = (state.schedules as ScheduleItem[]) || []

      if (schedules.length === 0) {
        toast.error("Please select at least one day")
        return
      }

      setLoading(true)

      const normalizeTime = (value: string) => {
        if (!value) return value
        const parts = value.split(":")
        if (parts.length === 2) return `${value}:00`
        return value
      }

      const daysPayload = (state.schedules as ScheduleItem[])
        .map((s) => {
          if (!s.day) {
            throw new Error("Please select day")
          }
          if (!s.in_time) {
            throw new Error(`Please select start time for ${s.day}`)
          }
          if (!s.out_time) {
            throw new Error(`Please select end time for ${s.day}`)
          }
          if (!s.start_date) {
            throw new Error(`Please select start date for ${s.day}`)
          }
          if (!s.end_date) {
            throw new Error(`Please select end date for ${s.day}`)
          }

          // Validate time range (HH:MM) or (HH:MM:SS) lexicographically works
          if (normalizeTime(s.in_time) >= normalizeTime(s.out_time)) {
            throw new Error(`Start time must be before end time for ${s.day}`)
          }

          // Validate date range (YYYY-MM-DD lexicographically works)
          if (s.start_date > s.end_date) {
            throw new Error(`Start date must be before or equal to end date for ${s.day}`)
          }

          return {
            day: s.day,
            start_time: normalizeTime(s.in_time),
            end_time: normalizeTime(s.out_time),
            start_date: s.start_date,
            end_date: s.end_date,
          }
        })

      if (daysPayload.length === 0) {
        toast.error("Please select at least one day")
        return
      }

      const payload = {
        shift_group_name: state.shift_group_name,
        employee: state.employee,
        days: daysPayload,
      }

      if (state.isEditing && state.editingId) {
        const result: any = await apiClient.post(`/method/update_shift_group`, {
          script_name: "update_shift_group",
          employee: state.employee,
          shift_group_name: state.shift_group_name,
          days: daysPayload,
        })
        console.log("✅ Shift group updated successfully:", result)
        toast.success("Shift group updated successfully")
      } else {
        // Create parent Shift Group first
        const createResult: any = await apiClient.post(`/resource/Shift Group`, {
          shift_group_name: state.shift_group_name,
        })

        // Then persist employee + days via method API (resource create may not write child table)
        const updateResult: any = await apiClient.post(`/method/update_shift_group`, {
          script_name: "update_shift_group",
          employee: state.employee,
          shift_group_name: state.shift_group_name,
          days: daysPayload,
        })

        console.log("✅ Shift group created successfully:", createResult)
        console.log("✅ Shift group days saved successfully:", updateResult)
        toast.success("Shift group created successfully")
      }

      setState({ 
        modal_open: false,
        isEditing: false,
        editingId: null,
        shift_group_name: "",
        employee: "",
        selectedDays: defaultSelectedDays,
        schedules: [],
      })
      
      // Refresh the shift types list
      await fetchShiftTypes()
    } catch (error) {
      console.error("Error saving shift:", error)
      toast.error(`${error instanceof Error ? error.message : 'Failed to save shift'}`)
    } finally {
      setLoading(false)
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

  const handleEditShiftType = async (shiftType: ShiftType) => {
    try {
      setLoading(true)

      const response: any = await apiClient.get(`/resource/Shift Group/${shiftType.name}`)
      const detail = response?.data

      const shiftGroupName = detail?.shift_group_name || shiftType.shift_group_name || ""
      const shiftTable = Array.isArray(detail?.shift_table) ? detail.shift_table : []

      const parseDay = (shiftSchedule: string) => {
        if (!shiftSchedule) return ""
        const parts = shiftSchedule.split(" - ")
        const last = parts[parts.length - 1]?.trim()
        return last || ""
      }

      const formatTimeForInput = (value: string) => {
        if (!value) return ""

        // API might return: "8:00:00" or "08:00:00" or "08:00"
        const parts = value.split(":")
        if (parts.length < 2) return value

        const hh = parts[0].padStart(2, "0")
        const mm = parts[1].padStart(2, "0")

        // <input type="time"> is safest with HH:MM
        return `${hh}:${mm}`
      }

      const schedules: ScheduleItem[] = shiftTable.map((row: any) => ({
        id: row.name,
        day: parseDay(row.shift_schedule) || "",
        in_time: formatTimeForInput(row.start_time || ""),
        out_time: formatTimeForInput(row.end_time || ""),
        duration: 0,
        start_date: row.start_date || "",
        end_date: row.end_date || "",
        remarks: row.shift_type || "",
      }))

      const toKey = (day: string) => day.trim().toLowerCase()
      const selectedDays = {
        ...defaultSelectedDays,
        ...schedules.reduce((acc: Record<string, boolean>, s) => {
          const key = toKey(s.day)
          if (key in defaultSelectedDays) acc[key] = true
          return acc
        }, {}),
      }

      setState({
        modal_open: true,
        isEditing: true,
        editingId: detail?.name || shiftType.name,
        name: detail?.name || shiftType.name,
        shift_group_name: shiftGroupName,
        selectedDays,
        schedules,
      })
    } catch (error) {
      console.error("Error fetching shift group details:", error)
      toast.error("Failed to load shift group details")
    } finally {
      setLoading(false)
    }
  }

  const handleViewShiftType = (shiftType: ShiftType) => {
    console.log("View shift type:", shiftType)
    toast.info(`Viewing details for: ${shiftType.name}`)
    // You can implement a view modal or navigate to a details page here
  }

  const toggleDay = (day: string) => {
    const toTitleCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
    const nextSelected = !state.selectedDays[day]

    const nextSelectedDays = {
      ...state.selectedDays,
      [day]: nextSelected,
    }

    const dayTitle = toTitleCase(day)
    const existingSchedules = state.schedules as ScheduleItem[]

    const nextSchedules = nextSelected
      ? existingSchedules.some((s) => s.day === dayTitle)
        ? existingSchedules
        : [
            ...existingSchedules,
            {
              id: day,
              day: dayTitle,
              in_time: "",
              out_time: "",
              duration: 0,
              start_date: "",
              end_date: "",
              remarks: "",
            },
          ]
      : existingSchedules.filter((s) => s.day !== dayTitle)

    setState({
      selectedDays: nextSelectedDays,
      schedules: nextSchedules,
    })
  }

  const fetchEmployees = async () => {
    try {
      const response: any = await apiClient.get(
        '/resource/Employee?fields=["name","employee_name"]&limit_page_length=0'
      )

      if (response?.data) {
        setState({ employees: response.data })
      } else {
        setState({ employees: [] })
      }
    } catch (error) {
      console.error("Error fetching employees:", error)
      toast.error("Failed to fetch employees")
    }
  }

  const addSchedule = () => {
    toast.info("Select day(s) above to add schedule details")
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
        day: "Monday",
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

  const handleDeleteSlot = async (schedule: ScheduleItem) => {
    try {
      // If creating new (not yet saved), just remove from UI
      if (!state.isEditing) {
        removeSchedule(schedule.id)
        setState({
          selectedDays: {
            ...state.selectedDays,
            [schedule.day.toLowerCase()]: false,
          },
        })
        return
      }

      if (!state.shift_group_name?.trim()) {
        toast.error("Shift group name is missing")
        return
      }

      setLoading(true)
      const result: any = await apiClient.post(`/method/delete_shift_group`, {
        shift_group_name: state.shift_group_name,
        days: [{ day: schedule.day }],
      })

      console.log("✅ Shift slot deleted successfully:", result)
      toast.success("Shift slot deleted successfully")

      // Update UI
      removeSchedule(schedule.id)
      setState({
        selectedDays: {
          ...state.selectedDays,
          [schedule.day.toLowerCase()]: false,
        },
      })
    } catch (error) {
      console.error("Error deleting shift slot:", error)
      toast.error("Failed to delete shift slot")
    } finally {
      setLoading(false)
    }
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
      label: "ID",
      searchable: true,
    },
    {
      key: "shift_group_name",
      label: "Shift Group Name",
      searchable: true,
      render: (row: unknown) => {
        const shift = row as ShiftType
        return shift.shift_group_name || "N/A"
      },
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
        onClose={() =>
          setState({
            modal_open: false,
            isEditing: false,
            editingId: null,
            shift_group_name: "",
            employee: "",
            selectedDays: defaultSelectedDays,
            schedules: [],
          })
        }
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
                <div className="col-span-12 md:col-span-6">
                  <CustomSelectField
                    name="employee"
                    label="Employee"
                    value={state.employee}
                    onChange={(e) => setState({ employee: e.target.value })}
                    placeholder="Select Employee"
                    options={(state.employees || []).map((emp: any) => ({
                      label: `${emp.employee_name} (${emp.name})`,
                      value: emp.name,
                    }))}
                  />
                </div>
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
                      <th className="p-3 border border-gray-300 text-left font-semibold">Day</th>
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
                            <div className="text-sm font-medium text-gray-800">{schedule.day}</div>
                          </td>
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
                              onClick={() => handleDeleteSlot(schedule)}
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
                        <td className="p-8 text-center text-gray-500" colSpan={10}>
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
    </div>
  )
}

export default TestPage
