"use client";
import React, { useState, useEffect, useReducer } from "react";
import DataTable from "@/components/ui/DataTable";
import { Edit, Trash, View, Plus, ChevronDown, Search } from "lucide-react";
import MuiDialog from "@/components/ui/DialogBox";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Box,
  Typography,
} from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";
import { defaultColor } from "@/utils/constant";
import CustomSelectField from "@/components/ui/CustomSelectField";
import { toast } from "react-toastify";

interface TableLeaveGroup {
  id: string;
  code: string;
  leave_group: string;
  leave_adjustment_policy: string;
}

interface LeaveTypeRow {
  id: string;
  leave_type: string;
  renew_on: string;
  leave_unit: string;
  leave_days: number;
}

const LeaveGroup = () => {
  const [leaveGroups, setLeaveGroups] = useState<TableLeaveGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      // Basic Information fields
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
          input_name: "leave_group",
          input_label: "Leave Group",
          placeholder: "Enter Leave Group",
          type: "text",
          required: true,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
        {
          input_name: "leave_adjustment_policy",
          input_label: "Leave Adjustment Policy",
          placeholder: "Search Leave Adjustment Policy",
          type: "text",
          required: true,
          startIcon: <Search size={16} />,   // <-- search icon
          grid_size: 6,
          isDisable: false,
        },
      ],
      
      // Leave Adjustment Policy table data
      leaveTypeRows: [
        {
          id: "1",
          leave_type: "",
          renew_on: "",
          leave_unit: "",
          leave_days: 0,
        }
      ],
      
      leave_group_dialog: false,
      
      // Available options
      leave_types_options: [
        { value: "annual", label: "Annual Leave" },
        { value: "sick", label: "Sick Leave" },
        { value: "casual", label: "Casual Leave" },
        { value: "maternity", label: "Maternity Leave" },
      ],
      
      renew_on_options: [
        { value: "yearly", label: "Yearly" },
        { value: "monthly", label: "Monthly" },
        { value: "quarterly", label: "Quarterly" },
      ],
      
      leave_unit_options: [
        { value: "days", label: "Days" },
        { value: "hours", label: "Hours" },
      ],
    }
  );

  const fetchLeaveGroups = async () => {
    try {
      setLoading(true);
      // Mock data for now
      const mockData: TableLeaveGroup[] = [
        {
          id: "1",
          code: "01",
          leave_group: "Annual Leaves (15 Days)",
          leave_adjustment_policy: "Absent Adjust Policy(15Days)",
        },
        {
          id: "2", 
          code: "02",
          leave_group: "Annual Leaves (6 Days)",
          leave_adjustment_policy: "Absent Adjust Policy(6Days)",
        },
      ];
      setLeaveGroups(mockData);
    } catch (error) {
      console.error("Error fetching leave groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveGroups();
  }, []);

  const columns = [
    {
      key: "action",
      label: "Actions",
      searchable: false,
      render: () => (
        <div className="flex gap-2">
          <Trash size={16} color={defaultColor?.main_blue} />
          <Edit size={16} color={defaultColor?.main_blue} />
          <View size={16} color={defaultColor?.main_blue} />
        </div>
      ),
    },
    { key: "sno", label: "S.No", searchable: false },
    { key: "code", label: "Code", searchable: true },
    { key: "leave_group", label: "Leave Group", searchable: true },
    { key: "leave_adjustment_policy", label: "Leave Adjustment Policy", searchable: true },
  ];

  const validateForm = (formFields: any[], formState: any) => {
    for (const field of formFields) {
      if (field.required && !field.isDisable) {
        const value = formState[field.input_name];
        if (!value || value.toString().trim() === "") {
          toast.error(`${field.input_label} is required`);
          return false;
        }
      }
    }
    return true;
  };

  const handleCreateLeaveGroup = async () => {
    try {
      const isValid = validateForm(state.formFields, state);
      if (!isValid) return;

      const send_object = {
        code: state.code,
        leave_group: state.leave_group,
        leave_adjustment_policy: state.leave_adjustment_policy,
      };

      console.log("Creating leave group:", send_object);
      // API call would go here
      
      toast.success("Leave Group created successfully");
      setState({ leave_group_dialog: false });
      fetchLeaveGroups();
    } catch (error) {
      console.error("Error creating leave group:", error);
      toast.error("Error creating leave group");
    }
  };

  const addNewLeaveTypeRow = () => {
    const newRow = {
      id: Date.now().toString(),
      leave_type: "",
      renew_on: "",
      leave_unit: "",
      leave_days: 0,
    };
    setState({
      leaveTypeRows: [...state.leaveTypeRows, newRow]
    });
  };

  const removeLeaveTypeRow = (id: string) => {
    setState({
      leaveTypeRows: state.leaveTypeRows.filter((row: LeaveTypeRow) => row.id !== id)
    });
  };

  const updateLeaveTypeRow = (id: string, field: string, value: any) => {
    setState({
      leaveTypeRows: state.leaveTypeRows.map((row: LeaveTypeRow) => 
        row.id === id ? { ...row, [field]: value } : row
      )
    });
  };

  return (
    
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Leave Group</h1>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => setState({ leave_group_dialog: true })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              New
            </button>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Loading leave groups...</div>
          </div>
        ) : (
          <DataTable columns={columns} data={leaveGroups} />
        )}

        <MuiDialog
          open={state?.leave_group_dialog}
          onClose={() => setState({ leave_group_dialog: false })}
          multiple_btn={true}
          title="Leave Group"
          description={false}
          maxWidth="lg"
          onSave={handleCreateLeaveGroup}
        >
          <div id="leave-group-parent">
            {/* Basic Information Section */}
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
              <AccordionDetails
                sx={{ margin: 0, backgroundColor: defaultColor.main_grey }}
              >
                <Grid container spacing={2}>
                  {state?.formFields?.map((field: any, index: number) => (
                    <Grid
                      key={field.input_name || index}
                      size={{
                        xs: 12,
                        md: field.grid_size,
                      }}
                    >
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
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>

            {/* Leave Adjustment Policy Section */}
            <Accordion defaultExpanded>
              <AccordionSummary
                sx={{ margin: 0, backgroundColor: defaultColor.main_grey }}
                expandIcon={<ChevronDown />}
                aria-controls="policy-content"
                id="policy-header"
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: "12px",
                    fontFamily: "sans-serif",
                    margin: 0,
                  }}
                >
                  Leave Adjustment Policy
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{ margin: 0, backgroundColor: defaultColor.main_grey }}
              >
                <div className="mb-4">
                  <button
                    onClick={addNewLeaveTypeRow}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} />
                    New
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left text-sm">S.No</th>
                        <th className="border border-gray-300 p-2 text-left text-sm">Leave Type</th>
                        <th className="border border-gray-300 p-2 text-left text-sm">Renew On</th>
                        <th className="border border-gray-300 p-2 text-left text-sm">Leave Unit</th>
                        <th className="border border-gray-300 p-2 text-left text-sm">Leave Days</th>
                        <th className="border border-gray-300 p-2 text-left text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {state.leaveTypeRows.map((row: LeaveTypeRow, index: number) => (
                        <tr key={row.id}>
                          <td className="border border-gray-300 p-2 text-sm">{index + 1}</td>
                          <td className="border border-gray-300 p-2">
                            <CustomSelectField
                              name={`leave_type_${row.id}`}
                              label=""
                              value={row.leave_type}
                              onChange={(e) => updateLeaveTypeRow(row.id, 'leave_type', e.target.value)}
                              placeholder="Select Leave Type"
                              options={state.leave_types_options}
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <CustomSelectField
                              name={`renew_on_${row.id}`}
                              label=""
                              value={row.renew_on}
                              onChange={(e) => updateLeaveTypeRow(row.id, 'renew_on', e.target.value)}
                              placeholder="Select Renew On"
                              options={state.renew_on_options}
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <CustomSelectField
                              name={`leave_unit_${row.id}`}
                              label=""
                              value={row.leave_unit}
                              onChange={(e) => updateLeaveTypeRow(row.id, 'leave_unit', e.target.value)}
                              placeholder="Select Unit"
                              options={state.leave_unit_options}
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <CustomTextField
                              input_value={row.leave_days}
                              onchange={(e) => updateLeaveTypeRow(row.id, 'leave_days', parseInt(e.target.value) || 0)}
                              input_name={`leave_days_${row.id}`}
                              placeholder="Enter Days"
                              input_label=""
                              type="number"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <button
                              onClick={() => removeLeaveTypeRow(row.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </MuiDialog>
      </div>

  );
};

export default LeaveGroup;