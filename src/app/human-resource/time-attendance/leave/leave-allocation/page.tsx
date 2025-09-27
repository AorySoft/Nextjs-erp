"use client";
import React, { useState, useEffect, useReducer } from "react";

import DataTable from "@/components/ui/DataTable";
import { Edit, Trash, View, Plus, ChevronDown } from "lucide-react";
import MuiDialog from "@/components/ui/DialogBox";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Box,
  Tabs,
  Tab,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";
import { defaultColor } from "@/utils/constant";
import CustomSelectField from "@/components/ui/CustomSelectField";
import CustomDateInputField from "@/components/ui/DatePicker";
import { toast } from "react-toastify";

interface LeaveQuotaAllocation {
  name: string;
  leave_type: string;
  transaction_type: string;
  transaction_sub_type: string;
  payroll_period: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{ padding: "10px" }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const LeaveQuotaAllocation = () => {
  const [leaveQuotaAllocations, setLeaveQuotaAllocations] = useState<LeaveQuotaAllocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [value, setValue] = React.useState(0);

  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      // Form field values
      name: '',
      leave_type: '',
      transaction_type: '',
      transaction_sub_type: '',
      payroll_period: '',
      
      // Form field configurations
      basicFormFields: [
        {
          input_name: "leave_type",
          input_label: "Leave Type",
          placeholder: "Select Leave Type",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
          options: [
            { value: "Annual Leave", label: "Annual Leave" },
            { value: "Sick Leave", label: "Sick Leave" },
            { value: "Personal Leave", label: "Personal Leave" },
          ],
        },
        {
          input_name: "transaction_type",
          input_label: "Transaction Type",
          placeholder: "Select Transaction Type",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
          options: [
            { value: "Opening", label: "Opening" },
            { value: "Allocation", label: "Allocation" },
            { value: "Adjustment", label: "Adjustment" },
          ],
        },
        {
          input_name: "transaction_sub_type",
          input_label: "Transaction Sub Type",
          placeholder: "Enter Transaction Sub Type",
          type: "text",
          required: true,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
        {
          input_name: "payroll_period",
          input_label: "Payroll Period",
          placeholder: "Enter Payroll Period",
          type: "text",
          required: true,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
      ],

      leave_quota_allocation_dialog: false,
    }
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const fetchLeaveQuotaAllocations = async () => {
    try {
      setLoading(true);
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/resource/Leave%20Quota%20Allocation?limit=100&fields=["name","leave_type","transaction_type","transaction_sub_type","payroll_period"]`;
      
      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        toast.error('Failed to fetch leave quota allocations. Please check console for details.');
        return;
      }
      
      const result = await response.json();
      
      if (result.data) {
        // Map the API response to match our table structure
        const formattedData = result.data.map((item: any, index: number) => ({
          id: index + 1, // Add sequential ID for S.No
          name: item.name,
          leave_type: item.leave_type,
          transaction_type: item.transaction_type,
          transaction_sub_type: item.transaction_sub_type,
          payroll_period: item.payroll_period
        }));
        
        setLeaveQuotaAllocations(formattedData);
      }
    } catch (error) {
      console.error("Error fetching leave quota allocations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveQuotaAllocations();
  }, []);

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
              handleEdit(row);
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

  const validateForm = (formFields: any[], formState: any) => {
    for (const field of formFields) {
      if (field.required && field.isDisable === false) {
        const value = formState[field.input_name];
        if (!value || value.toString().trim() === "") {
          toast.error(`${field.input_label} is required`);
          return false;
        }
      }
    }
    return true;
  };

  const fetchLeaveQuotaAllocationById = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/resource/Leave%20Quota%20Allocation/${encodeURIComponent(id)}`,
        {
          headers: {
            'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch leave quota allocation details');
      }

      const data = await response.json();
      
      // Map the API response to form state
      const formState = {
        name: data.data.name,
        leave_type: data.data.leave_type,
        transaction_type: data.data.transaction_type,
        transaction_sub_type: data.data.transaction_sub_type,
        payroll_period: data.data.payroll_period,
      };

      setState(formState);
    } catch (error) {
      console.error('Error fetching leave quota allocation:', error);
      toast.error('Failed to load leave quota allocation details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (allocation: LeaveQuotaAllocation) => {
    setEditingId(allocation.name);
    fetchLeaveQuotaAllocationById(allocation.name);
    setState({ leave_quota_allocation_dialog: true });
  };

  const deleteLeaveQuotaAllocation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leave quota allocation?')) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/resource/Leave%20Quota%20Allocation/${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete leave quota allocation');
      }

      toast.success('Leave quota allocation deleted successfully');
      fetchLeaveQuotaAllocations(); // Refresh the list
    } catch (error) {
      console.error('Error deleting leave quota allocation:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete leave quota allocation');
    }
  };

