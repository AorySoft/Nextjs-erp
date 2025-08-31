"use client";
import React, { useState, useEffect, useReducer } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import DataTable from "@/components/ui/DataTable";
import EmployeeProfileModal from "@/components/ui/EmployeeProfileModal";
import { Edit, Trash, View, Plus, ChevronDown } from "lucide-react";
import { EmployeeData, api, employeeAPI } from "@/services/api";
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
import { Bounce, toast } from "react-toastify";

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
       formFields : [
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
          input_name: "employment_type",
          input_label: "Employment Type",
          placeholder: "Enter employment type",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "permanent", label: "Permanent" },
            { value: "contract", label: "Contract" },
            { value: "other", label: "Other" },
          ],
        },
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
            { value: "permanent", label: "Permanent" },
            { value: "contract", label: "Contract" },
            { value: "other", label: "Other" },
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
          input_name: "department",
          input_label: "Department",
          placeholder: "Enter department",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "Manager", label: "Manager" },
            { value: "Team Lead", label: "Team Lead" },
            { value: "Developer", label: "Developer" },
          ],
        },

        {
          input_name: "emp_designation",
          input_label: "Designation",
          placeholder: "Enter designation",
          type: "select",
          required: true,
          startIcon: <></>,
          grid_size: 4,
          isDisable: false,
          options: [
            { value: "Manager", label: "Manager" },
            { value: "Team Lead", label: "Team Lead" },
            { value: "Developer", label: "Developer" },
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

  // Fetch employees from API when component mounts
  const fetchEmployessDesignation = async () => {
    try {
      
      const response_designation = await employeeAPI.getDesignation();
      console.log("Fetched designation from API:", response_designation);
      const designations = response_designation?.data?.map((dep: any) => ({
        value: dep.name, // or dep.code, adjust as needed
        label: dep.name,
      }));
      console.log("Departments-->:", designations);
      // Update only the `emp_department` field options
      const updatedFields = [...state.employmentFormFields];

      // Update only the field at index 5
      updatedFields[6] = {
        ...updatedFields[6],
        options: designations,
      };

      // Update state
      setState({
        ...state,
        employmentFormFields: updatedFields,
      });
    } catch (error) {
      console.log("Error fetching designation:", error);
    }
  };

  const fetchEmployessDepartment = async () => {
    try {
      const response_department = await employeeAPI.getDepartment();
      // console.log("Fetched department from API:", response_department);
      const departments = response_department?.data?.map((dep: any) => ({
        value: dep.name, // or dep.code, adjust as needed
        label: dep.name,
      }));
      console.log("Departments-->:", departments);
      // Update only the `emp_department` field options
      const updatedFields = [...state.employmentFormFields];

      // Update only the field at index 5
      updatedFields[5] = {
        ...updatedFields[5],
        options: departments,
      };

      // Update state
      setState({
        ...state,
        employmentFormFields: updatedFields,
      });
    } catch (error) {
      console.log("Error fetching department:", error);
    }
  };
  //
  useEffect(() => {
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

    fetchEmployees();
    fetchEmployessDesignation();
    fetchEmployessDepartment();
  }, []);
  const columns = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: () => (
        <div className="flex gap-2">
          <Trash size={20} />
          <Edit size={20} />
          <View size={20} />
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
  for (let field of formFields) {
    if (field.required&&field.isDisable==false) {
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
  const handleCreateEmployee=async()=>{
  try {
    
    const isValid_1 = validateForm(state?.formFields, state);
    if (!isValid_1) return;
    const isValid_2 = validateForm(state?.personalFormFields, state);
    if (!isValid_2) return;

    const isValid = validateForm(state.employmentFormFields, state);
    console.log("handleCreateEmployee",isValid);

    if (!isValid) return;
  
    // ✅ proceed with API call
    // console.log("Form is valid, submitting...", state);   
    
  } catch (error) {
    
  }  
  }

  const handleSaveEmployee = (employeeData: EmployeeData) => {
    // Add the new employee to the list
    const newEmployee: TableEmployee = {
      name: employeeData.name || employeeData.first_name || "",
      attendance_device_id:
        employeeData.attendance_device_id || employeeData.machine_code || "",
      employee_name: `${employeeData.first_name || ""} ${
        employeeData.last_name || ""
      }`.trim(),
      branch: employeeData.company || "The Benchmark",
      designation: employeeData.designation || "",
      department: employeeData.department || "",
      cell_number: employeeData.contact_no || "",
      custom_employment_category: employeeData.custom_employment_category || "",
      employment_type: employeeData.employment_type || "",
    };

    setEmployees((prev) => [...prev, newEmployee]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev: any) => ({
      ...prev,
      [name]: value, // dynamically update field by input name
    }));
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
        onClose={(reason: any) => {
          setState({ employee_dialog: false });
        }}
        multiple_btn={true}
        title="Employee Profile"
        // description="This action cannot be undone. Are/ ou sure?"
        description={false}
        maxWidth="lg"
        onSave={()=>handleCreateEmployee()}
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
                  {state?.formFields?.map((field: any) => {
                    return (
                      <Grid
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
                            onchange={(e: any) =>
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
                          />
                        ) : (
                          <CustomTextField
                            input_value={state[field.input_name]}
                            onchange={(e: any) =>
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
                  {state?.personalFormFields?.map((field: any) => {
                    return (
                      <Grid
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
                            onchange={(e: any) =>
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
                            onchange={(e: any) =>
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
                  })}
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
                  {state?.employmentFormFields?.map((field: any) => {
                    return (
                      <Grid
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
                            onchange={(e: any) =>
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
                            onchange={(e: any) =>
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
                  })}
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
