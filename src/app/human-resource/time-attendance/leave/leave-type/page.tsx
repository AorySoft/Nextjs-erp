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
  code: string;
  leave_type: string;
  leave_unit: string;
  leaves: number;
  renew_on: string;
  max_avail_unit?: string;
  marital_status?: string;
  gender?: string;
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
  const [value, setValue] = React.useState(0);

  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      // Basic Information fields
      basicFormFields: [
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
          input_name: "renew_on",
          input_label: "Renew On",
          placeholder: "Select Renew On",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
          options: [
            { value: "calendar_year", label: "Every calendar year" },
            { value: "joining_date", label: "Every joining date" },
            { value: "monthly", label: "Monthly" },
            { value: "quarterly", label: "Quarterly" },
          ],
        },
        {
          input_name: "leave_type",
          input_label: "Leave Type",
          placeholder: "Enter Leave Type",
          type: "text",
          required: true,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
        {
          input_name: "leave_unit",
          input_label: "Leave Unit",
          placeholder: "Select Leave Unit",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
          options: [
            { value: "days", label: "Days" },
            { value: "hours", label: "Hours" },
          ],
        },
        {
          input_name: "leaves",
          input_label: "Leaves",
          placeholder: "Enter Leaves",
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
          input_name: "max_avail_unit",
          input_label: "Max Avail Unit",
          placeholder: "Enter Max Avail",
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
          input_name: "max_avail",
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
            { value: "single", label: "Single" },
            { value: "married", label: "Married" },
            { value: "divorced", label: "Divorced" },
            { value: "widowed", label: "Widowed" },
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
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
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
            { value: "joining_date", label: "Joining Date" },
            { value: "calendar_year", label: "Calendar Year" },
            { value: "monthly", label: "Monthly" },
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
            { value: "monthly", label: "Monthly" },
            { value: "quarterly", label: "Quarterly" },
            { value: "yearly", label: "Yearly" },
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
            { value: "days", label: "Days" },
            { value: "hours", label: "Hours" },
            { value: "weeks", label: "Weeks" },
          ],
        },
      ],

      // Checkbox states
      allow_in_prob: false,
      quota_validate: false,
      paid_leave: false,
      late_adjustable: false,
      include_holidays: false,
      early_dep_adjustable: false,

      leave_type_dialog: false,
    }
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const fetchLeaveTypes = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockData = [
        { code: "01", leave_type: "Annual Leave (15d)", leave_unit: "Days", leaves: 15, renew_on: "Every calendar year" },
        { code: "02", leave_type: "Annual Leaves (6d)", leave_unit: "Days", leaves: 6, renew_on: "Every calendar year" },
        { code: "03", leave_type: "Umrah Leaves", leave_unit: "Days", leaves: 25, renew_on: "Every calendar year" },
        { code: "04", leave_type: "Medical Leaves for HOD's", leave_unit: "Days", leaves: 30, renew_on: "Every calendar year" },
        { code: "05", leave_type: "Watchman leaves (for family)", leave_unit: "Days", leaves: 32, renew_on: "Every calendar year" },
        { code: "06", leave_type: "Unpaid Leaves", leave_unit: "Days", leaves: 31, renew_on: "Every calendar year" },
        { code: "07", leave_type: "Emergency", leave_unit: "Days", leaves: 31, renew_on: "Every calendar year" },
        { code: "08", leave_type: "Maternity leaves", leave_unit: "Days", leaves: 45, renew_on: "Every calendar year" },
        { code: "09", leave_type: "Winter vacations", leave_unit: "Days", leaves: 10, renew_on: "Every calendar year" },
        { code: "10", leave_type: "Summer vacations", leave_unit: "Days", leaves: 45, renew_on: "Every calendar year" },
      ];
      setLeaveTypes(mockData);
    } catch (error) {
      console.error("Error fetching leave types:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveTypes();
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
    { key: "leave_type", label: "Leave Type", searchable: true },
    { key: "leave_unit", label: "Leave Unit", searchable: true },
    { key: "leaves", label: "Leaves", searchable: true },
    { key: "renew_on", label: "Renew On", searchable: true },
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

  const handleCreateLeaveType = async () => {
    try {
      const isValid = validateForm(state.basicFormFields, state);
      if (!isValid) return;

      const send_object = {
        code: state.code,
        leave_type: state.leave_type,
        leave_unit: state.leave_unit,
        leaves: state.leaves,
        renew_on: state.renew_on,
        max_avail_unit: state.max_avail_unit,
        marital_status: state.marital_status,
        gender: state.gender,
        entitle_on: state.entitle_on,
        accrual_unit: state.accrual_unit,
        entitle_leaves: state.entitle_leaves,
        request_before: state.request_before,
        request_unit: state.request_unit,
        allow_in_prob: state.allow_in_prob,
        quota_validate: state.quota_validate,
        paid_leave: state.paid_leave,
        late_adjustable: state.late_adjustable,
        include_holidays: state.include_holidays,
        early_dep_adjustable: state.early_dep_adjustable,
      };

      console.log("send_object", send_object);
      // Replace with actual API call
      // const response = await apiClient.post(`/resource/LeaveType`, send_object);
      
      toast.success("Leave Type created successfully");
      setState({ leave_type_dialog: false });
      fetchLeaveTypes();
    } catch (error) {
      console.error("Error creating leave type:", error);
      toast.error("Error creating leave type");
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
              onClick={() => setState({ leave_type_dialog: true })}
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
        onClose={() => setState({ leave_type_dialog: false })}
        multiple_btn={true}
        title="Leave Type"
        description={false}
        maxWidth="lg"
        onSave={() => handleCreateLeaveType()}
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
                        type={field.type}
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
                        type={field.type}
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
                        type={field.type}
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
                          checked={state.paid_leave}
                          onChange={(e) => setState({ paid_leave: e.target.checked })}
                        />
                      }
                      label="Paid Leave"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={state.late_adjustable}
                          onChange={(e) => setState({ late_adjustable: e.target.checked })}
                        />
                      }
                      label="Late Adjustable"
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
                        type={field.type}
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