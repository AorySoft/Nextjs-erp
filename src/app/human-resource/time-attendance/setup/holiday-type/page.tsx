"use client"
import { useState, useEffect, useReducer } from "react"
import type React from "react"

import DashboardLayout from "@/components/shared/DashboardLayout"
import DataTable from "@/components/ui/DataTable"
import { Edit, Trash, Plus, ChevronDown, SquareUserRound } from "lucide-react"
import { defaultColor } from "@/utils/constant"
import { toast } from "react-toastify"
// import apiClient from "@/services/apiClient"
import { Accordion, AccordionSummary, AccordionDetails, Grid, Typography } from "@mui/material"
import CustomTextField from "@/components/ui/CustomTextField"
import CustomSelectField from "@/components/ui/CustomSelectField"
import MuiDialog from "@/components/ui/DialogBox"

interface HolidayType {
  name: string
  holiday_name: string
  description: string
  color_code: string[]
  created_date: string
}

const HolidayTypePage = () => {
  const [holidayTypes, setHolidayTypes] = useState<HolidayType[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedHolidayType, setSelectedHolidayType] = useState<HolidayType | undefined>(undefined)

  const [state, setState] = useReducer((state: any, newState: any) => ({ ...state, ...newState }), {
    holiday_dialog: false,
    formFields: [
      {
        input_name: "name",
        input_label: "Code",
        placeholder: "Enter Code",
        type: "text",
        required: true,
        startIcon: <></>,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "holiday_name",
        input_label: "Holiday Type",
        placeholder: "Enter Holiday Type",
        type: "text",
        required: true,
        startIcon: <></>,
        grid_size: 6,
        isDisable: false,
      },
      {
        input_name: "description",
        input_label: "Description",
        placeholder: "Enter Description",
        type: "text",
        required: false,
        startIcon: <></>,
        grid_size: 12,
        isDisable: false,
      },
      {
        input_name: "color_code",
        input_label: "Color Code",
        placeholder: "Enter Color Code (e.g., 000000)",
        type: "multiple_colors",
        required: false,
        startIcon: <></>,
        grid_size: 12,
        isDisable: false,
      },
    ],
    name: "",
    holiday_name: "",
    description: "",
    color_code: ["000000"],
    currentColorInput: "",
  })

  const mockHolidayTypes: HolidayType[] = [
    {
      name: "HT001",
      holiday_name: "National Holiday",
      description: "Government declared national holidays",
      color_code: ["FF0000", "00FF00"],
      created_date: "2024-01-15",
    },
    {
      name: "HT002",
      holiday_name: "Religious Holiday",
      description: "Religious festivals and observances",
      color_code: ["0000FF", "FFFF00", "FF00FF"],
      created_date: "2024-01-20",
    },
  ]

  const fetchHolidayTypes = async () => {
    try {
      setLoading(true)
      // const response = await apiClient.get("/resource/Holiday Type?limit=100")
      // if (response && Array.isArray(response.data)) {
      //   setHolidayTypes(response.data)
      // }

      setTimeout(() => {
        setHolidayTypes(mockHolidayTypes)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error("Error fetching holiday types:", error)
      toast.error("Failed to fetch holiday types")
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHolidayTypes()
  }, [])

  const handleEdit = (holidayType: HolidayType) => {
    setSelectedHolidayType(holidayType)
    setState({
      ...holidayType,
      holiday_dialog: true,
      color_code: Array.isArray(holidayType.color_code) ? holidayType.color_code : [holidayType.color_code],
      currentColorInput: "",
    })
  }

  const handleDelete = async (holidayType: HolidayType) => {
    if (window.confirm(`Are you sure you want to delete ${holidayType.holiday_name}?`)) {
      try {
        // await apiClient.delete(`/resource/Holiday Type/${holidayType.name}`)
        setHolidayTypes((prev) => prev.filter((item) => item.name !== holidayType.name))
        toast.success("Holiday type deleted successfully")
      } catch (error) {
        console.error("Error deleting holiday type:", error)
        toast.error("Failed to delete holiday type")
      }
    }
  }

  const handleNewHoliday = () => {
    setSelectedHolidayType(undefined)
    setState({
      holiday_dialog: true,
      name: "",
      holiday_name: "",
      description: "",
      color_code: ["000000"],
      currentColorInput: "",
    })
  }

  const columns:any = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: (row: HolidayType) => (
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
      render: (row: HolidayType, index: number) => index + 1,
    },
    { key: "name", label: "Code", searchable: true },
    { key: "holiday_name", label: "Holiday Type", searchable: true },
    {
      key: "color_code",
      label: "Color Code",
      searchable: true,
      render: (row: HolidayType) => (
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {row.color_code.map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 border border-gray-300 rounded"
                style={{ backgroundColor: `#${color.replace("#", "")}` }}
                title={`#${color.replace("#", "")}`}
              ></div>
            ))}
          </div>
          <span className="text-sm">{row.color_code.map((color) => `#${color.replace("#", "")}`).join(", ")}</span>
        </div>
      ),
    },
  ]

  const validateForm = (formFields: any[], formState: any) => {
    for (const field of formFields) {
      if (field.required && field.isDisable == false) {
        const value = formState[field.input_name]
        if (!value || value.toString().trim() === "") {
          toast.error(`${field.input_label} is required`)
          return false
        }
      }
    }
    return true
  }

  const addColor = () => {
    const colorValue = state.currentColorInput
      .replace("#", "")
      .replace(/[^0-9A-Fa-f]/g, "")
      .slice(0, 6)
    if (colorValue.length === 6 && !state.color_code.includes(colorValue)) {
      setState({
        color_code: [...state.color_code, colorValue],
        currentColorInput: "",
      })
    }
  }

  const removeColor = (index: number) => {
    setState({
      color_code: state.color_code.filter((_: string, i: number) => i !== index),
    })
  }

  const handleCreateHolidayType = async () => {
    try {
      const isValid = validateForm(state?.formFields, state)
      if (!isValid) return

      const send_object = {
        name: state.name,
        holiday_name: state.holiday_name,
        description: state.description,
        color_code: state.color_code,
      }

      if (selectedHolidayType) {
        setHolidayTypes((prev) =>
          prev.map((item) =>
            item.name === selectedHolidayType.name ? { ...send_object, created_date: item.created_date } : item,
          ),
        )
        toast.success("Holiday type updated successfully")
      } else {
        const newHolidayType = {
          ...send_object,
          created_date: new Date().toISOString().split("T")[0],
        }
        setHolidayTypes((prev) => [...prev, newHolidayType])
        toast.success("Holiday type created successfully")
      }

      setState({ holiday_dialog: false })
      setSelectedHolidayType(undefined)
    } catch (error) {
      console.error("Error saving holiday type:", error)
      toast.error("Failed to save holiday type")
    }
  }

  return (
    <DashboardLayout>
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Holiday Type</h1>
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
            <div className="text-gray-600">Loading holiday types...</div>
          </div>
        ) : (
          <DataTable columns={columns} data={holidayTypes} />
        )}
{/* 
        <HolidayTypeModal
        /> */}

        <MuiDialog
          open={state?.holiday_dialog}
          onClose={() => {
            setState({ holiday_dialog: false })
          }}
          multiple_btn={true}
          title="Holiday Type"
          description={false}
          maxWidth="lg"
          onSave={() => handleCreateHolidayType()}
        >
          <div id="holiday-type-parent">
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
                  <Grid
                    size={{
                      xs: 12,
                      md: 12,
                    }}
                    container
                    spacing={2}
                    key="holiday_type_data"
                  >
                    {state?.formFields?.map((field: any, index: number) => {
                      return (
                        <Grid
                          key={field.input_name || index}
                          size={{
                            xs: 12,
                            md: field.grid_size,
                          }}
                        >
                          {field?.type === "select" ? (
                            <CustomSelectField
                              name={field.input_name}
                              label={field.input_label}
                              value={state[field.input_name]}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  [field.input_name]: e.target.value,
                                })
                              }
                              placeholder={field.placeholder}
                              options={field.options}
                              required={field.required}
                            />
                          ) : field?.input_name === "color_code" ? (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {field.input_label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </label>

                              {/* Current colors display */}
                              <div className="mb-3">
                                <div className="flex flex-wrap gap-2">
                                  {state.color_code.map((color: string, index: number) => (
                                    <div key={index} className="flex items-center gap-2 bg-gray-100 p-2 rounded">
                                      <div
                                        className="w-6 h-6 border border-gray-300 rounded"
                                        style={{ backgroundColor: `#${color.replace("#", "")}` }}
                                      />
                                      <span className="text-sm">#{color}</span>
                                      <button
                                        type="button"
                                        onClick={() => removeColor(index)}
                                        className="text-red-500 hover:text-red-700 text-sm font-bold"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Add new color */}
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={state.currentColorInput}
                                  onChange={(e) => {
                                    const value = e.target.value
                                      .replace("#", "")
                                      .replace(/[^0-9A-Fa-f]/g, "")
                                      .slice(0, 6)
                                    setState({ currentColorInput: value })
                                  }}
                                  placeholder="000000"
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  maxLength={6}
                                  onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault()
                                      addColor()
                                    }
                                  }}
                                />
                                <div
                                  className="w-8 h-8 border border-gray-300 rounded"
                                  style={{
                                    backgroundColor: `#${(state.currentColorInput || "000000").padEnd(6, "0")}`,
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={addColor}
                                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          ) : (
                            <CustomTextField
                              input_value={state[field.input_name]}
                              onchange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                                setState({
                                  ...state,
                                  [field.input_name]: e.target.value,
                                })
                              }
                              required={field.required}
                              input_name={field.input_name}
                              error={!state[field.input_name]}
                              startIcon={field.startIcon}
                              placeholder={field.placeholder}
                              input_label={field.input_label}
                              isDisable={field.isDisable}
                            />
                          )}
                        </Grid>
                      )
                    })}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </div>
        </MuiDialog>
      </div>
    </DashboardLayout>
  )
}

export default HolidayTypePage
