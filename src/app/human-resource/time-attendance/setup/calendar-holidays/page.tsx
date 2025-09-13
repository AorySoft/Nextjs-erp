"use client"
import { useState, useEffect, useReducer } from "react"
import type React from "react"

import DashboardLayout from "@/components/shared/DashboardLayout"
import DataTable from "@/components/ui/DataTable"
import { Edit, Trash, Plus, ChevronDown, SquareUserRound ,Settings } from "lucide-react"
import { defaultColor } from "@/utils/constant"
import { toast } from "react-toastify"
import { Accordion, AccordionSummary, AccordionDetails, Grid, Typography, Button, Checkbox } from "@mui/material"
import CustomTextField from "@/components/ui/CustomTextField"
import CustomSelectField from "@/components/ui/CustomSelectField"
import MuiDialog from "@/components/ui/DialogBox"

interface CalendarHoliday {
  name: string
  code: string
  calendar_holiday: string
  payroll_period: string
  apply_on: string
  created_date: string
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
    selection_dialog: false,
    selection_type: "",
    departments: [],
    employee_types: [],
    employee_categories: [],
    holiday_periods: [],
    formFields: [
      {
        input_name: "code",
        input_label: "Code",
        placeholder: "Enter Code",
        type: "text",
        required: true,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "payroll_register",
        input_label: "Payroll Register",
        placeholder: "Select Payroll Register",
        type: "select",
        required: true,
        grid_size: 6,
        options: [
          { label: "Register 1", value: "register1" },
          { label: "Register 2", value: "register2" },
          { label: "Register 3", value: "register3" },
        ],
      },
      {
        input_name: "calendar_holiday",
        input_label: "Calendar Holiday",
        placeholder: "Enter Calendar Holiday",
        type: "text",
        required: true,
        grid_size: 12,
        isDisable: false,
      },
      {
        input_name: "apply_on",
        input_label: "Apply On",
        placeholder: "Select Apply On",
        type: "select",
        required: true,
        grid_size: 4,
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
    
    code: "",
    calendar_holiday: "",
    payroll_period: "",
    apply_on: "",
    payroll_register: "",
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

  const mockCalendarHolidays: CalendarHoliday[] = [
    {
      name: "CH001",
      code: "02",
      calendar_holiday: "2025-2026 (BMS)",
      payroll_period: "BMS 2025-26",
      apply_on: "Department",
      created_date: "2025-01-01",
    },
  ]

  const mockHolidayPeriods = [
    { year: 2026, period: "Feb - 2026", start_date: "21-Jan-2026", end_date: "20-Feb-2026" },
    { year: 2026, period: "Mar - 2026", start_date: "21-Feb-2026", end_date: "20-Mar-2026" },
    { year: 2026, period: "Apr - 2026", start_date: "21-Mar-2026", end_date: "20-Apr-2026" },
    { year: 2026, period: "May - 2026", start_date: "21-Apr-2026", end_date: "20-May-2026" },
    { year: 2026, period: "June - 2026", start_date: "21-May-2026", end_date: "20-Jun-2026" },
    { year: 2026, period: "Jul - 2026", start_date: "21-Jun-2026", end_date: "20-Jul-2026" },
    { year: 2025, period: "Aug - 2025", start_date: "21-Jul-2025", end_date: "20-Aug-2025" },
    { year: 2025, period: "Sep - 2025", start_date: "21-Aug-2025", end_date: "20-Sep-2025" },
    { year: 2025, period: "Oct - 2025", start_date: "21-Sep-2025", end_date: "20-Oct-2025" },
  ]

  const fetchCalendarHolidays = async () => {
    try {
      setLoading(true)
      setTimeout(() => {
        setCalendarHolidays(mockCalendarHolidays)
        setState({
          holiday_periods: mockHolidayPeriods,
          departments: mockDepartments,
          employee_types: mockEmployeeTypes,
          employee_categories: mockEmployeeCategories,
        })
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error fetching calendar holidays:", error)
      toast.error("Failed to fetch calendar holidays")
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

  const handleEdit = (holiday: CalendarHoliday) => {
    setSelectedHoliday(holiday)
    setState({
      ...holiday,
      holiday_dialog: true,
    })
  }

  const handleDelete = async (holiday: CalendarHoliday) => {
    if (window.confirm(`Are you sure you want to delete ${holiday.calendar_holiday}?`)) {
      try {
        setCalendarHolidays((prev) => prev.filter((item) => item.name !== holiday.name))
        toast.success("Calendar holiday deleted successfully")
      } catch (error) {
        console.error("Error deleting calendar holiday:", error)
        toast.error("Failed to delete calendar holiday")
      }
    }
  }

  const handleNewHoliday = () => {
    setSelectedHoliday(undefined)
    setState({
      holiday_dialog: true,
      code: "",
      payroll_register: "",
      calendar_holiday: "",
      payroll_period: "",
      apply_on: "",
    })
  }

  const columns = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: (row: CalendarHoliday) => (
        <div className="flex gap-2">
          <Trash size={16} color={defaultColor?.main_blue} onClick={() => handleDelete(row)} />
          <Edit size={16} color={defaultColor?.main_blue} onClick={() => handleEdit(row)} />
          <SquareUserRound size={16} color={defaultColor?.main_blue} />
        </div>
      ),
    },
    {
      key: "sno",
      label: "S.No",
      searchable: false,
      render: (_: CalendarHoliday, index: number) => index + 1,
    },
    { key: "code", label: "Code", searchable: true },
    { key: "calendar_holiday", label: "Calendar Holiday", searchable: true },
    { key: "payroll_period", label: "Payroll Period", searchable: true },
    { key: "apply_on", label: "Apply On", searchable: true },
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
        name: selectedHoliday ? selectedHoliday.name : `CH${calendarHolidays.length + 1}`,
        code: state.code,
        calendar_holiday: state.calendar_holiday,
        payroll_period: state.payroll_period,
        payroll_register: state.payroll_register,
        apply_on: state.apply_on,
        created_date: selectedHoliday ? selectedHoliday.created_date : new Date().toISOString().split("T")[0],
      }

      if (selectedHoliday) {
        setCalendarHolidays((prev) =>
          prev.map((item) => (item.name === selectedHoliday.name ? { ...send_object } : item)),
        )
        toast.success("Calendar holiday updated successfully")
      } else {
        setCalendarHolidays((prev) => [...prev, send_object])
        toast.success("Calendar holiday created successfully")
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
                <Grid container spacing={2}>
                  {state.formFields.map((field: any, idx: number) => (
                    <Grid key={idx} item xs={12} md={field.grid_size}>
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
                          onchange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setState({ [field.input_name]: e.target.value })
                          }
                          placeholder={field.placeholder}
                          input_label={field.input_label}
                          required={field.required}
                          startIcon={field.startIcon}
                        />
                      )}
                    </Grid>
                  ))}
                  <Grid item xs={12} md={2}>
  <Button
    variant="contained"
    onClick={handleApplyOnClick}
    disabled={!state.apply_on}
    startIcon={<Settings  size={16} />}
    sx={{ width: "100%", height: "40px", textTransform: "none" }}
  >
    Apply On
  </Button>
</Grid>
                </Grid>
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
                        <th className="p-3 border border-gray-300 text-left font-semibold">S.No</th>
                        <th className="p-3 border border-gray-300 text-left font-semibold">Year</th>
                        <th className="p-3 border border-gray-300 text-left font-semibold">Period</th>
                        <th className="p-3 border border-gray-300 text-left font-semibold">Start Date</th>
                        <th className="p-3 border border-gray-300 text-left font-semibold">End Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.holiday_periods?.length > 0 ? (
                        state.holiday_periods.map((row: any, index: number) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="p-3 border border-gray-300 text-center">{index + 1}</td>
                            <td className="p-3 border border-gray-300">{row.year}</td>
                            <td className="p-3 border border-gray-300">{row.period}</td>
                            <td className="p-3 border border-gray-300">{row.start_date}</td>
                            <td className="p-3 border border-gray-300">{row.end_date}</td>
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
      </div>
  )
}

export default CalendarHolidayPage
