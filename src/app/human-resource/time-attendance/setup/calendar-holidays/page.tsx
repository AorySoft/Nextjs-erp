"use client"
import { useState, useEffect, useReducer } from "react"
import type React from "react"

import DashboardLayout from "@/components/shared/DashboardLayout"
import DataTable from "@/components/ui/DataTable"
import { Edit, Trash, Plus, ChevronDown, SquareUserRound } from "lucide-react"
import { defaultColor } from "@/utils/constant"
import { toast } from "react-toastify"
import { Accordion, AccordionSummary, AccordionDetails, Grid, Typography } from "@mui/material"
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

const CalendarHolidayPage = () => {
  const [calendarHolidays, setCalendarHolidays] = useState<CalendarHoliday[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedHoliday, setSelectedHoliday] = useState<CalendarHoliday | undefined>(undefined)

  const [state, setState] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {
    holiday_dialog: false,
    formFields: [
      {
        input_name: "code",
        input_label: "Code",
        placeholder: "Enter Code",
        type: "text",
        required: true,
        startIcon: <></>,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "payroll_register",
        input_label: "Payroll Register",
        placeholder: "Enter Payroll Register",
        type: "text", // 
        required: true,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "calendar_holiday",
        input_label: "Calendar Holiday",
        placeholder: "Enter Calendar Holiday",
        type: "text",
        required: true,
        startIcon: <></>,
        grid_size: 6,
        isDisable: false,
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
      {
        input_name: "apply_on",
        input_label: "Apply On",
        placeholder: "Select Apply On",
        type: "select",
        required: true,
        grid_size: 6,
        options: [
          { label: "Department", value: "Department" },
          { label: "Employee", value: "Employee" },
          { label: "Company-wide", value: "Company-wide" },
        ],
      },
    ],
    code: "",
    calendar_holiday: "",
    payroll_period: "",
    apply_on: "",
  })

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

  const fetchCalendarHolidays = async () => {
    try {
      setLoading(true)
      setTimeout(() => {
        setCalendarHolidays(mockCalendarHolidays)
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
      payroll_register: "",   // 👈 
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
       <Trash size={16} color={defaultColor?.main_blue} />
          <Edit size={16} color={defaultColor?.main_blue} />
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
        payroll_register: state.payroll_register, // 👈 new field
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
    <DashboardLayout>
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
              New Calendar Holiday
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
          title="Calendar Holiday"
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
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
          </div>
          <Accordion defaultExpanded>
  <AccordionSummary expandIcon={<ChevronDown />} sx={{ backgroundColor: defaultColor.main_grey }}>
    <Typography fontWeight={600}>Holiday Periods</Typography>
    </AccordionSummary>
    <AccordionDetails>
    <table className="w-full border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">S.No</th>
          <th className="p-2 border">Year</th>
          <th className="p-2 border">Period</th>
          <th className="p-2 border">Start Date</th>
          <th className="p-2 border">End Date</th>
        </tr>
      </thead>
      <tbody>
        {state.holiday_periods?.length > 0 ? (
          state.holiday_periods.map((row: any, index: number) => (
            <tr key={index}>
              <td className="p-2 border text-center">{index + 1}</td>
              <td className="p-2 border">{row.year}</td>
              <td className="p-2 border">{row.period}</td>
              <td className="p-2 border">{row.start_date}</td>
              <td className="p-2 border">{row.end_date}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td className="p-2 border text-center" colSpan={5}>
              No records found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </AccordionDetails>
</Accordion>
        </MuiDialog>
      </div>
    </DashboardLayout>
  )
}

export default CalendarHolidayPage
