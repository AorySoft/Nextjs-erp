"use client"

import { useEffect, useReducer, useState } from "react"
import {
  Box,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material"
import { Plus, Edit, Trash, View } from "lucide-react"
import DataTable from "@/components/ui/DataTable"
import MuiDialog from "@/components/ui/DialogBox"
import CustomTextField from "@/components/ui/CustomTextField"
import CustomDateInputField from "@/components/ui/DatePicker"
import CustomSelectField from "@/components/ui/CustomSelectField"
import CustomMultiSelectField from "@/components/ui/CustomMultiSelectField"
import { defaultColor } from "@/utils/constant"
import apiClient from "@/services/apiClient";
import request from "@/services/apiClient";
import { toast } from "react-toastify"

// Steps for the wizard


// /resource/Leave Group/5fasjjo0j7


export default function LeaveQuotaAllocationPage() {
  const steps = ["Setup", "Leave Group", ]
 
// Initial state for Leave Quota Allocation form
const initialQuotaState = {
  transaction_no: "",
  transaction_date: new Date().toISOString().split("T")[0],
  transaction_type: "",
  transaction_sub_type: "",
  payroll_period: "",
  description: "",
  leave_group: "",
  allocation: [],
}
   const [state, setState] = useReducer(
      (state: any, newState: any) => ({ ...state, ...newState }),
      {
      }
    );
  const quotaReducer = (state: any, action: any) => {
    switch (action.type) {
      case "SET_FIELD":
        return { ...state, [action.field]: action.value }
      case "RESET_FORM":
        return initialQuotaState
      default:
        return state
    }
  }
  const [quotaState, quotaDispatch] = useReducer(quotaReducer, initialQuotaState)
  const [activeStep, setActiveStep] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const columns: any[] = [
    {
      key: "action",
      label: "Actions",
      searchable: false,
      render: (row: any) => (
        <div className="flex gap-2">
          <Trash 
            size={16} 
            color={defaultColor?.main_blue} 
            className="cursor-pointer hover:opacity-70" 
            onClick={(e) => {
              e.stopPropagation();
              deleteLeaveQuotaAllocation(row.name);
            }}
          />
          <Edit 
            size={16} 
            color={defaultColor?.main_blue} 
            className="cursor-pointer hover:opacity-70" 
            onClick={(e) => {
              e.stopPropagation();
              // handleEdit(row);
            }}
          />
          <View 
            size={16} 
            color={defaultColor?.main_blue} 
            className="cursor-pointer hover:opacity-70" 
            onClick={(e) => {
              e.stopPropagation();
              // Handle view
            }}
          />
        </div>
      ),
    },
    { key: "id", label: "S.No", searchable: false },
    { key: "name", label: "Name", searchable: true },
    { key: "leave_type", label: "Leave Type", searchable: true },
    { key: "transaction_type", label: "Transaction Type", searchable: true },
    { key: "transaction_sub_type", label: "Transaction Sub Type", searchable: true },
    { key: "payroll_period", label: "Payroll Period", searchable: true },
  ];

  const renderStepContent = (step: number) => {
    // Skip Allocation step if Transaction Sub Type is "Opening Quota"
    const shouldSkipAllocation = quotaState.transaction_sub_type === "Opening Quota"
    
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomTextField
              input_label="Transaction No"
              input_name="transaction_no"
              input_value={quotaState.transaction_no}
              onchange={(e) =>
                quotaDispatch({
                  type: "SET_FIELD",
                  field: "transaction_no",
                  value: e.target.value,
                })
              }
              isDisable={true}
            />
  
            <CustomDateInputField
              input_label="Transaction Date (To)"
              input_value={state?.transaction_date_to}
              onchange={(e) =>
                setState({
                  transaction_date_to: e.target.value,
                })
              }
            />
             <CustomDateInputField
              input_label="Transaction Date (From)"
              input_value={state?.transaction_date_from}
              onchange={(e) =>
                setState({
                  transaction_date_from: e.target.value,
                })
              }
            />
  
            <CustomSelectField
              label="Transaction Type"
              value={state.transaction_type}
              options={[
                { label: "Opening", value: "Opening" },
                { label: "Adjustment", value: "Adjustment" },
              ]}
              onChange={(e) =>
                setState({
                  transaction_type: e.target.value,
                })
              }
            />
  
            <CustomSelectField
              label="Transaction Sub Type"
              value={state.transaction_sub_type}
              options={[
                { label: "Opening Quota", value: "Opening Quota" },
                { label: "New Quota", value: "New Quota" }
              ]}
              onChange={(e) =>
                setState({
                  transaction_sub_type: e.target.value,
                })
              }
            />

            <CustomMultiSelectField
              label="Employees"
              options={(state?.emp_options ?? []).map((item: any) => ({
                value: item.name,
                label: `${item.employee_name} (${item.name})`,
              }))}
              value={state.selected_employees ?? []}
              onChange={(values) => setState({ selected_employees: values })}
            />
  
            <CustomTextField
              input_label="Description"
              input_name="description"
              input_value={state.description}
              onchange={(e) =>
                setState({
                  description: e.target.value,
                })
              }
              isMultiLine
              maxRows={6}
            />
          </div>
        )
  
      case 1: // Leave Group
        // Show different layout based on Transaction Sub Type
        if (quotaState.transaction_sub_type === "Opening Quota") {
          return (
            <div>
              {/* Leave Group and Leave Type Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <CustomSelectField
                    label="Leave Group*"
                    value={quotaState.leave_group}
                    options={[
                      { label: "Annual Leave (15 Days)", value: "Annual Leave (15 Days)" },
                      { label: "Annual Leave (6 Days)", value: "Annual Leave (6 Days)" },
                    ]}
                    onChange={(e) =>
                      quotaDispatch({
                        type: "SET_FIELD",
                        field: "leave_group",
                        value: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <CustomSelectField
                    label="Leave Type*"
                    value=""
                    options={[
                      { label: "Summer Vacations", value: "Summer Vacations" },
                      { label: "Winter Vacations", value: "Winter Vacations" },
                      { label: "Umrah", value: "Umrah" },
                      { label: "Emergency", value: "Emergency" },
                      { label: "Medical Leave", value: "Medical Leave" },
                      { label: "Maternity Leave", value: "Maternity Leave" },
                    ]}
                    onChange={() => {}}
                  />
                </div>
              </div>
              
              {/* Browse File Section */}
              <div className="mb-4">
                <input
                  type="file"
                  id="file-upload"
                  style={{ display: 'none' }}
                  onChange={() => {}}
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                >
                  Browse File...
                </label>
                <span className="ml-2 text-gray-500">No file chosen</span>
              </div>
              
              {/* Save Button */}
              <div className="mb-4">
                <Button variant="outlined" size="small">
                  💾 Save
                </Button>
              </div>
        
              {/* Table */}
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">S.No</th>
                    <th className="border px-2 py-1">Code</th>
                    <th className="border px-2 py-1">Employee</th>
                    <th className="border px-2 py-1">Leave Type</th>
                    <th className="border px-2 py-1">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={5} className="text-center py-6 text-gray-500">
                      🔍 No Record Found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        } else if (quotaState.transaction_sub_type === "New Quota") {
          return (
            <div>
              {/* Leave Group Search Input */}
              <div className="mb-4">
                <CustomSelectField
                  label="Leave Group*"
                  value={quotaState.leave_group}
                  options={[
                    { label: "Annual Leave (15 Days)", value: "Annual Leave (15 Days)" },
                    { label: "Annual Leave (6 Days)", value: "Annual Leave (6 Days)" },
                  ]}
                  onChange={(e) =>
                    quotaDispatch({
                      type: "SET_FIELD",
                      field: "leave_group",
                      value: e.target.value,
                    })
                  }
                />
              </div>
        
              {/* Table with checkbox selection */}
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">
                      <input type="checkbox" />
                    </th>
                    <th className="border px-2 py-1">S.No</th>
                    <th className="border px-2 py-1">Leave Type</th>
                    <th className="border px-2 py-1">Leave Days</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="text-center py-16 text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <div className="mb-2 text-4xl">🔍</div>
                        <p>No Record Found</p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        } else {
          // Default view when no Transaction Sub Type is selected
          return (
            <div>
             <div id="type-div"  className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="mb-4">
              <CustomSelectField
                  label="Leave Group*"
                  value={state.leave_group}
                  options={state.leave_group_options}
                  onChange={(e) =>{
                    setState({
                      ...state,
                      leave_group: e.target.value,
                    })
                    fetchLeaveTypeOptions(e.target.value)
                  }
                  }
                />
              </div>
              <div className="mb-4" style={{opacity: state.leave_group ? 1 : 0.8,pointerEvents: state.leave_group ? "auto" : "none"}}>
              <CustomSelectField
                  label="Leave Type*"
                  value={state.leave_type}
                  options={state.leave_type_options}
                  onChange={(e) =>
                    setState({
                      ...state,
                      leave_type: e.target.value,
                    })
                  }
                  
                />
              </div>
              <div className="mb-4" style={{opacity: state.leave_group ? 1 : 0.8,pointerEvents: state.leave_group ? "auto" : "none"}}>
              <CustomTextField
              input_label="New Leaves Allocated*"
                  placeholder="New Leaves Allocated*"
                  input_value={state.new_leaves_allocated}
                  onchange={(e) =>
                    setState({
                      ...state,
                      new_leaves_allocated: e.target.value,
                    })
                  }
                  
                />
              </div>
              
             </div>
              
              <table className="w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-2 py-1">
                      <input type="checkbox" />
                    </th>
                    <th className="border px-2 py-1">S.No</th>
                    <th className="border px-2 py-1">Leave Type</th>
                    <th className="border px-2 py-1">Leave Days</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-gray-500">
                      🔍 No Record Found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )
        }
      
  
      // case 2: // Allocation
      //   const allocationData = [
      //     { sno: 1, type: "Annual Leave (15d)", leave: 15, total: 110, allocate: 42, notAllocate: 68 },
      //     { sno: 2, type: "Umrah Leaves", leave: 25, total: 110, allocate: 0, notAllocate: 110 },
      //     { sno: 3, type: "Medical Leaves for HOD's", leave: 30, total: 110, allocate: 0, notAllocate: 110 },
      //     { sno: 4, type: "Watchman leaves (for family ...)", leave: 7, total: 110, allocate: 0, notAllocate: 110 },
      //     { sno: 5, type: "Unpaid Leaves", leave: 31, total: 110, allocate: 0, notAllocate: 110 },
      //     { sno: 6, type: "Emergency", leave: 31, total: 110, allocate: 0, notAllocate: 110 },
      //     { sno: 7, type: "Maternity leaves", leave: 45, total: 110, allocate: 0, notAllocate: 110 },
      //     { sno: 8, type: "Winter vacations", leave: 10, total: 110, allocate: 0, notAllocate: 110 },
      //     { sno: 9, type: "Summer vacations", leave: 45, total: 110, allocate: 0, notAllocate: 110 },
      //   ]
  
      //   return (
      //     <table className="w-full border text-sm">
      //       <thead className="bg-gray-100">
      //         <tr>
      //           <th className="border px-2 py-1">S.No</th>
      //           <th className="border px-2 py-1">Leave Type</th>
      //           <th className="border px-2 py-1">Leave</th>
      //           <th className="border px-2 py-1">Total</th>
      //           <th className="border px-2 py-1">Allocate</th>
      //           <th className="border px-2 py-1">Not Allocate</th>
      //           <th className="border px-2 py-1">Status</th>
      //         </tr>
      //       </thead>
      //       <tbody>
      //         {allocationData.map((row) => (
      //           <tr key={row.sno}>
      //             <td className="border px-2 py-1">{row.sno}</td>
      //             <td className="border px-2 py-1">{row.type}</td>
      //             <td className="border px-2 py-1">{row.leave}</td>
      //             <td className="border px-2 py-1">{row.total}</td>
      //             <td className="border px-2 py-1">{row.allocate}</td>
      //             <td className="border px-2 py-1">{row.notAllocate}</td>
      //             <td className="border px-2 py-1 text-center">
      //               <Button size="small" variant="outlined">Allocate</Button>
      //             </td>
      //           </tr>
      //         ))}
      //       </tbody>
      //     </table>
      //   )
  
      // case 2: // Summary
      //   return (
      //     <div>
      //       {/* Summary Table Header */}
      //       <table className="w-full border text-sm">
      //         <thead className="bg-gray-100">
      //           <tr>
      //             <th className="border px-2 py-1">S.No</th>
      //             <th className="border px-2 py-1">Leave Type</th>
      //             <th className="border px-2 py-1">No Of Emp</th>
      //             <th className="border px-2 py-1">Status</th>
      //           </tr>
      //         </thead>
      //         <tbody>
      //           <tr>
      //             <td colSpan={4} className="text-center py-16 text-gray-500">
      //               <div className="flex flex-col items-center justify-center">
      //                 <div className="mb-2 text-4xl">🔍</div>
      //                 <p>No Record Found</p>
      //               </div>
      //             </td>
      //           </tr>
      //         </tbody>
      //       </table>
      //     </div>
      //   )
  
      default:
        return null
    }
  }
  // apis function
    
const getAll = async () => {
  try {
    const res: any = await apiClient.get(
      '/resource/Leave Quota Allocation?fields=["name","leave_type","transaction_type","transaction_sub_type","payroll_period"]'
    );
    // Using mock data for nowl
    console.log(res,"get-all")
    setState({all_qouta: res?.data})
  } catch (err: any) {
    console.error("API error ❌", err.response?.data || err.message)
  }
}
 const fetchLeaveGroupOptions = async () => {
    try {
      const [leave_group_resp]: any = await Promise.all([
        apiClient.get(`/resource/Leave Group?fields=["name","leave_group"]`),
        // apiClient.get(`/resource/Designation?limit=100`),
        // apiClient.get(`/resource/Employment Type?limit=100`),
      ]);

      const leave_group_options: any =
        leave_group_resp?.data?.map((item: any) => ({
          value: item.name,
          label: item.leave_group,
        })) ?? [];
      setState({ leave_group_options });

      // const designations:any = designationsRes?.data?.map((item: any) => ({
      //   value: item.name,
      //   label: item.name,
      // })) ?? [];
      // setState({designations_options:designations});

      // const employmentTypes:any = employmentTypesRes?.data?.map((item: any) => ({
      //   value: item.name,
      //   label: item.name,
      // })) ?? [];
      // setState({employment_types_options:employmentTypes});

      // ✅ single update, no overwrite
    } catch (err) {
      console.error("❌ Error fetching form options:", err);
    }
  };
  
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
    const fetchLeaveTypeOptions = async (leave_group:string) => {
      try {
        const [leave_group_resp]: any = await Promise.all([
          apiClient.get(`/resource/Leave Group/${leave_group}`),
          // apiClient.get(`/resource/Designation?limit=100`),
          // apiClient.get(`/resource/Employment Type?limit=100`),
        ]);
  
        const leave_type_options: any =
          leave_group_resp?.data?.leave_group_table?.map((item: any) => ({
            value: item.leave_type,
            label: item.leave_type,
          })) ?? [];
        setState({ leave_type_options });
  
        // const designations:any = designationsRes?.data?.map((item: any) => ({
        //   value: item.name,
        //   label: item.name,
        // })) ?? [];
        // setState({designations_options:designations});
  
        // const employmentTypes:any = employmentTypesRes?.data?.map((item: any) => ({
        //   value: item.name,
        //   label: item.name,
        // })) ?? [];
        // setState({employment_types_options:employmentTypes});
  
        // ✅ single update, no overwrite
      } catch (err) {
        console.error("❌ Error fetching form options:", err);
      }
    };
  //
  useEffect(() => {
    getAll()
    fetchLeaveGroupOptions()
    getAllEmployees()
  }, [])
// create function
const createAllocation= async()=>{
try {
  if(!state?.selected_employees || state?.selected_employees?.length === 0 || !state?.leave_type || !state?.leave_group || !state?.transaction_date_from || !state?.transaction_date_to || !state?.new_leaves_allocated){
    toast.error("Please fill all the fields")
    return
  }
  const send_payload={
    "employees": state?.selected_employees,
    "leave_type": state?.leave_type,
    "leave_group" : state?.leave_group,
    "from_date": state?.transaction_date_from,
    "to_date": state?.transaction_date_to,
    "new_leaves_allocated": state?.new_leaves_allocated
  }
  const res:any = await apiClient.post('/method/custom_allocate_leave',send_payload)
  setIsModalOpen(false)
  console.log(res,"res")
  toast.success("Leave Quota Allocation Created Successfully")
  getAll();
} catch (error) {
  
}
}

// Delete function
const deleteLeaveQuotaAllocation = async (recordId: string) => {
  try {
    if (window.confirm(`Are you sure you want to delete this leave quota allocation? This action cannot be undone.`)) {
      console.log("Deleting leave quota allocation:", recordId)
      
      try {
        await request.delete(`/resource/Leave Quota Allocation/${recordId}`)
        console.log("Leave quota allocation deleted successfully")
        
        // Refresh the data table
        await getAll()
        
        toast.success("Leave Quota Allocation deleted successfully")
      } catch (deleteError: any) {
        console.error("Delete error:", deleteError)
        if (deleteError.response?.status === 404) {
          toast.error(`Record with ID "${recordId}" not found. The record may have already been deleted.`)
          // Refresh the data table to get updated records
          await getAll()
          return
        } else if (deleteError.response?.status === 403) {
          toast.error("You don't have permission to delete this leave quota allocation.")
          return
        } else if (deleteError.response?.status === 400) {
          toast.error("Cannot delete this leave quota allocation. It may be in a state that prevents deletion.")
          return
        }
        throw deleteError
      }
    }
  } catch (error: any) {
    console.error("Error deleting leave quota allocation:", error)
    if (error.response?.status === 404) {
      toast.error("Record not found. It may have already been deleted.")
    } else if (error.response?.status === 403) {
      toast.error("You don't have permission to delete this leave quota allocation.")
    } else if (error.response?.status === 400) {
      toast.error("Cannot delete this leave quota allocation. It may be in a state that prevents deletion.")
    } else {
      toast.error(`Error deleting leave quota allocation: ${error.message || "Please try again."}`)
    }
  }
}
  return (
    <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">Leave Quota Allocation</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            New
          </button>
        </div>
      </div>

      <DataTable columns={columns} data={state?.all_qouta??[]} />

      {/* Modal */}
      <MuiDialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        multiple_btn={true}
        title={isEditMode ? "Edit Quota Allocation" : "Leave Quota Allocation"}
        onSave={() => setIsModalOpen(false)}
        maxWidth="lg"
      >
        <Box>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div className="mt-4">{renderStepContent(activeStep)}</div>

          <div className="flex justify-between mt-6">
            <Button 
              disabled={activeStep === 0} 
              onClick={() => {
                const shouldSkipAllocation = quotaState.transaction_sub_type === "Opening Quota"
                if (shouldSkipAllocation && activeStep === 3) {
                  // Skip back from summary to leave group (skip allocation)
                  setActiveStep(1)
                } else {
                  setActiveStep((prev) => prev - 1)
                }
              }}
            >
              Back
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button 
                variant="contained" 
                onClick={() => {
                  const shouldSkipAllocation = quotaState.transaction_sub_type === "Opening Quota"
                  if (shouldSkipAllocation && activeStep === 1) {
                    // Skip allocation step and go directly to summary
                    setActiveStep(3)
                  } else {
                    setActiveStep((prev) => prev + 1)
                  }
                }}
              >
                Next
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={() => createAllocation()}>
                Submit
              </Button>
            )}
          </div>
        </Box>
      </MuiDialog>
    </div>
  )
}