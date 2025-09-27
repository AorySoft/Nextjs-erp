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
import apiClient from "@/services/apiClient";

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
        required: false,
        startIcon: <></>,
        grid_size: 6,
        isDisable: true,
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
          { value: "Leave Adjustment", label: "Leave Adjustment" },
          { value:"Encashment Leave", label: "Encashment Leave" },
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
      // {
      //   input_name: "employee",
      //   input_label: "Employee",
      //   placeholder: "Select employee",
      //   type: "select",
      //   required: true,
      //   startIcon: <SquareUserRound size={16} />,
      //   grid_size: 6,
      //   isDisable: false,
      //   options: [
      //     { value: "anees_ur_rehman", label: "Anees ur Rehman" },
      //     { value: "muhammad", label: "Muhammad" },
      //     { value: "rehan", label: "Rehan" },
      //     { value: "junaid_iqbal", label: "Junaid Iqbal" },
      //   ],
      // },
      {
        input_name: "department",
        input_label: "Department",
        placeholder: "Enter department",
        type: "text",
        required: false,
        startIcon: <></>,
        grid_size: 6,
        isDisable: true,
        
      },
      {
        input_name: "designation",
        input_label: "Designation",
        placeholder: "Enter designation",
        type: "text",
        required: false,
        startIcon: <></>,
        grid_size: 6,
        isDisable: true,
      },
      // {
      //   input_name: "leave_type",
      //   input_label: "Leave Type",
      //   placeholder: "Select leave type",
      //   type: "select",
      //   required: true,
      //   startIcon: <SquareUserRound size={16} />,
      //   grid_size: 6,
      //   isDisable: false,
      //   options: state.leave_type,
      // },
      // {
      //   input_name: "leave_balance",
      //   input_label: "Leave Balance",
      //   placeholder: "Enter leave balance",
      //   type: "text",
      //   required: true,
      //   startIcon: <></>,
      //   grid_size: 6,
      //   isDisable: false,
      // },
      // {
      //   input_name: "adjustment",
      //   input_label: "Adjustment",
      //   placeholder: "Enter Adjustment",
      //   type: "text",
      //   required: true,
      //   startIcon: <></>,
      //   grid_size: 6,
      //   isDisable: false,
      // },
      // {
      //   input_name: "new_balance",
      //   input_label: "New Balance",
      //   placeholder: "Enter new balance",
      //   type: "text",
      //   required: true,
      //   startIcon: <></>,
      //   grid_size: 6,
      //   isDisable: false,
      // },
      // {
      //   input_name: "remarks",
      //   input_label: "Remarks",
      //   placeholder: "Enter Remarks",
      //   type: "textarea",
      //   required: false,
      //   startIcon: <></>,
      //   grid_size: 12,
      //   isDisable: false,
      // },
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
      const res: any = await apiClient.get('resource/Leave Adjustment?fields=["name","date","adjustment_type","payroll_period","employee"]');

      // Using mock data for nowl
      console.log(res,"reds")
      setLeaveAdjustments(res.data)
    } catch (err: any) {
      console.error("API error ❌", err.response?.data || err.message)
    }
  }

  useEffect(() => {
    fetchAll()
    getAllLeave()
    getAllEmployees()
  }, [])

  const columns = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: (row: unknown, index: number) => (
        <div className="flex gap-2">
          <Trash size={16} color={defaultColor?.main_blue} style={{ cursor: "pointer" }}  onClick={(e) => {
            e.stopPropagation();
            // Handle delete if needed
            setState({ selected_data: row, delete_dialog: true })   
          }} />
          <Edit size={16} color={defaultColor?.main_blue} />
          <SquareUserRound size={16} color={defaultColor?.main_blue} />
        </div>
      ),
    },
    {
      key: "sno",
      label: "S.No",
      searchable: false,
      render: (_: any, index: number) => index + 1,
    },
    { key: "transaction_no", label: "Transaction no", searchable: true },
    { key: "date", label: "Transaction Date", searchable: true },
    { key: "adjustment_type", label: "Adjustment Type", searchable: true },
    { key: "payroll_period", label: "Payroll Period", searchable: true },
    { key: "employee", label: "Employee", searchable: true },
  ]
  

  const getAllLeave = async () => {
    try {
      const res: any = await apiClient.get('/resource/Leave Type?limit=100&fields=["name","leave_type_name"]');

      // Using mock data for nowl
      console.log(res,"reds")
      setState({leave_type_options: res.data})
    } catch (err: any) {
      console.error("API error ❌", err.response?.data || err.message)
    }
  }
  
  const getAllEmployees = async () => {
    try {
      const res: any = await apiClient.get(
        '/resource/Employee?fields=["name","attendance_device_id","employee_name","branch","designation","department","cell_number","custom_employment_category","employment_type"]&limit_page_length=0'
      );
      // Using mock data for nowl
      console.log(res,"employee")
      setState({emp_options: res.data})
    } catch (err: any) {
      console.error("API error ❌", err.response?.data || err.message)
    }
  }
  
  const getEmployeesDetails = async (name: string) => {
    try {
      const res: any = await apiClient.get(
        `resource/Employee/${name}`
      );
      // Using mock data for nowl
      console.log(res,"employee-detail")
      setState({department: res?.data?.department,
        designation: res?.data?.designation,
        leave_type:"",
      })
    } catch (err: any) {
      console.error("API error ❌", err.response?.data || err.message)
    }
  }
  const getLeaveBalance   = async (name: string,leave_type: string) => {
    try {
      const res: any = await apiClient.getByBody(
        `/method/get_leave_balance`,
        {employee: name,
          leave_type: leave_type
        }
      );
      // Using mock data for nowl
      console.log(res,"employee-leave")
      setState({leave_balance: res?.data?.balance
      })
    } catch (err: any) {
      console.error("API error ❌", err.response?.data || err.message)
    }
  }
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
      // if (!state.transaction_no) {
      //   toast.error("Please enter transaction number")
      //   return
      // }
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
      if (!state.remarks) {
        toast.error("Please enter remarks")
        return
      }
      

      const send_object = {
        // transaction_no: state.transaction_no,
        transaction_date: state.transaction_date,

        adjustment_type: state.adjustment_type,
        // payroll_period: state.payroll_period,
        employee: state.employee,
        department: state.department,
        designation: state.designation,
        leave_type: state.leave_type,
        leave_balance: state.leave_balance,
        adjustment: state.adjustment,
        new_balance: (Number(state.leave_balance) + Number(state.adjustment)),
        reason: state.remarks,
      }
    //   {
    //     "date" : "2025-09-17",//Date Today
    //     "payroll_period" : "payroll",
    //     "adjustment_type" : "Opening Quota", //Select Opening Quota, Leave Adjustment, Encashment Leave
    //     "employee" : "TBM1865",
    //     //"designation" : "Academic Coordinator", //Get from Employee Designation API
    //     //"department" : "Academic - TBM", //Get from Employee Department API
    //     "leave_type" : "kjdkhlalk", //Get from Leave Type APIs
    //     //"leave_balance" : 15, //int, Get Leave Balance from above GET API
    //     //"new_balance" : 17, //int, leave_balance+adjustment 
    //     "adjustment" : "2", //int can be negative as well
    //     "reason" : "Reasons"
    // }

      console.log("send_object", send_object)

      const response = await apiClient.post('/resource/Leave Adjustment', send_object);
      console.log("response", response)
      console.log("Leave Adjustment created successfully")
      toast.success("Leave Adjustment created successfully")
      
      setState({ leave_adjustment_dialog: false })
      fetchAll()
    } catch (error) {
      console.error("Error creating leave adjustment:", error)
    }
  }
  // delete row data 
    const DeleteRowData = async(row:any,index?:number) => {
      try {
        console.log(state?.selected_data,"s");
        // console.log(state?.selectedPolicyIds, "state?.selectedPolicyIds");
        // return;
        // window.alert("are you sure you want to delete")
        const resp = await apiClient.delete(`resource/Leave Adjustment/${state?.selected_data?.name}`); 
        console.log(resp, "resp");
        toast.success("Policy deleted successfully");
        window.location.reload();
      } catch (error) {
        console.error("Error deleting policy:", error);
        toast.error("Failed to delete policy");
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
                        isMultiLine={true}
                        // rows={4}
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

                <Grid size={{
                  xs: 12,
                  md: 12,
                }}>

      <CustomSelectField
                      label="Employee"
                      value={state.employee}
                      options={state?.emp_options?.map((item: any) => ({
                        value: item.name,
                        label: item.name,
                      }))}
                      required={true}
                      onChange={(e: any) => {setState({ employee: e.target.value }); getEmployeesDetails(e.target.value)}}
                    />
                </Grid>
                 
                  <Grid
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                    // key={}
                  >
                    <CustomSelectField
                      label="Leave Type"
                      value={state.leave_type}
                      options={state?.leave_type_options?.map((item: any) => ({
                        value: item.leave_type_name,
                        label: item.name,
                      }))}
                      required={true}
                      onChange={(e: any) => {setState({ leave_type: e.target.value }); getLeaveBalance(state.employee,e.target.value)}}
                    />
                  </Grid>
                  <Grid size={{
                    xs: 12,
                    md: 6,
                  }}>
                     <CustomTextField
                        input_label={"Leave Balance"}
                        input_name={"leave_balance"}
                        input_value={state["leave_balance"]}
                        onchange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          setState({ ["leave_balance"]: e.target.value })
                        }
                        required={true}
                        isDisable={true}
                        placeholder={"Enter leave balance"}
                        // isMultiLine={true}
                        // rows={4}
                      />
                  </Grid>
                  <Grid size={{
                    xs: 12,
                    md: 6,
                  }}>
                     <CustomTextField
                        input_label={"Adjustment"}
                        input_name={"adjustment"}
                        input_value={state["adjustment"]}
                        onchange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          setState({ ["adjustment"]: e.target.value })
                        }
                        required={true}
                        isDisable={false}
                        placeholder={"Enter adjustment"}
                        // isMultiLine={true}
                        // rows={4}
                      />
                  </Grid>
                  <Grid size={{
                    xs: 12,
                    md: 6,
                  }}>
                     <CustomTextField
                        input_label={"New balance"}
                        input_name={"new_balance"}
                        input_value={(Number(state.leave_balance) + Number(state.adjustment)).toString()}
                        onchange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          setState({ ["new_balance"]: e.target.value })
                        }
                        required={true}
                        isDisable={true}
                        placeholder={"Enter adjustment"}
                        // isMultiLine={true}
                        // rows={4}
                      />
                  </Grid>
                  <Grid size={{
                    xs: 12,
                    md: 12,
                  }}>
                     <CustomTextField
                        input_label={"Remarks"}
                        input_name={"remarks"}
                        input_value={state?.remarks}
                        onchange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          setState({ ["remarks"]: e.target.value })
                        }
                        required={true}
                        isDisable={false}
                        placeholder={"Enter remarks"}
                        isMultiLine={true}
                        // rows={4}
                        maxRows={4}
                      />
                  </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </div>
      </MuiDialog>
       <MuiDialog open={state?.delete_dialog} 
                             multiple_btn={false}
                             title="Delete Confirmation"
                             // description="This action cannot be undone. Are/ ou sure?"
                             description={false}
                             maxWidth="sm"
                        onClose={() => setState({ delete_dialog: false })}>
                    <div className="p-4 ">
                      {/* Title */}
                      <h2 className="text-lg font-semibold text-gray-800 mb-2">
                        Delete Confirmation
                      </h2>
                  
                      {/* Message */}
                      <p className="text-sm text-gray-600 mb-4">
                        Are you sure you want to delete this item? This action cannot be undone.
                      </p>
                  
                      {/* Actions */}
                      <div className="flex justify-end gap-3">
                        <button
                          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                          onClick={() => setState({ delete_dialog: false })}
                        >
                          Cancel
                        </button>
                  
                        <button
                          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                          onClick={() => {
                            DeleteRowData(state?.selected_data,); // Call your delete function
                            setState({ delete_dialog: false });
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </MuiDialog>
    </>
  )
}

export default LeaveAdjustment
