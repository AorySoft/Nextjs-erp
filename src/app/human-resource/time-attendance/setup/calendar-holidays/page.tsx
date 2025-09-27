"use client"
import { useState, useEffect, useReducer } from "react"
import type React from "react"

import DataTable from "@/components/ui/DataTable"
import { Edit, Trash, Plus, ChevronDown, SquareUserRound ,Settings } from "lucide-react"
import { defaultColor } from "@/utils/constant"
import { toast } from "react-toastify"
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Checkbox } from "@mui/material"
import CustomTextField from "@/components/ui/CustomTextField"
import CustomSelectField from "@/components/ui/CustomSelectField"
import MuiDialog from "@/components/ui/DialogBox"
// Remove direct API imports - we'll use fetch instead

interface CalendarHoliday {
  name: string
  holiday_list_name: string
  custom_payroll_period: string | null
  custom_apply_on: string | null
}

interface SelectionItem {
  id: string
  code: string
  name: string
  selected: boolean
}

const CalendarHolidayPage = () => {
  const [calendarHolidays, setCalendarHolidays] = useState<CalendarHoliday[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedHoliday, setSelectedHoliday] = useState<CalendarHoliday | undefined>(undefined)

  const [state, setState] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {
    holiday_dialog: false,
    new_holiday_dialog: false,
    selection_dialog: false,
    delete_dialog: false,
    rename_dialog: false,
    edit_holiday_period_dialog: false,
    delete_holiday_period_dialog: false,
    selected_holiday: null,
    selected_holiday_period: null,
    selected_holiday_period_index: null,
    new_holiday_name: "",
    new_holiday_list_name: "",
    new_from_date: "",
    new_to_date: "",
    holiday_period_description: "",
    selection_type: "",
    departments: [],
    employee_types: [],
    employee_categories: [],
    holiday_periods: [],
    formFields: [
      {
        input_name: "holiday_name",
        input_label: "Name",
        placeholder: "Enter Holiday Name",
        type: "text",
        required: true,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "calendar_holiday",
        input_label: "Holiday List Name",
        placeholder: "Enter Holiday List Name",
        type: "text",
        required: true,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "apply_on",
        input_label: "Apply On",
        placeholder: "Select Apply On",
        type: "select",
        required: false,
        grid_size: 6,
        options: [
          { label: "Department", value: "Department" },
          { label: "Employee Type", value: "Employee Type" },
          { label: "Employee Category", value: "Employee Category" },
        ],
      },
      {
        input_name: "payroll_period",
        input_label: "Payroll Period",
        placeholder: "Select Payroll Period",
        type: "select",
        required: true,
        grid_size: 6,
        options: [
          { label: "BMS 2025-26", value: "BMS 2025-26" },
          { label: "BMS 2026-27", value: "BMS 2026-27" },
        ],
      },
    ],
    
    holiday_name: "",
    calendar_holiday: "",
    payroll_period: "",
    apply_on: "",
  })

  const mockDepartments: SelectionItem[] = [
    { id: "1", code: "AM", name: "Academic", selected: false },
    { id: "2", code: "ACC", name: "Accounts", selected: false },
    { id: "3", code: "AD", name: "Admin", selected: false },
    { id: "4", code: "HR", name: "Human Resources", selected: false },
    { id: "5", code: "IT", name: "Information Technology", selected: false },
    { id: "6", code: "DS", name: "Domestic Staff", selected: false },
    { id: "7", code: "RDD", name: "Resource Development Department", selected: false },
    { id: "8", code: "EXCOM", name: "Excom", selected: false },
    { id: "9", code: "PR", name: "Purchase Dept", selected: false },
  ]

  const mockEmployeeTypes: SelectionItem[] = [
    { id: "1", code: "FT", name: "Full Time", selected: false },
    { id: "2", code: "PT", name: "Part Time", selected: false },
    { id: "3", code: "CT", name: "Contract", selected: false },
    { id: "4", code: "IN", name: "Intern", selected: false },
  ]

  const mockEmployeeCategories: SelectionItem[] = [
    { id: "1", code: "TC", name: "Teaching", selected: false },
    { id: "2", code: "NTC", name: "Non-Teaching", selected: false },
    { id: "3", code: "ADM", name: "Administrative", selected: false },
    { id: "4", code: "SUP", name: "Support", selected: false },
  ]


  const mockHolidayPeriods = [
    { id: "holiday-1", year: 2026, period: "Feb - 2026", start_date: "21-Jan-2026", end_date: "20-Feb-2026", description: "February Holiday Period" },
    { id: "holiday-2", year: 2026, period: "Mar - 2026", start_date: "21-Feb-2026", end_date: "20-Mar-2026", description: "March Holiday Period" },
    { id: "holiday-3", year: 2026, period: "Apr - 2026", start_date: "21-Mar-2026", end_date: "20-Apr-2026", description: "April Holiday Period" },
    { id: "holiday-4", year: 2026, period: "May - 2026", start_date: "21-Apr-2026", end_date: "20-May-2026", description: "May Holiday Period" },
    { id: "holiday-5", year: 2026, period: "June - 2026", start_date: "21-May-2026", end_date: "20-Jun-2026", description: "June Holiday Period" },
    { id: "holiday-6", year: 2026, period: "Jul - 2026", start_date: "21-Jun-2026", end_date: "20-Jul-2026", description: "July Holiday Period" },
    { id: "holiday-7", year: 2025, period: "Aug - 2025", start_date: "21-Jul-2025", end_date: "20-Aug-2025", description: "August Holiday Period" },
    { id: "holiday-8", year: 2025, period: "Sep - 2025", start_date: "21-Aug-2025", end_date: "20-Sep-2025", description: "September Holiday Period" },
    { id: "holiday-9", year: 2025, period: "Oct - 2025", start_date: "21-Sep-2025", end_date: "20-Oct-2025", description: "October Holiday Period" },
  ]

  const fetchCalendarHolidays = async () => {
    try {
      setLoading(true)
      console.log("Fetching holiday lists from API route...")
      
      const response = await fetch('/api/holiday-lists')
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch holiday lists')
      }
      
      if (result.success && result.data) {
        setCalendarHolidays(result.data)
        console.log("✅ Holiday lists fetched successfully:", result.data)
      } else {
        setCalendarHolidays([])
        console.log("No holiday lists found")
      }
      
        setState({
          departments: mockDepartments,
          employee_types: mockEmployeeTypes,
          employee_categories: mockEmployeeCategories,
        })
        setLoading(false)
    } catch (error) {
      console.error("Error fetching calendar holidays:", error)
      
      // Handle specific permission errors
      if (error instanceof Error && error.message.includes('Permission denied')) {
        toast.error("Access Denied: You don't have permission to view Holiday Lists. Please contact your administrator to grant access to the 'Holiday List' doctype.")
      } else {
      toast.error("Failed to fetch calendar holidays")
      }
      
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCalendarHolidays()
  }, [])

  const handleApplyOnClick = () => {
    if (!state.apply_on) {
      toast.error("Please select Apply On type first")
      return
    }
    setState({
      selection_dialog: true,
      selection_type: state.apply_on,
    })
  }

  const handleSelectionToggle = (id: string) => {
    const stateKey =
      state.selection_type === "Department"
        ? "departments"
        : state.selection_type === "Employee Type"
          ? "employee_types"
          : "employee_categories"

    setState({
      [stateKey]: state[stateKey].map((item: SelectionItem) =>
        item.id === id ? { ...item, selected: !item.selected } : item,
      ),
    })
  }

  const getCurrentSelectionItems = () => {
    switch (state.selection_type) {
      case "Department":
        return state.departments
      case "Employee Type":
        return state.employee_types
      case "Employee Category":
        return state.employee_categories
      default:
        return []
    }
  }

  const handleRenameClick = (holiday: CalendarHoliday) => {
    setState({
      rename_dialog: true,
      selected_holiday: holiday,
      new_holiday_name: "" // Start with empty field for new name
    })
  }

  const handleRenameConfirm = async () => {
    if (!state.selected_holiday || !state.new_holiday_name.trim()) {
      toast.error("Please enter a new name for the holiday list")
      return
    }

    if (state.new_holiday_name.trim() === state.selected_holiday.name?.trim()) {
      toast.error("New name must be different from the current name")
      return
    }

    try {
      const response = await fetch('/api/holiday-lists', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          old_name: state.selected_holiday.name,
          new_name: state.new_holiday_name
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to rename holiday list')
      }
      
      // Update the local state with the new name
      setCalendarHolidays((prev) =>
        prev.map((item) => 
          item.name === state.selected_holiday.name 
            ? { ...item, holiday_list_name: state.new_holiday_name }
            : item
        )
      )
      
      toast.success("Holiday list renamed successfully")
      setState({ rename_dialog: false, selected_holiday: null, new_holiday_name: "" })
      
      // Refetch the data to get updated information from server
      await fetchCalendarHolidays()
    } catch (error) {
      console.error("Error renaming holiday list:", error)
      toast.error("Failed to rename holiday list")
    }
  }

  const loadHolidayPeriods = async (holidayListName: string) => {
    try {
      console.log("Loading holiday periods for:", holidayListName)
      
      const response = await fetch(`/api/holiday-lists/${encodeURIComponent(holidayListName)}`)
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch holiday periods')
      }
      
      if (result.success && result.data && result.data.holidays) {
        // Transform the holidays data to match our table structure
        const holidayPeriods = result.data.holidays.map((holiday: any) => ({
          id: holiday.name, // Use the name field as ID
          year: new Date(holiday.holiday_date).getFullYear(),
          period: new Date(holiday.holiday_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          start_date: holiday.holiday_date,
          end_date: holiday.holiday_date,
          description: holiday.description || "",
          holiday_date: holiday.holiday_date,
          weekly_off: holiday.weekly_off
        }))
        
        setState({ holiday_periods: holidayPeriods })
        console.log("✅ Holiday periods loaded:", holidayPeriods)
      } else {
        setState({ holiday_periods: [] })
        console.log("No holiday periods found")
      }
    } catch (error) {
      console.error("Error loading holiday periods:", error)
      setState({ holiday_periods: [] })
      toast.error("Failed to load holiday periods")
    }
  }

  const handleEdit = async (holiday: CalendarHoliday) => {
    setSelectedHoliday(holiday)
    setState({
      holiday_name: holiday.name || "",
      calendar_holiday: holiday.holiday_list_name || "",
      payroll_period: holiday.custom_payroll_period || "",
      apply_on: holiday.custom_apply_on || "",
      holiday_dialog: true,
    })
    
    // Load holiday periods from API
    await loadHolidayPeriods(holiday.name)
    
    // Load other data
    setState({
      departments: mockDepartments,
      employee_types: mockEmployeeTypes,
      employee_categories: mockEmployeeCategories,
    })
  }

  const handleDeleteClick = (holiday: CalendarHoliday) => {
    setState({
      delete_dialog: true,
      selected_holiday: holiday
    })
  }

  const handleDeleteConfirm = async () => {
    if (!state.selected_holiday) return

    try {
      const response = await fetch(`/api/holiday-lists?name=${encodeURIComponent(state.selected_holiday.name)}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete holiday list')
      }
      
      setCalendarHolidays((prev) => prev.filter((item) => item.name !== state.selected_holiday.name))
        toast.success("Calendar holiday deleted successfully")
      setState({ delete_dialog: false, selected_holiday: null })
      
      // Refetch the data to get updated information from server
      await fetchCalendarHolidays()
      } catch (error) {
        console.error("Error deleting calendar holiday:", error)
        toast.error("Failed to delete calendar holiday")
    }
  }

  const handleNewHoliday = () => {
    setState({
      new_holiday_dialog: true,
      new_holiday_list_name: "",
      new_from_date: "",
      new_to_date: "",
    })
  }

  const handleCreateNewHoliday = async () => {
    if (!state.new_holiday_list_name.trim()) {
      toast.error("Please enter a holiday list name")
      return
    }

    if (!state.new_from_date) {
      toast.error("Please select a from date")
      return
    }

    if (!state.new_to_date) {
      toast.error("Please select a to date")
      return
    }

    try {
      const response = await fetch('/api/holiday-lists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          holiday_list_name: state.new_holiday_list_name,
          from_date: state.new_from_date,
          to_date: state.new_to_date
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create holiday list')
      }
      
      toast.success("Holiday list created successfully")
      setState({ 
        new_holiday_dialog: false, 
        new_holiday_list_name: "", 
        new_from_date: "", 
        new_to_date: "" 
      })
      
      // Refetch the data to get updated information from server
      await fetchCalendarHolidays()
    } catch (error) {
      console.error("Error creating holiday list:", error)
      toast.error("Failed to create holiday list")
    }
  }

  const handleHolidayPeriodEdit = (period: any, index: number) => {
    setState({
      edit_holiday_period_dialog: true,
      selected_holiday_period: period,
      holiday_period_description: period.description || ""
    })
  }

  const handleHolidayPeriodUpdate = async () => {
    if (!state.selected_holiday_period || !state.holiday_period_description.trim()) {
      toast.error("Please enter a description")
      return
    }

    try {
      // Use the holiday period ID for the API call
      const holidayId = state.selected_holiday_period.id || state.selected_holiday_period.name
      
      console.log("Selected holiday period:", state.selected_holiday_period)
      console.log("Holiday ID:", holidayId)
      
      if (!holidayId) {
        toast.error("Holiday period ID not found")
        return
      }
      
      const response = await fetch(`/api/holiday-periods/${holidayId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: state.holiday_period_description
        })
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update holiday period')
      }
      
      // Update local state
      setState({
        holiday_periods: state.holiday_periods.map((period: any, index: number) => 
          period === state.selected_holiday_period 
            ? { ...period, description: state.holiday_period_description }
            : period
        )
      })
      
      toast.success("Holiday period updated successfully")
      setState({ 
        edit_holiday_period_dialog: false, 
        selected_holiday_period: null, 
        holiday_period_description: "" 
      })
    } catch (error) {
      console.error("Error updating holiday period:", error)
      toast.error("Failed to update holiday period")
    }
  }

  const handleHolidayPeriodDelete = (period: any, index: number) => {
    setState({
      delete_holiday_period_dialog: true,
      selected_holiday_period: period,
      selected_holiday_period_index: index
    })
  }

  const handleHolidayPeriodDeleteConfirm = async () => {
    try {
      console.log("Delete holiday period:", state.selected_holiday_period)
      
      const holidayId = state.selected_holiday_period.id || state.selected_holiday_period.name
      if (!holidayId) {
        toast.error("Holiday period ID not found")
        return
      }
      
      const response = await fetch(`/api/holiday-periods/${holidayId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete holiday period')
      }
      
      // Remove from local state after successful API call
      setState({
        holiday_periods: state.holiday_periods.filter((_: any, i: number) => i !== state.selected_holiday_period_index)
      })
      
      toast.success("Holiday period deleted successfully")
      setState({ 
        delete_holiday_period_dialog: false, 
        selected_holiday_period: null,
        selected_holiday_period_index: null
      })
    } catch (error) {
      console.error("Error deleting holiday period:", error)
      toast.error("Failed to delete holiday period")
    }
  }

  const columns = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: (row: unknown, index: number) => {
        const holiday = row as CalendarHoliday
        return (
        <div className="flex gap-2">
            <Trash size={16} color={defaultColor?.main_blue} onClick={() => handleDeleteClick(holiday)} />
            <Edit size={16} color={defaultColor?.main_blue} onClick={() =>  handleEdit(holiday) } />
            <SquareUserRound size={16} color={defaultColor?.main_blue} onClick={() =>{}} />
        </div>
        )
      },
    },
    {
      key: "sno",
      label: "S.No",
      searchable: false,
      render: (_: unknown, index: number) => index + 1,
    },
    { key: "name", label: "Name", searchable: true },
    { key: "holiday_list_name", label: "Holiday List Name", searchable: true },
    { key: "custom_payroll_period", label: "Payroll Period", searchable: true },
    { key: "custom_apply_on", label: "Apply On", searchable: true },
  ]

  const validateForm = (formFields: any[], formState: any) => {
    for (const field of formFields) {
      if (field.required && !formState[field.input_name]) {
        toast.error(`${field.input_label} is required`)
        return false
      }
    }
    return true
  }

  const handleCreateHoliday = async () => {
    try {
      const isValid = validateForm(state?.formFields, state)
      if (!isValid) return

      const send_object = {
        holiday_list_name: state.calendar_holiday,
        custom_payroll_period: state.payroll_period,
        custom_apply_on: state.apply_on,
      }

      let response: Response
      let result: { success?: boolean; data?: any; error?: string }

      if (selectedHoliday) {
        // Check if the name has changed and handle rename if needed
        if (state.holiday_name.trim() !== selectedHoliday.name?.trim()) {
          // First rename the holiday list
          const renameResponse = await fetch('/api/holiday-lists', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              old_name: selectedHoliday.name,
              new_name: state.holiday_name
            })
          })
          
          const renameResult = await renameResponse.json()
          
          if (!renameResponse.ok) {
            throw new Error(renameResult.error || 'Failed to rename holiday list')
          }
          
          // Update the selectedHoliday name for the subsequent update call
          selectedHoliday.name = state.holiday_name
        }

        // Update existing holiday list
        response = await fetch(`/api/holiday-lists?name=${encodeURIComponent(selectedHoliday.name)}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(send_object)
        })
        result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to update holiday list')
        }
        
        setCalendarHolidays((prev) =>
          prev.map((item) => (item.name === selectedHoliday.name ? { ...item, ...send_object, name: state.holiday_name } : item)),
        )
        toast.success("Calendar holiday updated successfully")
        
        // Refetch the data to get updated information from server
        await fetchCalendarHolidays()
      } else {
        // Create new holiday list
        response = await fetch('/api/holiday-lists', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(send_object)
        })
        result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Failed to create holiday list')
        }
        
        setCalendarHolidays((prev) => [...prev, result.data])
        toast.success("Calendar holiday created successfully")
        
        // Refetch the data to get updated information from server
        await fetchCalendarHolidays()
      }

      setState({ holiday_dialog: false })
      setSelectedHoliday(undefined)
    } catch (error) {
      console.error("Error saving calendar holiday:", error)
      toast.error("Failed to save calendar holiday")
    }
  }

  return (
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Calendar Holidays</h1>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={handleNewHoliday}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              New
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Loading calendar holidays...</div>
          </div>
        ) : (
          <DataTable columns={columns} data={calendarHolidays} />
        )}

        <MuiDialog
          open={state.holiday_dialog}
          onClose={() => setState({ holiday_dialog: false })}
          multiple_btn={true}
          title="Calendar Holidays"
          maxWidth="lg"
          onSave={handleCreateHoliday}
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
                        />
                      )}
                    </div>
                  ))}
                  <div className="col-span-12 md:col-span-2">
  <Button
    variant="contained"
    onClick={handleApplyOnClick}
    disabled={!state.apply_on}
    startIcon={<Settings  size={16} />}
    sx={{ width: "100%", height: "40px", textTransform: "none" }}
  >
    Apply On
  </Button>
