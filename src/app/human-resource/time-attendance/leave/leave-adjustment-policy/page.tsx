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
  Typography,
} from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";
import CustomSelectField from "@/components/ui/CustomSelectField";
import { toast } from "react-toastify";
import { defaultColor } from "@/utils/constant";

interface TableAdjustmentPolicy {
  id: string;
  code: string;
  adjustment_policy: string;
  adjustment_type: string;
  based_on: string;
}

interface PolicyDetailRow {
  id: string;
  leave_type: string;
  priority: number;
  days: number;
}

const LeaveAdjustmentPolicy = () => {
  const [policies, setPolicies] = useState<TableAdjustmentPolicy[]>([]);
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
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "adjustment_type",
          input_label: "Adjustment Type",
          placeholder: "Search Adjustment Type",
          type: "text",
          required: true,
          grid_size: 4,
          isDisable: false,
          startIcon: <Search size={16} />,   // <-- added search icon
        },
        {
          input_name: "adjustment_policy",
          input_label: "Adjustment Policy",
          placeholder: "Enter Adjustment Policy",
          type: "text",
          required: true,
          grid_size: 4,
          isDisable: false,
        },
      ],

      // Table rows for details
      policyRows: [
        {
          id: "1",
          leave_type: "",
          priority: 0,
          days: 0,
        },
      ],

      dialog_open: false,

      // Options
      leave_types_options: [
        { value: "annual", label: "Annual Leave" },
        { value: "sick", label: "Sick Leave" },
        { value: "casual", label: "Casual Leave" },
        { value: "maternity", label: "Maternity Leave" },
      ],
    }
  );

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      // Mock data
      const mockData: TableAdjustmentPolicy[] = [
        {
          id: "1",
          code: "AP01",
          adjustment_policy: "Absent Adjust Policy (15 Days)",
          adjustment_type: "Carry Forward",
          based_on: "Annual Leave",
        },
        {
          id: "2",
          code: "AP02",
          adjustment_policy: "Absent Adjust Policy (6 Days)",
          adjustment_type: "Deduction",
          based_on: "Sick Leave",
        },
      ];
      setPolicies(mockData);
    } catch (error) {
      console.error("Error fetching adjustment policies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
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
    { key: "adjustment_policy", label: "Adjustment Policy", searchable: true },
    { key: "adjustment_type", label: "Adjustment Type", searchable: true },
    { key: "based_on", label: "Based On", searchable: true },
  ];

  const validateForm = (formFields: any[], formState: any) => {
    for (const field of formFields) {
      if (field.required && !formState[field.input_name]) {
        toast.error(`${field.input_label} is required`);
        return false;
      }
    }
    return true;
  };

  const handleCreatePolicy = async () => {
    try {
      const isValid = validateForm(state.formFields, state);
      if (!isValid) return;

      const send_object = {
        code: state.code,
        adjustment_type: state.adjustment_type,
        adjustment_policy: state.adjustment_policy,
        details: state.policyRows,
      };

      console.log("Creating policy:", send_object);
      // API call here

      toast.success("Leave Adjustment Policy created successfully");
      setState({ dialog_open: false });
      fetchPolicies();
    } catch (error) {
      console.error("Error creating policy:", error);
      toast.error("Error creating policy");
    }
  };

  const addNewPolicyRow = () => {
    const newRow = {
      id: Date.now().toString(),
      leave_type: "",
      priority: 0,
      days: 0,
    };
    setState({
      policyRows: [...state.policyRows, newRow],
    });
  };

  const removePolicyRow = (id: string) => {
    setState({
      policyRows: state.policyRows.filter((row: PolicyDetailRow) => row.id !== id),
    });
  };

  const updatePolicyRow = (id: string, field: string, value: any) => {
    setState({
      policyRows: state.policyRows.map((row: PolicyDetailRow) =>
        row.id === id ? { ...row, [field]: value } : row
      ),
    });
  };

  return (
    <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Leave Adjustment Policy
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={() => setState({ dialog_open: true })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            New
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-600">Loading policies...</div>
        </div>
      ) : (
        <DataTable columns={columns} data={policies} />
      )}

      <MuiDialog
        open={state?.dialog_open}
        onClose={() => setState({ dialog_open: false })}
        multiple_btn={true}
        title="Leave Adjustment Policy"
        description={false}
        maxWidth="lg"
        onSave={handleCreatePolicy}
      >
        <div id="policy-parent">
          {/* Basic Information Section */}
          <Accordion defaultExpanded>
            <AccordionSummary
              sx={{ margin: 0, backgroundColor: defaultColor.main_grey }}
              expandIcon={<ChevronDown />}
            >
              <Typography
                sx={{ fontWeight: 600, fontSize: "12px", fontFamily: "sans-serif", margin: 0 }}
              >
                Basic Information
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ margin: 0, backgroundColor: defaultColor.main_grey }}>
              <Grid container spacing={2}>
                {state?.formFields?.map((field: any, index: number) => (
                  <Grid
                    key={field.input_name || index}
                    size={{ xs: 12, md: field.grid_size }}
                  >
                    <CustomTextField
                      input_value={state[field.input_name]}
                      onchange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setState({ [field.input_name]: e.target.value })
                      }
                      required={field.required}
                      input_name={field.input_name}
                      error={!state[field.input_name]}
                      placeholder={field.placeholder}
                      input_label={field.input_label}
                      isDisable={field.isDisable}
                      startIcon={field.startIcon}
                    />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Policy Details Section */}
          <Accordion defaultExpanded>
            <AccordionSummary
              sx={{ margin: 0, backgroundColor: defaultColor.main_grey }}
              expandIcon={<ChevronDown />}
            >
              <Typography
                sx={{ fontWeight: 600, fontSize: "12px", fontFamily: "sans-serif", margin: 0 }}
              >
                Policy Details
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ margin: 0, backgroundColor: defaultColor.main_grey }}>
              <div className="mb-4">
                <button
                  onClick={addNewPolicyRow}
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
                      <th className="border border-gray-300 p-2 text-left text-sm">Priority</th>
                      <th className="border border-gray-300 p-2 text-left text-sm">Days</th>
                      <th className="border border-gray-300 p-2 text-left text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.policyRows.map((row: PolicyDetailRow, index: number) => (
                      <tr key={row.id}>
                        <td className="border border-gray-300 p-2 text-sm">{index + 1}</td>
                        <td className="border border-gray-300 p-2">
                          <CustomSelectField
                            name={`leave_type_${row.id}`}
                            label=""
                            value={row.leave_type}
                            onChange={(e) =>
                              updatePolicyRow(row.id, "leave_type", e.target.value)
                            }
                            placeholder="Select Leave Type"
                            options={state.leave_types_options}
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <CustomTextField
                            input_value={row.priority}
                            onchange={(e) =>
                              updatePolicyRow(row.id, "priority", parseInt(e.target.value) || 0)
                            }
                            input_name={`priority_${row.id}`}
                            placeholder="Enter Priority"
                            input_label=""
                            type="number"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <CustomTextField
                            input_value={row.days}
                            onchange={(e) =>
                              updatePolicyRow(row.id, "days", parseInt(e.target.value) || 0)
                            }
                            input_name={`days_${row.id}`}
                            placeholder="Enter Days"
                            input_label=""
                            type="number"
                          />
                        </td>
                        <td className="border border-gray-300 p-2">
                          <button
                            onClick={() => removePolicyRow(row.id)}
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

export default LeaveAdjustmentPolicy;
