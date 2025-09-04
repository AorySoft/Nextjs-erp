"use client";
import React, { useState, useEffect, useReducer } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import DataTable from "@/components/ui/DataTable";
import EmployeeProfileModal from "@/components/ui/EmployeeProfileModal";
import { Edit, Trash, View, Plus, ChevronDown, SquareUserRound } from "lucide-react";
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

const EmployeeProfile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employees, setEmployees] = useState<TableEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState(0);

  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      //basic information
      formFields: [
        {
          input_name: "emp_id",
          input_label: "Employee ID",
          placeholder: "Enter employee id",
          type: "text",
          required: true,
          startIcon: <></>,
          grid_size: 6,
          isDisable: true,
        },
        {
          input_name: "short_code",
          input_label: "Short Code",
          placeholder: "Enter short code",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
        {
          input_name: "machine_code",
          input_label: "Machine Code",
          placeholder: "Enter machine code",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
        {
          input_name: "date_of_joining",
          input_label: "Joining Date",
          placeholder: "Enter joining date",
          type: "date",
          required: true,
          startIcon: <></>,
          grid_size: 6,
          isDisable: false,
        },
        {
          input_name: "first_name",
          input_label: "First Name",
          placeholder: "Enter first name",
          type: "text",
          required: true,
          startIcon: <></>,
          grid_size: 12,
          isDisable: false,
        },
        {
          input_name: "last_name",
          input_label: "Last Name",
          placeholder: "Enter last name",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 12,
          isDisable: false,
        },

        // ... add all 32 fields here
      ],

      //
      // personal information
      personalFormFields: [
        {
          input_name: "date_of_birth",
          input_label: "Birth Date",
          placeholder: "Enter birth date",
          type: "date",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "gender",
          input_label: "Gender",
          placeholder: "Enter gender",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ],
        },
        {
          input_name: "custom_cnic",
          input_label: "CNIC",
          placeholder: "Enter CNIC",
          type: "text",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },

        {
          input_name: "blood_group",
          input_label: "Blood Group",
          placeholder: "Enter blood group",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "A+", label: "A+" },
            { value: "A-", label: "A-" },
            { value: "B+", label: "B+" },
            { value: "B-", label: "B-" },
            { value: "AB+", label: "AB+" },
            { value: "AB-", label: "AB-" },
            { value: "O+", label: "O+" },
            { value: "O-", label: "O-" },
          ],
        },
        {
          input_name: "nationality",
          input_label: "Nationality",
          placeholder: "Enter nationality",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "pakistan", label: "Pakistan" },
            { value: "other", label: "Other" },
          ],
        },
        {
          input_name: "birth_country",
          input_label: "Birth Country",
          placeholder: "Enter birth country",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "pakistan", label: "Pakistan" },
            { value: "other", label: "Other" },
          ],
        },
        {
          input_name: "birth_city",
          input_label: "Birth City",
          placeholder: "Enter birth city",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "karachi", label: "Karachi" },
            { value: "other", label: "Other" },
          ],
        },

        {
          input_name: "contact_no",
          input_label: "Contact No",
          placeholder: "Enter contact no",
          type: "text",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "whatsapp_no",
          input_label: "Whatsapp No",
          placeholder: "Enter whatsapp no",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "email",
          input_label: "Email",
          placeholder: "Enter email",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "caste",
          input_label: "Caste",
          placeholder: "Enter caste",
          type: "text",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        // ... add all 32 fields here
      ],
      //
      employmentFormFields: [
        
        {
          input_name: "custom_employment_category",
          input_label: "Employment Category",
          placeholder: "Enter employment category",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "Staff", label: "Staff" },
            { value: "Admin", label: "Admin" },
            { value: "Management", label: "Management" },
            { value: "Teacher", label: "Teacher" },
          ],
        },
        {
          input_name: "reporting_to",
          input_label: "Reporting To",
          placeholder: "Enter reporting to",
          type: "select",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "asad  ", label: "Asad" },
            { value: "ali", label: "Ali" },
            { value: "other", label: "Other" },
          ],
        },

        {
          type: "date",
          input_name: "appointment_date",
          input_label: "Appointment Date",
          placeholder: "Enter appointment date",
          required: false,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
        },
        {
          input_name: "emp_grade",
          input_label: "Employ Grade",
          placeholder: "Enter Grade",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "12", label: "12" },
            { value: "11", label: "11" },
            { value: "10", label: "10" },
          ],
        },
      
        {
          input_name: "company",
          input_label: "Site",
          placeholder: "Enter site",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "site1", label: "Site 1" },
            { value: "site2", label: "Site 2" },
            { value: "site3", label: "Site 3" },
            {value:"The Benchmark",label:"The Benchmark"}
          ],
        },
        {
          input_name: "emp_status",
          input_label: "Status",
          placeholder: "Enter status",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
        },

        // ... add all 32 fields here
      ],
      //
      employee_dialog: false,
      employee_name: "",
    }
  );
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  //

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const apiEmployees = await employeeAPI.getEmployees();

      // Transform API response to match our TableEmployee interface
      if (apiEmployees && Array.isArray(apiEmployees.data)) {
        const transformedEmployees = apiEmployees.data.map(
          (emp: APIEmployee) => ({
            name: emp.name || "",
            attendance_device_id: emp.attendance_device_id || "",
            employee_name: emp.employee_name || "",
            branch: emp.branch || "",
            designation: emp.designation || "",
            department: emp.department || "",
            cell_number: emp.cell_number || "",
            custom_employment_category: emp.custom_employment_category || "",
            employment_type: emp.employment_type || "",
          })
        );
        setEmployees(transformedEmployees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  

  

  //
  const fetchFormOptions = async () => {
    try {
      const [departmentsRes, designationsRes, employmentTypesRes]:any = await Promise.all([
        apiClient.get(`/resource/Department?limit=100`),
        apiClient.get(`/resource/Designation?limit=100`),
        apiClient.get(`/resource/Employment Type?limit=100`),
      ]);
  
      const departments_options:any = departmentsRes?.data?.map((item: any) => ({
        value: item.name,
        label: item.name,
      })) ?? [];
      setState({departments_options});
      // {
      //   input_name: "department",
      //   input_label: "Department",
      //   placeholder: "Enter department",
      //   type: "select",
      //   required: true,
      //   startIcon: <></>,
      //   grid_size: 4,
      //   isDisable: false,
      //   options: [{ value: "manager", label: "manager" }],
      // },

      // {
      //   input_name: "emp_designation",
      //   input_label: "Designation",
      //   placeholder: "Enter designation",
      //   type: "select",
      //   required: true,
      //   startIcon: <></>,
      //   grid_size: 4,
      //   isDisable: false,
      //   options: [{ value: "manager", label: "manager" }],
      // },



  
      const designations:any = designationsRes?.data?.map((item: any) => ({
        value: item.name,
        label: item.name,
      })) ?? [];
      setState({designations_options:designations});
  
      const employmentTypes:any = employmentTypesRes?.data?.map((item: any) => ({
        value: item.name,
        label: item.name,
      })) ?? [];
      setState({employment_types_options:employmentTypes});
  
      // ✅ single update, no overwrite
   
  
    } catch (err) {
      console.error("❌ Error fetching form options:", err);
    }
  };
  
  
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res: any = await apiClient.get(
          '/resource/Employee?fields=["name","attendance_device_id","employee_name","branch","designation","department","cell_number","custom_employment_category","employment_type"]&limit_page_length=0'
        );
        
  
  
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
    { key: "name", label: "Employee ID", searchable: true },
    { key: "attendance_device_id", label: "Device ID", searchable: true },
    { key: "employee_name", label: "Employee Name", searchable: true },
    { key: "branch", label: "Branch", searchable: true },
    { key: "designation", label: "Designation", searchable: true },
    { key: "department", label: "Department", searchable: true },
    { key: "cell_number", label: "Contact", searchable: true },
    {
      key: "custom_employment_category",
      label: "Emp Category",
      searchable: true,
    },
    { key: "employment_type", label: "Employment Type", searchable: true },
  ];
  // function for cehcking mandotary fields
  const validateForm = (formFields: any[], formState: any) => {
    for (const field of formFields) {
      if (field.required && field.isDisable == false) {
        const value = formState[field.input_name];

        if (!value || value.toString().trim() === "") {
          toast.error(`${field.input_label} is required`);
          console.log(`${field.input_label} is required`);

          return false; // stop at first missing field
        }
      }
    }
    return true; // all good
  };
  // create employee function
  const handleCreateEmployee = async () => {
    try {
      const isValid_1 = validateForm(state?.formFields, state);
      if (!isValid_1) return;
      const isValid_2 = validateForm(state?.personalFormFields, state);
      if (!isValid_2) return;

      const isValid = validateForm(state.employmentFormFields, state);
      if (!isValid) return;

      //name gender date_of_birth custom_cnic custom_employment_category company department department date_of_joining attendance_device_id first_name
      const send_object = {
        name: `${state.first_name} ${state.last_name}`,
        gender: state.gender,
        date_of_birth: state.date_of_birth,
        custom_cnic: state.custom_cnic,
        custom_employment_category: state.custom_employment_category,
        company: state?.company,
        department: state?.department,
        date_of_joining: state.date_of_joining,
        attendance_device_id: state.machine_code,
        first_name: state.first_name,
        designation: state.emp_designation,
        employment_type: state.employment_type,
        contact: state.contact,
        employee_type: state.employee_type,
        employee_id: `TBM${state.machine_code}`,
      };
      //
      console.log("send_object", send_object);
      const queryString = new URLSearchParams(send_object as any).toString();
      const response = await apiClient.post(`/resource/Employee?${queryString}`);
      console.log("Response from API:", response);
      if (response) {
        toast.success("Employee created successfully");
        setState({ employee_dialog: false });
        fetchEmployees();
      }
      console.log("Response from API:", response);
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };
 
  return (
    <DashboardLayout>
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Employee Profile
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
              New Employee
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-600">Loading employees...</div>
          </div>
        ) : (
          <DataTable columns={columns} data={employees} />
        )}

        <EmployeeProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          // onSave={handleSaveEmployee}
        />
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
        onSave={() => handleCreateEmployee()}
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
                  {state?.formFields?.map((field: any, index: number) => {
                    return (
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
                            required={field.required}
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
                            required={field.required}
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
                    );
                  })}
                
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
                <Grid
                  size={{
                    xs: 12,
                    md: 12,
                  }}
                  container
                  spacing={2}
                  key="employement-data"
                >
                  {state?.employmentFormFields?.map(
                    (field: any, index: number) => {
                      return (
                        <Grid
                          key={field.input_name || `employment-${index}`}
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
                <Grid
                        key={"123"}
                        size={{
                          xs: 12,
                          md: 4,
                        }}
                      >
                        <CustomSelectField
                            name="country"
                            label="Department"
                            value={state["department"]}
                            onChange={(e) =>
                              setState({
                                ...state,
                                ["department"]: e.target.value,
                              })
                            }
                            placeholder="Department"
                            options={state.departments_options??[]}
                            required={true}
                          />

                      </Grid>
                      <Grid
                        key={"123"}
                        size={{
                          xs: 12,
                          md: 4,
                        }}
                      >
                        <CustomSelectField
                            name="country"
                            label="emp_designation"
                            value={state["emp_designation"]}
                            onChange={(e) =>
                              setState({
                                ...state,
                                ["emp_designation"]: e.target.value,
                              })
                            }
                            placeholder="Designation"
                            options={state.designations_options??[]}
                            required={true}
                          />

                      </Grid>
                      <Grid
                        key={"123"}
                        size={{
                          xs: 12,
                          md: 4,
                        }}
                      >
                        <CustomSelectField
                            name="country"
                            label="Employment Type"
                            value={state["employment_type"]}
                            onChange={(e) =>
                              setState({
                                ...state,
                                ["employment_type"]: e.target.value,
                              })
                            }
                            placeholder="Employment Type"
                            options={state.employment_types_options??[]}
                            required={true}
                          />

                      </Grid>
              </Grid>
            </TabPanel>
          </Box>

          {/* Content */}
        </div>
      </MuiDialog>
    </DashboardLayout>
  );
};

export default EmployeeProfile;