</div>
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
                                    onClick={() => handleHolidayPeriodEdit(row, index)}
                                    title="Edit holiday period"
                                  >
                                    <Edit
                                      size={16}
                                      color={defaultColor?.main_blue}
                                    />
                                  </button>
                                  <button 
                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                    onClick={() => handleHolidayPeriodDelete(row, index)}
                                    title="Delete holiday period"
                                  >
                                    <Trash
                                      size={16}
                                      color={defaultColor?.main_blue}
                                    />
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

        <MuiDialog
          open={state.selection_dialog}
          onClose={() => setState({ selection_dialog: false })}
          multiple_btn={true}
          title={state.selection_type}
          maxWidth="md"
          onSave={() => setState({ selection_dialog: false })}
        >
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 border border-gray-300 text-left font-semibold">
                      <Checkbox
                        onChange={(e) => {
                          const stateKey =
                            state.selection_type === "Department"
                              ? "departments"
                              : state.selection_type === "Employee Type"
                                ? "employee_types"
                                : "employee_categories"
                          setState({
                            [stateKey]: state[stateKey].map((item: SelectionItem) => ({
                              ...item,
                              selected: e.target.checked,
                            })),
                          })
                        }}
                      />
                    </th>
                    <th className="p-3 border border-gray-300 text-left font-semibold">S.No</th>
                    <th className="p-3 border border-gray-300 text-left font-semibold">Code</th>
                    <th className="p-3 border border-gray-300 text-left font-semibold">{state.selection_type}</th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentSelectionItems().map((item: SelectionItem, index: number) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-3 border border-gray-300 text-center">
                        <Checkbox checked={item.selected} onChange={() => handleSelectionToggle(item.id)} />
                      </td>
                      <td className="p-3 border border-gray-300 text-center">{index + 1}</td>
                      <td className="p-3 border border-gray-300">{item.code}</td>
                      <td className="p-3 border border-gray-300">{item.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </MuiDialog>

        {/* Delete Confirmation Modal */}
        <MuiDialog 
          open={state?.delete_dialog} 
          multiple_btn={false}
          title="Delete Confirmation"
          description={false}
          maxWidth="sm"
          onClose={() => setState({ delete_dialog: false, selected_holiday: null })}
        >
          <div className="p-4">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Delete Confirmation
            </h2>
        
            {/* Message */}
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete <strong>"{state.selected_holiday?.holiday_list_name}"</strong>? This action cannot be undone.
            </p>
        
            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setState({ delete_dialog: false, selected_holiday: null })}
              >
                Cancel
              </button>
        
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </MuiDialog>

        {/* Rename Modal */}
        <MuiDialog 
          open={state?.rename_dialog} 
          multiple_btn={false}
          title="Rename Holiday List"
          description={false}
          maxWidth="sm"
          onClose={() => setState({ rename_dialog: false, selected_holiday: null, new_holiday_name: "" })}
        >
          <div className="p-4">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Rename Holiday List
            </h2>
        
            {/* Current Name Display */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Name
              </label>
              <div className="p-2 bg-gray-100 rounded border text-sm text-gray-600">
                {state.selected_holiday?.name || 'N/A'}
              </div>
            </div>

            {/* New Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Name
              </label>
              <input
                type="text"
                value={state.new_holiday_name}
                onChange={(e) => setState({ new_holiday_name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new holiday list name"
                autoFocus
              />
            </div>
        
            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setState({ rename_dialog: false, selected_holiday: null, new_holiday_name: "" })}
              >
                Cancel
              </button>
        
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleRenameConfirm}
              >
                Rename
              </button>
            </div>
          </div>
        </MuiDialog>

        {/* New Holiday List Modal */}
        <MuiDialog 
          open={state?.new_holiday_dialog} 
          multiple_btn={false}
          title="Create New Holiday List"
          description={false}
          maxWidth="sm"
          onClose={() => setState({ 
            new_holiday_dialog: false, 
            new_holiday_list_name: "", 
            new_from_date: "", 
            new_to_date: "" 
          })}
        >
          <div className="p-4">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Create New Holiday List
            </h2>
        
            {/* Holiday List Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holiday List Name *
              </label>
              <input
                type="text"
                value={state.new_holiday_list_name}
                onChange={(e) => setState({ new_holiday_list_name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter holiday list name"
                autoFocus
              />
            </div>

            {/* From Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date *
              </label>
              <input
                type="date"
                value={state.new_from_date}
                onChange={(e) => setState({ new_from_date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* To Date */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date *
              </label>
              <input
                type="date"
                value={state.new_to_date}
                onChange={(e) => setState({ new_to_date: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
        
            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setState({ 
                  new_holiday_dialog: false, 
                  new_holiday_list_name: "", 
                  new_from_date: "", 
                  new_to_date: "" 
                })}
              >
                Cancel
              </button>
        
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleCreateNewHoliday}
              >
                Create
              </button>
            </div>
          </div>
        </MuiDialog>

        {/* Edit Holiday Period Modal */}
        <MuiDialog 
          open={state?.edit_holiday_period_dialog} 
          multiple_btn={false}
          title="Edit Holiday Period"
          description={false}
          maxWidth="sm"
          onClose={() => setState({ 
            edit_holiday_period_dialog: false, 
            selected_holiday_period: null, 
            holiday_period_description: "" 
          })}
        >
          <div className="p-4">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Edit Holiday Period
            </h2>
        
            {/* Date Info Display */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holiday Date
              </label>
              <div className="p-2 bg-gray-100 rounded border text-sm text-gray-600">
                {state.selected_holiday_period?.holiday_date || 'N/A'}
              </div>
            </div>

            {/* Current Description Display */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Description
              </label>
              <div className="p-2 bg-gray-100 rounded border text-sm">
                <div 
                  dangerouslySetInnerHTML={{ __html: state.selected_holiday_period?.description || '' }}
                  className="prose prose-sm max-w-none"
                />
              </div>
            </div>

            {/* Description Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Description *
              </label>
              <textarea
                value={state.holiday_period_description}
                onChange={(e) => setState({ holiday_period_description: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new holiday description"
                rows={3}
                autoFocus
              />
            </div>
        
            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setState({ 
                  edit_holiday_period_dialog: false, 
                  selected_holiday_period: null, 
                  holiday_period_description: "" 
                })}
              >
                Cancel
              </button>
        
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleHolidayPeriodUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </MuiDialog>

        {/* Delete Holiday Period Confirmation Modal */}
        <MuiDialog 
          open={state?.delete_holiday_period_dialog} 
          multiple_btn={false}
          title="Delete Holiday Period"
          description={false}
          maxWidth="sm"
          onClose={() => setState({ 
            delete_holiday_period_dialog: false, 
            selected_holiday_period: null,
            selected_holiday_period_index: null
          })}
        >
          <div className="p-4">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Delete Holiday Period
            </h2>
        
            {/* Warning Message */}
            <div className="mb-6">
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    Are you sure you want to delete this holiday period?
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    This action cannot be undone. The holiday period will be permanently removed.
                  </p>
                </div>
              </div>
            </div>

            {/* Holiday Period Details */}
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>
                    <p className="text-gray-900">{state.selected_holiday_period?.holiday_date || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Description:</span>
                    <div 
                      dangerouslySetInnerHTML={{ __html: state.selected_holiday_period?.description || 'N/A' }}
                      className="text-gray-900 prose prose-sm max-w-none"
                    />
                  </div>
                </div>
              </div>
            </div>
        
            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                onClick={() => setState({ 
                  delete_holiday_period_dialog: false, 
                  selected_holiday_period: null,
                  selected_holiday_period_index: null
                })}
              >
                Cancel
              </button>
        
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleHolidayPeriodDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </div>
        </MuiDialog>
      </div>
  )
}

export default CalendarHolidayPage