  const resetForm = () => {
    setState({
      name: '',
      leave_type: '',
      transaction_type: '',
      transaction_sub_type: '',
      payroll_period: '',
    });
    setEditingId(null);
  };

  const handleSaveLeaveQuotaAllocation = async () => {
    try {
      const isValid = validateForm(state.basicFormFields, state);
      if (!isValid) return;

      const payload = {
        data: {
          name: state.name,
          leave_type: state.leave_type,
          transaction_type: state.transaction_type,
          transaction_sub_type: state.transaction_sub_type,
          payroll_period: state.payroll_period,
          doctype: 'Leave Quota Allocation',
          docstatus: 0,
          idx: 0
        }
      };

      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/resource/Leave%20Quota%20Allocation/${encodeURIComponent(editingId)}`
        : `${process.env.NEXT_PUBLIC_API_URL}/resource/Leave%20Quota%20Allocation`;

      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        toast.error(errorData.message || `Failed to ${editingId ? 'update' : 'create'} leave quota allocation`);
        return;
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      toast.success(`Leave Quota Allocation ${editingId ? 'updated' : 'created'} successfully`);
      setState({ leave_quota_allocation_dialog: false });
      resetForm();
      fetchLeaveQuotaAllocations();
    } catch (error) {
      console.error(`Error ${editingId ? 'updating' : 'creating'} leave quota allocation:`, error);
      toast.error(`Error ${editingId ? 'updating' : 'creating'} leave quota allocation`);
    }
  };

  return (
    <>
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Leave Quota Allocation</h1>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                resetForm();
                setState({ leave_quota_allocation_dialog: true });
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
            <div className="text-gray-600">Loading leave quota allocations...</div>
          </div>
        ) : (
          <DataTable columns={columns} data={leaveQuotaAllocations} />
        )}
      </div>

      <MuiDialog
        open={state?.leave_quota_allocation_dialog}
        onClose={() => {
          setState({ leave_quota_allocation_dialog: false });
          resetForm();
        }}
        multiple_btn={true}
        title={`${editingId ? 'Edit' : 'Create New'} Leave Quota Allocation`}
        description={false}
        maxWidth="lg"
        onSave={handleSaveLeaveQuotaAllocation}
      >
        <div id="leave_quota_allocation-parent">
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
                {state?.basicFormFields?.map((field: any, index: number) => (
                  <Grid
                    key={field.input_name || index}
                    size={{
                      xs: 12,
                      md: field.grid_size,
                    }}
                  >
                    {field?.type === "date" ? (
                      <CustomDateInputField
                        input_label={field.input_label}
                        input_name={field.input_name}
                        input_value={state[field.input_name]}
                        onchange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          setState({
                            ...state,
                            [field.input_name]: e.target.value,
                          })
                        }
                        required={field.required}
                      />
                    ) : field?.type === "select" ? (
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
                    ) : (
                      <CustomTextField
                        input_value={state[field.input_name] || ''}
                        onchange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                          setState({
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
                        input_type={field.type || 'text'}
                      />
                    )}
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>
        </div>
      </MuiDialog>
    </>
  );
};

export default LeaveQuotaAllocation;
