"use client";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import DataTable from "@/components/ui/DataTable";
import {
  Edit,
  Trash,
  View,
  Plus,
  ChevronDown,
  SquareUserRound,
} from "lucide-react";
import { EmployeeData, employeeAPI } from "@/services/api";
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
} from "@mui/material";
import CustomTextField from "@/components/ui/CustomTextField";
import { defaultColor } from "@/utils/constant";
import CustomSelectField from "@/components/ui/CustomSelectField";
import CustomDateInputField from "@/components/ui/DatePicker";
import { toast } from "react-toastify";
import axios from "axios";
import apiClient from "@/services/apiClient";
import EditableDataTable from "@/components/ui/EditableDataTable";

interface TableEmployee {
  name: string;
  attendance_device_id: string;
  employee_name: string;
  branch: string;
  designation: string;
  department: string;
  cell_number: string;
  custom_employment_category: string;
  employment_type: string;
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
// Interface for API response employee data
interface APIEmployee {
  name?: string;
  attendance_device_id?: string;
  employee_name?: string;
  branch?: string;
  designation?: string;
  department?: string;
  cell_number?: string;
  custom_employment_category?: string;
  employment_type?: string;
}

//

//

const AttendancePolicy = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<TableEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState(0);

  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      //basic information
      //
      employee_dialog: false,
      AbsentPolicy:[
        {
          id: 1,
          start_time: 0,
          end_time: 60,
          period_type: "Daily",
          type: "Count",
          value: 1,
        },
        {
          id:2,
          start_time: 0,
          end_time: 60,
          period_type: "Daily",
          type: "Count",
          value: 1,
        },
      ],
    }
  );
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  //
  const fetchFormOptions = async () => {
    try {
      const [AttendancePoliciesRes]: any = await Promise.all([
        apiClient.get(`/resource/Attendance Policies`),
        // apiClient.get(`/resource/Designation?limit=100`),
        // apiClient.get(`/resource/Employment Type?limit=100`),
      ]);

      const AttendancePoliciesOptions: any =
        AttendancePoliciesRes?.data?.map((item: any) => ({
          value: item.name,
          label: item.name,
        })) ?? [];
      setState({ AttendancePoliciesOptions });

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

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res: any = await apiClient.get("/resource/Attendance Policies");
        console.log(res, "resp");

        if (res && Array.isArray(res.data)) {
          const transformedEmployees = res.data.map((emp: APIEmployee) => ({
            name: emp.name || "",
            attendance_device_id: emp.attendance_device_id || "",
            employee_name: emp.employee_name || "",
            branch: emp.branch || "",
            designation: emp.designation || "",
            department: emp.department || "",
            cell_number: emp.cell_number || "",
            custom_employment_category: emp.custom_employment_category || "",
            employment_type: emp.employment_type || "",
          }));
          setEmployees(transformedEmployees);
        }

        // parallel or sequential fetch
        fetchFormOptions();
      } catch (err: any) {
        console.error("API error ❌", err.response?.data || err.message);
      }
    };

    fetchAll();
    fetchFormOptions();
  }, []);

  const columns = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: () => (
        <div className="flex gap-2">
          <Trash size={16} color={defaultColor?.main_blue} />
          <Edit size={16} color={defaultColor?.main_blue} />
          <SquareUserRound size={16} color={defaultColor?.main_blue} />
        </div>
      ),
    },
    { key: "sno", label: "S.no", searchable: false },
    { key: "code", label: "Code", searchable: false },
    { key: "policy_name", label: "Policy Name", searchable: false },
    { key: "policy_type", label: "Policy Type", searchable: false },
  ];
  // function for cehcking mandotary fields

  // create employee function

  // eidtable datable work
  const columns_edit: any = [
    { key: "name", label: "Name", editable: true, type: "input" },
    {
      key: "status",
      label: "Status",
      editable: true,
      type: "select",
      options: ["Active", "Inactive", "Pending"],
    },
    { key: "role", label: "Role", editable: false }, // Non-editable field
  ];
  const addRow = useCallback(() => {
  try{
    const {AbsentPolicy} = state
    const newId = AbsentPolicy.length ? AbsentPolicy[AbsentPolicy.length - 1].id + 1 : 1;
    const newData = [...AbsentPolicy, { id: newId, start_time: 0, end_time: 60, period_type: "Daily", type: "Count", value: 1 }];
    setState({ AbsentPolicy: newData }); 
  }
  catch(err){
    console.log(err)
  }
  }, []);
  

  const handleDataChange = (updatedData: any[]) => {
    console.log("Updated Table Data:", updatedData);
  };
  
  //

  return (
    <DashboardLayout>
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Attendance Policy
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => {
                // setIsModalOpen(true);
                setState({ employee_dialog: true });
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
            <div className="text-gray-600">Loading...</div>
          </div>
        ) : (
          <DataTable columns={columns} data={employees} />
        )}
      </div>
      <MuiDialog
        open={state?.employee_dialog}
        onClose={() => {
          setState({ employee_dialog: false });
        }}
        multiple_btn={true}
        title="Employee Profile"
        // description="This action cannot be undone. Are/ ou sure?"
        description={false}
        maxWidth="lg"
        // onSave={() => handleCreateEmployee()}
      >
        <div id="employee_profile-parent">
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
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                  container
                  spacing={2}
                  key="employee_data"
                >
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomTextField
                      input_label="Code"
                      input_name="policy_name"
                      input_value={state.policy_name}
                      onchange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => setState({ policy_name: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomSelectField
                      name="policy_type"
                      label="Policy Type"
                      value={state.policy_type}
                      onChange={(e) =>
                        setState({
                          ...state,
                          policy_type: e.target.value,
                        })
                      }
                      placeholder="Pays"
                      options={state?.AttendancePoliciesOptions ?? []}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 12 }}>
                    <CustomTextField
                      input_label="Policy Name"
                      input_name="policy_name"
                      input_value={state.policy_name}
                      onchange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => setState({ policy_name: e.target.value })}
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomSelectField
                      name="calculation_basis"
                      label="calculation basis"
                      value={state.calculation_basis}
                      onChange={(e) =>
                        setState({
                          ...state,
                          calculation_basis: e.target.value,
                        })
                      }
                      placeholder="calculation basis"
                      options={[
                        { value: "Duration base", label: "Duration base" },
                        { value: "Actual min", label: "Actual min" },
                      ]}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <CustomTextField
                      input_label="No. of excuses"
                      input_name="no_of_excuse"
                      input_value={state.no_of_excuse}
                      onchange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => setState({ no_of_excuse: e.target.value })}
                      input_type="number"
                      required
                    />
                  </Grid>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                  id="employee_data_img"
                ></Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
          <Box sx={{ width: "100%" }}>
            {/* Tabs header */}
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Personal Information" />
              <Tab label="Employment " />
            </Tabs>

            {/* Tab panels */}
            <TabPanel value={value} index={0}>
              <Grid container spacing={2}>
                <Grid
                  size={{
                    xs: 12,
                    md: 12,
                  }}
                  container
                  spacing={2}
                  key="employee_data"
                >
                  {state?.personalFormFields?.map(
                    (field: any, index: number) => {
                      return (
                        <Grid
                          key={field.input_name || `personal-${index}`}
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
                              onchange={(
                                e: React.ChangeEvent<
                                  HTMLInputElement | HTMLTextAreaElement
                                >
                              ) =>
                                setState({
                                  ...state,
                                  [field.input_name]: e.target.value,
                                })
                              }
                              required
                            />
                          ) : field?.type === "select" ? (
                            <CustomSelectField
                              name="country"
                              label={field.input_label}
                              value={state[field.input_name]}
                              onChange={(e) =>
                                setState({
                                  ...state,
                                  [field.input_name]: e.target.value,
                                })
                              }
                              placeholder="Pays"
                              options={field.options}
                            />
                          ) : (
                            <CustomTextField
                              input_value={state[field.input_name]}
                              onchange={(
                                e: React.ChangeEvent<
                                  HTMLInputElement | HTMLTextAreaElement
                                >
                              ) =>
                                setState({
                                  ...state,
                                  [field.input_name]: e.target.value,
                                })
                              }
                              required
                              input_name={field.input_name}
                              error={!state[field.input_name]}
                              startIcon={field.startIcon}
                              placeholder={field.placeholder}
                              input_label={field.input_label}
                              isDisable={field.isDisable}
                            />
                          )}
                        </Grid>
                      );
                    }
                  )}
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 12 }}>
                  {" "}
                  <button
                    className="bg-transparent text-[#2878aa] px-2 py-1 rounded-1 hover:bg-[#cfefff]"
                    onClick={()=>{addRow()}}
                  >
                    + New
                  </button>
                  <button
                    className="bg-transparent text-[#2878aa] px-2 py-1 rounded-1 hover:bg-[#cfefff]"
                    // onClick={}
                  >
                    Delete
                  </button>
                </Grid>
                <Grid>
                  {" "}
                  <EditableDataTable
                    columns={[
                      {
                        key: "start_time",
                        label: "Start Time",
                        editable: true,
                        type: "input",
                      },
                      {
                        key: "end_time",
                        label: "End Time",
                        editable: true,
                        type: "input",
                      },
                      {
                        key: "period_type",
                        label: "Period Type",
                        editable: true,
                        type: "select",
                        options: ["Daily", "Monthly", "None"],
                      },
                      {
                        key: "type",
                        label: "Type",
                        editable: true,
                        type: "select",
                        options: [
                          "None",
                          "Count",
                          "Excuse",
                          "Absent",
                          "Half Day",
                        ],
                      },
                      // "start_time": 0,//int
                      // "end_time": 60,//int
                      // "period_type": "Daily",//Select Daily or Monthly
                      // "type": "Count",//Select Count, Excuse, Absent
                      // "value": 1 //int
                    ]}
                    data={state?.AbsentPolicy??[]}
                    onDataChange={handleDataChange}
                  />
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </div>
      </MuiDialog>
    </DashboardLayout>
  );
};

export default AttendancePolicy;
