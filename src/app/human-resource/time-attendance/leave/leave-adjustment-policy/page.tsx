"use client";
import React, { useState, useEffect, useReducer } from "react";
import DataTable from "@/components/ui/DataTable";

interface Column {
  key: string;
  label: string;
  searchable?: boolean;
  render?: (row: unknown, index: number) => React.ReactNode;
}
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
  name: string;
  adjustment_policy: string;
  adjustment_type: string;
  doctype_item: string;
}

interface PolicyDetailRow {
  id: string;
  leave_type: string;
  priority: number;
  days: number;
  selected?: boolean;
}

const LeaveAdjustmentPolicy = () => {
  const [policies, setPolicies] = useState<TableAdjustmentPolicy[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPolicyName, setCurrentPolicyName] = useState('');

  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      // Basic Information fields
      // Base form fields without based_on
      baseFormFields: [
        {
          input_name: "code",
          input_label: "Code",
          placeholder: "Enter Code",
          type: "text",
          required: false,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "adjustment_policy",
          input_label: "Adjustment Policy",
          placeholder: "Enter Policy Name",
          type: "text",
          required: true,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "adjustment_type",
          input_label: "Adjustment Type",
          placeholder: "Select Type",
          type: "select",
          required: true,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "attendance_policies", label: "Attendance Policies" },
            { value: "leave_type", label: "Leave Type" },
            { value: "actual_absent", label: "Actual Absent" },
          ],
        }
      ],
      
      // Based on field definition (will be conditionally added with dynamic options)
      basedOnField: {
        input_name: "based_on",
        input_label: "Based On",
        placeholder: "Select Based On",
        type: "select",
        required: true,
        isDisable: false,
        options: [] // Will be set dynamically based on adjustment type
      },
      
      // Options for different adjustment types
  basedOnOptions: {
    attendance_policies: [
      { value: "late_arrival", label: "Late Arrival" },
      { value: "early_departure", label: "Early Departure" }
    ],
    leave_type: [
      { value: "annual_leave", label: "Annual Leave (6 days)" },
      { value: "casual_leave", label: "Casual Leave" },
      { value: "compensatory_off", label: "Compensatory Off" },
      { value: "emergency_leave", label: "Emergency Leave" }
    ]
  },
  
  // Priority options for policy details
  priorityOptions: [
    { value: 1, label: "First" },
    { value: 2, label: "Second" },
    { value: 3, label: "Third" },
    { value: 4, label: "Fourth" }
  ],
  
  // Table rows for details
  policyRows: [
    {
      id: "1",
      leave_type: "",
      priority: 1, // Default to First priority
      days: 0,
    },
  ],

      dialog_open: false,

      // Options
      leave_types_options: [
        { value: "Annual Leave (6 days)", label: "Annual Leave (6 days)" },
        { value: "Sick Leave", label: "Sick Leave" },
        { value: "Casual Leave", label: "Casual Leave" },
        { value: "Maternity Leave", label: "Maternity Leave" },
      ],
    }
  );

  const fetchPolicies = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(
        'https://erp.thebenchmark.com.pk/api/resource/Leave%20Adjustment%20Policy?fields=["name","adjustment_type","adjustment_policy","doctype_item"]',
        {
          method: 'GET',
          headers: {
            'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || 
          `Failed to fetch adjustment policies: ${response.status} ${response.statusText}`
        );
      }
      
      const data = await response.json();
      
      if (!data.data) {
        throw new Error('Invalid response format from server');
      }
      
      // Map the API response to match our table structure
      const formattedData: TableAdjustmentPolicy[] = data.data.map((item: any) => ({
        name: item.name || '',
        adjustment_policy: item.adjustment_policy || '',
        adjustment_type: item.adjustment_type || '',
        doctype_item: item.doctype_item || ''
      }));
      
      setPolicies(formattedData);
    } catch (error: any) {
      console.error("Error fetching adjustment policies:", error);
      toast.error(error.message || "Failed to load adjustment policies. Please check your authentication and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);
  const columns: Column[] = [
    {
      key: "action",
      label: "Actions",
      searchable: false,
      render: (row: unknown) => {
        const policy = row as TableAdjustmentPolicy;
        return (
          <div className="flex gap-2">
            <Trash 
              size={16} 
              color={defaultColor?.main_blue} 
              className="cursor-pointer hover:opacity-70" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDeletePolicy(policy.name);
              }} 
            />
            <Edit 
              size={16} 
              color={defaultColor?.main_blue} 
              className="cursor-pointer hover:opacity-70" 
              onClick={(e) => {
                e.stopPropagation();
                handleEditPolicy(policy.name);
              }} 
            />
            <View 
              size={16} 
              color={defaultColor?.main_blue} 
              className="cursor-pointer hover:opacity-70"
              onClick={(e) => {
                e.stopPropagation();
                // Handle view if needed
              }}
            />
          </div>
        );
      },
    },
    { key: "name", label: "Name", searchable: true },
    { key: "adjustment_policy", label: "Adjustment Policy", searchable: true },
    { key: "adjustment_type", label: "Adjustment Type", searchable: true },
    { key: "doctype_item", label: "Based On", searchable: true },
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

  // Initialize form fields when component mounts
  useEffect(() => {
    // Set initial form fields (without based_on)
    setState({ 
      formFields: [...state.baseFormFields]
    });
  }, []);

  // Handle row selection
  const toggleRowSelection = (id: string) => {
    setState({
      policyRows: state.policyRows.map((row: PolicyDetailRow) =>
        row.id === id ? { ...row, selected: !row.selected } : row
      ),
    });
  };

  // Select all rows
  const toggleSelectAll = (checked: boolean) => {
    setState({
      policyRows: state.policyRows.map((row: PolicyDetailRow) => ({
        ...row,
        selected: checked,
      })),
    });
  };

  // Update form fields when adjustment type changes
  const handleAdjustmentTypeChange = (value: string) => {
    const showBasedOn = value === 'attendance_policies' || value === 'leave_type';
    
    // Start with base fields (excluding based_on)
    let updatedFields = [...state.baseFormFields];
    
    // Update based_on options based on selection
    let basedOnOptions = [];
    if (value === 'attendance_policies') {
      basedOnOptions = [
        { value: 'Late_Arrival', label: 'Late Arrival Policy' },
        { value: 'Early_Departure', label: 'Early Departure Policy' },
      ];
    } else if (value === 'leave_type') {
      basedOnOptions = state.leave_types_options;
    }
    
    // If we need to show the based_on field, add it to the form
    if (showBasedOn) {
      // Check if based_on field already exists
      const basedOnFieldIndex = updatedFields.findIndex(field => field.input_name === 'based_on');
      
      const basedOnField = {
        input_name: 'based_on',
        input_label: 'Based On',
        placeholder: 'Select Option',
        type: 'select',
        required: true,
        grid_size: 4,
        isDisable: false,
        options: basedOnOptions
      };
      
      if (basedOnFieldIndex === -1) {
        // Add based_on field after adjustment_type
        const adjustmentTypeIndex = updatedFields.findIndex(field => field.input_name === 'adjustment_type');
        if (adjustmentTypeIndex !== -1) {
          updatedFields.splice(adjustmentTypeIndex + 1, 0, basedOnField);
        }
      } else {
        // Update existing based_on field
        updatedFields[basedOnFieldIndex] = {
          ...updatedFields[basedOnFieldIndex],
          options: basedOnOptions,
          required: true
        };
      }
    } else {
      // Remove based_on field if it exists
      updatedFields = updatedFields.filter(field => field.input_name !== 'based_on');
    }
    
    const updates: any = { 
      formFields: updatedFields,
      adjustment_type: value,
    };
    
    if (!showBasedOn) {
      updates.based_on = '';
    }
    
    setState(updates);
  };

  const handleEditPolicy = async (policyName: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://erp.thebenchmark.com.pk/api/resource/Leave%20Adjustment%20Policy/${encodeURIComponent(policyName)}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`,
            'Accept': 'application/json',
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch policy details');
      }

      const policyData = await response.json();
      
      // Map the API response to your form state
      const formUpdates: any = {
        adjustment_policy: policyData.data.adjustment_policy || '',
        adjustment_type: policyData.data.adjustment_type || '',
        based_on: policyData.data.doctype_item || '',
        policyRows: policyData.data.table_ijwa?.map((item: any, index: number) => ({
          id: index.toString(),
          leave_type: item.leave_type || '',
          priority: state.priorityOptions.find((opt: any) => opt.label === item.Priority)?.value || 1,
          days: item.Days || 0,
          selected: false
        })) || []
      };

      setState({
        ...state,
        ...formUpdates,
        dialog_open: true
      });
      
      setIsEditing(true);
      setCurrentPolicyName(policyName);
    } catch (error) {
      console.error("Error fetching policy:", error);
      toast.error(error instanceof Error ? error.message : "Error loading policy");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPolicy = async () => {
    try {
      const isValid = validateForm(state.formFields, state);
      if (!isValid) return;

      // Get selected rows
      const selectedRows = state.policyRows.filter((row: PolicyDetailRow) => row.selected);
      
      if (selectedRows.length === 0) {
        toast.error("Please select at least one leave type");
        return;
      }

      // Format the request data according to the API spec
      const requestData = {
        adjustment_type: state.formFields.find((f: { input_name: string }) => f.input_name === 'adjustment_type')?.options
          .find((opt: { value: string }) => opt.value === state.adjustment_type)?.label || state.adjustment_type,
        adjustment_policy: state.adjustment_policy || '',
        doctype_item: state.based_on 
          ? state.formFields.find((f: { input_name: string }) => f.input_name === 'based_on')?.options
              .find((opt: { value: string }) => opt.value === state.based_on)?.label || state.based_on
          : '',
        table_ijwa: selectedRows.map((row: PolicyDetailRow) => ({
          leave_type: state.leave_types_options.find((opt: any) => opt.value === row.leave_type)?.label || row.leave_type,
          Priority: state.priorityOptions.find((opt: any) => opt.value === row.priority)?.label || 'First',
          Days: row.days
        }))
      };

      console.log("Sending to API:", requestData);
      
      // Determine the API endpoint and method based on whether we're creating or updating
      const url = isEditing 
        ? `https://erp.thebenchmark.com.pk/api/resource/Leave%20Adjustment%20Policy/${encodeURIComponent(currentPolicyName)}`
        : 'https://erp.thebenchmark.com.pk/api/resource/Leave%20Adjustment%20Policy';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      // API call
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`
        },
        body: JSON.stringify({
          ...requestData
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to save policy');
      }

      const result = await response.json();
      console.log("API Response:", result);

      toast.success(`Leave Adjustment Policy ${isEditing ? 'updated' : 'created'} successfully`);
      setState({ 
        ...state,
        dialog_open: false, 
        policyRows: [],
        adjustment_policy: '',
        adjustment_type: '',
        based_on: ''
      });
      setIsEditing(false);
      setCurrentPolicyName('');
      fetchPolicies();
    } catch (error) {
      console.error("Error creating policy:", error);
      toast.error(error instanceof Error ? error.message : "Error creating policy");
    }
  };

  const addNewPolicyRow = () => {
    const newRow = {
      id: Date.now().toString(),
      leave_type: "",
      priority: 1, // Default to First priority
      days: 0,
      selected: false
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

  // Get the display value for a field
  const getDisplayValue = (value: string, fieldName: string) => {
    if (fieldName === 'leave_type') {
      const option = state.leave_types_options.find((opt: any) => opt.value === value);
      return option ? option.label : value;
    } else if (fieldName === 'priority') {
      const option = state.priorityOptions.find((opt: any) => opt.value === value);
      return option ? option.label : value;
    }
    return value;
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
        onSave={handleSubmitPolicy}
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
                    {field.type === 'select' ? (
                      <CustomSelectField
                        name={field.input_name}
                        label={field.input_label}
                        value={state[field.input_name] || ''}
                        onChange={(e) => {
                          if (field.input_name === 'adjustment_type') {
                            handleAdjustmentTypeChange(e.target.value);
                          } else {
                            setState({ [field.input_name]: e.target.value });
                          }
                        }}
                        placeholder={field.placeholder}
                        options={field.options || []}
                        required={field.required}
                      />
                    ) : (
                      <CustomTextField
                        input_value={state[field.input_name as keyof typeof state] as string}
                        onchange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          setState({ [field.input_name]: e.target.value })
                        }
                        required={field.required}
                        input_name={field.input_name}
                        error={!state[field.input_name as keyof typeof state] && field.required}
                        placeholder={field.placeholder}
                        input_label={field.input_label}
                        isDisable={field.isDisable}
                        startIcon={field.startIcon}
                      />
                    )}
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
                      <th className="border border-gray-300 p-2 text-left text-sm w-12">
                        <input 
                          type="checkbox" 
                          className="form-checkbox h-4 w-4"
                          checked={state.policyRows.length > 0 && state.policyRows.every((row: PolicyDetailRow) => row.selected)}
                          onChange={(e) => toggleSelectAll(e.target.checked)}
                        />
                      </th>
                      <th className="border border-gray-300 p-2 text-left text-sm">S.No</th>
                      <th className="border border-gray-300 p-2 text-left text-sm">Leave Type</th>
                      <th className="border border-gray-300 p-2 text-left text-sm">Priority</th>
                      <th className="border border-gray-300 p-2 text-left text-sm">Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.policyRows.map((row: PolicyDetailRow, index: number) => (
                      <tr 
                        key={row.id} 
                        className={row.selected ? 'bg-blue-50' : ''}
                        onClick={() => toggleRowSelection(row.id)}
                      >
                        <td className="border border-gray-300 p-2 text-center">
                          <input 
                            type="checkbox" 
                            className="form-checkbox h-4 w-4"
                            checked={!!row.selected}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleRowSelection(row.id);
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </td>
                        <td className="border border-gray-300 p-2 text-sm" onClick={(e) => e.stopPropagation()}>
                          {index + 1}
                        </td>
                        <td className="border border-gray-300 p-2" onClick={(e) => e.stopPropagation()}>
                          <CustomSelectField
                            name={`leave_type_${row.id}`}
                            label=""
                            value={row.leave_type}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                              updatePolicyRow(row.id, "leave_type", e.target.value)
                            }
                            placeholder="Select Leave Type"
                            options={state.leave_types_options}
                          />
                        </td>
                        <td className="border border-gray-300 p-2" onClick={(e) => e.stopPropagation()}>
                          <CustomSelectField
                            name={`priority_${row.id}`}
                            label=""
                            value={row.priority.toString()}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                              updatePolicyRow(row.id, "priority", parseInt(e.target.value) || 1)
                            }
                            placeholder="Select Priority"
                            options={state.priorityOptions}
                            required={true}
                          />
                        </td>
                        <td className="border border-gray-300 p-2" onClick={(e) => e.stopPropagation()}>
                          <CustomTextField
                            input_value={row.days.toString()}
                            onchange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                              updatePolicyRow(row.id, "days", parseInt(e.target.value) || 0)
                            }
                            input_name={`days_${row.id}`}
                            placeholder="Enter Days"
                            input_label=""
                            input_type="number"
                          />
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

  async function handleDeletePolicy(policyName: string) {
    try {
      setLoading(true);
      // Optimistically update the UI
      setPolicies(prevPolicies => {
        const updatedPolicies = prevPolicies.filter(policy => policy.name !== policyName);
        return updatedPolicies;
      });

      const response = await fetch(
        `https://erp.thebenchmark.com.pk/api/resource/Leave%20Adjustment%20Policy/${encodeURIComponent(policyName)}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`,
            'Accept': 'application/json',
          },
          // Prevent browser from caching this request
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        // If the API call fails, revert the UI
        setPolicies(prevPolicies => [...prevPolicies]);
        throw new Error('Failed to delete policy');
      }

      toast.success('Policy deleted successfully');
    } catch (error: any) {
      console.error('Error deleting policy:', error);
      toast.error(error.message || 'Failed to delete policy');
      // Refresh the data to ensure consistency
      fetchPolicies();
    } finally {
      setLoading(false);
    }
  }
}

export default LeaveAdjustmentPolicy;
