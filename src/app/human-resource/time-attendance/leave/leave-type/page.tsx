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

interface TableLeaveType {
  name: string;
  leave_type_name: string;
  max_leaves_allowed: number;
  custom_leave_unit: string | null;
  custom_renew_on: string | null;
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

const LeaveType = () => {
  const [leaveTypes, setLeaveTypes] = useState<TableLeaveType[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [value, setValue] = React.useState(0);

  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      // Form field values
      code: '',
      leave_type_name: '',
      custom_leave_unit: 'Days',
      custom_renew_on: 'Every Calendar Year',
      max_leaves_allowed: '',
      max_continuous_days_allowed: '',
      max_avail_unit: 'days',
      carry_forward: '',
      encashment: '',
      marital_status: '',
      gender: '',
      entitle_on: '',
      accrual_unit: '',
      entitle_leaves: '',
      request_before: '',
      request_unit: 'Days',
      
      // Form field configurations
      // Basic Information fields
      basicFormFields: [
        // {
        //   input_name: "code",
        //   input_label: "Code",
        //   placeholder: "Enter Code",
        //   type: "text",
        //   required: false,
        //   startIcon: <></>,
        //   grid_size: 6,
        //   isDisable: false,
        // },
        {
          input_name: "custom_renew_on",
          input_label: "Renew On",
          placeholder: "Select Renew On",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
          options: [
            { value: "Every Calendar Year", label: "Every Calendar Year" },
            { value: "After a year of joining date", label: "After a year of joining date" },
          ],
        },
        {
          input_name: "leave_type_name",
          input_label: "Leave Type Name",
          placeholder: "Enter Leave Type Name",
          type: "text",
          required: true,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
        {
          input_name: "custom_leave_unit",
          input_label: "Leave Unit",
          placeholder: "Select Leave Unit",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
          options: [
            { value: "Days", label: "Days" },
            { value: "Hours", label: "Hours" },
          ],
        },
        {
          input_name: "max_leaves_allowed",
          input_label: "Max Leaves Allowed",
          placeholder: "Enter Max Leaves Allowed",
          type: "number",
          required: true,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
      ],

      // Policy fields
      policyFormFields: [
        {
          input_name: "max_continuous_days_allowed",
          input_label: "Max Continuous Days Allowed",
          placeholder: "Enter Max Continuous Days Allowed",
          type: "number",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "max_avail_unit",
          input_label: "Max Avail Unit",
          placeholder: "Select Max Avail Unit",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "days", label: "Days" },
            { value: "hours", label: "Hours" },
          ],
        },
        {
          input_name: "max_leaves_allowed",
          input_label: "Max Avail",
          placeholder: "Enter Max Avail",
          type: "number",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "carry_forward",
          input_label: "Carry Forward",
          placeholder: "Enter Carry Forward",
          type: "number",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "encashment",
          input_label: "Encashment",
          placeholder: "Enter Encashment",
          type: "number",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "marital_status",
          input_label: "Marital Status",
          placeholder: "Select Marital Status",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "Single", label: "Single" },
            { value: "Married", label: "Married" },
            { value: "Divorced", label: "Divorced" },
            { value: "Widowed", label: "Widowed" },
          ],
        },
        {
          input_name: "gender",
          input_label: "Gender",
          placeholder: "Select Gender",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ],
        },
      ],

      // Leave Entitle Policy fields
      entitlePolicyFields: [
        {
          input_name: "entitle_on",
          input_label: "Entitle On",
          placeholder: "Select Entitle On",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
          options: [
            { value: "Joining Date", label: "Joining Date" },
            { value: "Calendar Year", label: "Calendar Year" },
            { value: "Monthly", label: "Monthly" },
          ],
        },
        {
          input_name: "accrual_unit",
          input_label: "Accrual Unit",
          placeholder: "Select Accrual Unit",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
          options: [
            { value: "Monthly", label: "Monthly" },
            { value: "Quarterly", label: "Quarterly" },
            { value: "Yearly", label: "Yearly" },
          ],
        },
        {
          input_name: "entitle_leaves",
          input_label: "Leaves",
          placeholder: "Enter Leaves",
          type: "number",
          required: false,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
      ],

      // Restrictions fields
      restrictionFields: [
        {
          input_name: "request_before",
          input_label: "Request Before",
          placeholder: "Enter Request Before",
          type: "number",
          required: false,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
        {
          input_name: "request_unit",
          input_label: "Request Unit",
          placeholder: "Select Request Unit",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
          options: [
            { value: "Days", label: "Days" },
            { value: "Hours", label: "Hours" },
            { value: "Weeks", label: "Weeks" },
          ],
        },
      ],

      // Checkbox states
      allow_in_prob: false,  // Allow in Probation
      quota_validate: false, // Quota Validation
      is_lwp: false,         // Is Leave Without Pay
      custom_is_adjustable: false, // Is Adjustable
      include_holidays: false,    // Include Holidays
      early_dep_adjustable: false, // Early Departure Adjustable
      // Legacy states (keep for backward compatibility if needed)
      paid_leave: false,     // Legacy - use is_lwp instead
      late_adjustable: false, // Legacy - use custom_is_adjustable instead

      leave_type_dialog: false,
    }
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const fetchLeaveTypes = async () => {
    try {
      setLoading(true);
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/resource/Leave%20Type?limit=100&fields=["name","leave_type_name","max_leaves_allowed","custom_leave_unit","custom_renew_on"]`;
      
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
        toast.error('Failed to fetch leave types. Please check console for details.');
        return;
      }
      
      const result = await response.json();
      
      if (result.data) {
        // Map the API response to match our table structure
        const formattedData = result.data.map((item: any, index: number) => ({
          id: index + 1, // Add sequential ID for S.No
          name: item.name,
          leave_type_name: item.leave_type_name,
          max_leaves_allowed: item.max_leaves_allowed,
          custom_leave_unit: item.custom_leave_unit || 'Days', // Default to 'Days' if null
          custom_renew_on: item.custom_renew_on || 'Every calendar year' // Default if null
        }));
        
        setLeaveTypes(formattedData);
      }
    } catch (error) {
      console.error("Error fetching leave types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
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
              deleteLeaveType(row.name);
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
    { key: "leave_type_name", label: "Leave Type", searchable: true },
    { key: "max_leaves_allowed", label: "Max Leaves Allowed", searchable: true },
    { key: "custom_leave_unit", label: "Leave Unit", searchable: true },
    { key: "custom_renew_on", label: "Renew On", searchable: true },
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

  const fetchLeaveTypeById = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/resource/Leave%20Type/${encodeURIComponent(id)}`,
        {
          headers: {
            'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch leave type details');
      }

      const data = await response.json();
      
      // Map the API response to form state
      const formState = {
        name: data.data.name,
        leave_type_name: data.data.leave_type_name,
        max_leaves_allowed: data.data.max_leaves_allowed,
        custom_leave_unit: data.data.custom_leave_unit || 'Days',
        custom_renew_on: data.data.custom_renew_on || 'Every Calendar Year',
        max_continuous_days_allowed: data.data.max_continuous_days_allowed || 0,
        marital_status: data.data.marital_status || '',
        gender: data.data.gender || '',
        entitle_on: data.data.entitle_on || '',
        accrual_unit: data.data.accrual_unit || '',
        request_before: data.data.request_before || 0,
        request_unit: data.data.request_unit || 'Days',
        allow_in_prob: data.data.allow_in_prob === 1,
        quota_validate: data.data.quota_validate === 1,
        is_lwp: data.data.is_lwp === 1,
        custom_is_adjustable: data.data.custom_is_adjustable === 1,
        include_holidays: data.data.include_holidays === 1,
        early_dep_adjustable: data.data.early_dep_adjustable === 1,
      };

      setState(formState);
    } catch (error) {
      console.error('Error fetching leave type:', error);
      toast.error('Failed to load leave type details');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (leaveType: TableLeaveType) => {
    setEditingId(leaveType.name);
    fetchLeaveTypeById(leaveType.name);
    setState({ leave_type_dialog: true });
  };

  const deleteLeaveType = async (id: string) => {
    if (!confirm('Are you sure you want to delete this leave type?')) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/resource/Leave%20Type/${encodeURIComponent(id)}`,
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
        throw new Error(errorData.message || 'Failed to delete leave type');
      }

      toast.success('Leave type deleted successfully');
      fetchLeaveTypes(); // Refresh the list
    } catch (error) {
      console.error('Error deleting leave type:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete leave type');
    }
  };

  const resetForm = () => {
    setState({
      code: '',
      leave_type_name: '',
      custom_leave_unit: 'Days',
      custom_renew_on: 'Every Calendar Year',
      max_leaves_allowed: '',
      max_continuous_days_allowed: '',
      max_avail_unit: 'days',
      carry_forward: '',
      encashment: '',
      marital_status: '',
      gender: '',
      entitle_on: '',
      accrual_unit: '',
      entitle_leaves: '',
      request_before: '',
      request_unit: 'Days',
      allow_in_prob: false,
      quota_validate: false,
      is_lwp: false,
      custom_is_adjustable: false,
      include_holidays: false,
      early_dep_adjustable: false,
      paid_leave: false,
      late_adjustable: false,
    });
    setEditingId(null);
  };

  const handleSaveLeaveType = async () => {
    try {
      const isValid = validateForm(state.basicFormFields, state);
      if (!isValid) return;

      const payload = {
        data: {
          name: state.name,
          leave_type_name: state.leave_type_name,
          custom_leave_unit: state.custom_leave_unit || 'Days',
          max_leaves_allowed: parseFloat(state.max_leaves_allowed) || 0,
          custom_renew_on: state.custom_renew_on || 'Every Calendar Year',
          max_continuous_days_allowed: parseFloat(state.max_continuous_days_allowed) || 0,
          marital_status: state.marital_status,
          gender: state.gender,
          entitle_on: state.entitle_on,
          accrual_unit: state.accrual_unit,
          entitle_leaves: parseFloat(state.max_leaves_allowed) || 0,
          request_before: parseFloat(state.request_before) || 0,
          request_unit: state.request_unit || 'Days',
          allow_in_prob: state.allow_in_prob ? 1 : 0,
          quota_validate: state.quota_validate ? 1 : 0,
          is_lwp: state.is_lwp ? 1 : 0,
          custom_is_adjustable: state.custom_is_adjustable ? 1 : 0,
          include_holidays: state.include_holidays ? 1 : 0,
          early_dep_adjustable: state.early_dep_adjustable ? 1 : 0,
          doctype: 'Leave Type',
          docstatus: 0,
          idx: 0
        }
      };

      const url = editingId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/resource/Leave%20Type/${encodeURIComponent(editingId)}`
        : `${process.env.NEXT_PUBLIC_API_URL}/resource/Leave%20Type`;

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
        toast.error(errorData.message || `Failed to ${editingId ? 'update' : 'create'} leave type`);
        return;
      }
      
      const result = await response.json();
      console.log('API Response:', result);
      
      toast.success(`Leave Type ${editingId ? 'updated' : 'created'} successfully`);
      setState({ leave_type_dialog: false });
      resetForm();
      fetchLeaveTypes();
    } catch (error) {
      console.error(`Error ${editingId ? 'updating' : 'creating'} leave type:`, error);
      toast.error(`Error ${editingId ? 'updating' : 'creating'} leave type`);
    }
  };

  return (
    <>
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">Leave Type</h1>
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
                setState({ leave_type_dialog: true });
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
            <div className="text-gray-600">Loading leave types...</div>
          </div>
        ) : (
          <DataTable columns={columns} data={leaveTypes} />
        )}
      </div>

      <MuiDialog
        open={state?.leave_type_dialog}
        onClose={() => {
          setState({ leave_type_dialog: false });
          resetForm();
        }}
        multiple_btn={true}
        title={`${editingId ? 'Edit' : 'Create New'} Leave Type`}
        description={false}
        maxWidth="lg"
        onSave={handleSaveLeaveType}
      >
        <div id="leave_type-parent">
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

          <Box sx={{ width: "100%" }}>
            <Tabs value={value} onChange={handleChange} aria-label="leave type tabs">
              <Tab label="Policy" />
              <Tab label="Leave Entitle Policy" />
              <Tab label="Restriction(s)" />
            </Tabs>

            <TabPanel value={value} index={0}>
              <Grid container spacing={2}>
                {state?.policyFormFields?.map((field: any, index: number) => (
                  <Grid
                    key={field.input_name || `policy-${index}`}
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
            </TabPanel>

            <TabPanel value={value} index={1}>
              <Grid container spacing={2}>
                {state?.entitlePolicyFields?.map((field: any, index: number) => (
                  <Grid
                    key={field.input_name || `entitle-${index}`}
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
            </TabPanel>

            <TabPanel value={value} index={2}>
              <Grid container spacing={2}>
                {/* Checkbox restrictions */}
                <Grid size={{ xs: 12 }}>
                  <div className="grid grid-cols-2 gap-4">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.allow_in_prob}
                          onChange={(e) => setState({ allow_in_prob: e.target.checked })}
                        />
                      }
                      label="Allow in Prob"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.quota_validate}
                          onChange={(e) => setState({ quota_validate: e.target.checked })}
                        />
                      }
                      label="Quota Validate"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.is_lwp}
                          onChange={(e) => setState({ is_lwp: e.target.checked })}
                        />
                      }
                      label="Is Leave Without Pay"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.custom_is_adjustable}
                          onChange={(e) => setState({ custom_is_adjustable: e.target.checked })}
                        />
                      }
                      label="Is Adjustable"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.include_holidays}
                          onChange={(e) => setState({ include_holidays: e.target.checked })}
                        />
                      }
                      label="Include Holidays"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.early_dep_adjustable}
                          onChange={(e) => setState({ early_dep_adjustable: e.target.checked })}
                        />
                      }
                      label="Early Dep. Adjustable"
                    />
                  </div>
                </Grid>
                
                {/* Request Before and Request Unit fields */}
                {state?.restrictionFields?.map((field: any, index: number) => (
                  <Grid
                    key={field.input_name || `restriction-${index}`}
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
            </TabPanel>
          </Box>
        </div>
      </MuiDialog>
    </>
  );
};

export default LeaveType;