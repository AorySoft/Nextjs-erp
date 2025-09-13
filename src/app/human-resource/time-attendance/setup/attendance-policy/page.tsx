"use client";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import DashboardLayout from "@/components/shared/DashboardLayout";
import DataTable from "@/components/ui/DataTable";
import { Edit, Trash, ChevronDown, SquareUserRound } from "lucide-react";
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
import { toast } from "react-toastify";
import apiClient from "@/services/apiClient";
import EditableDataTable from "@/components/ui/EditableDataTable";
import Button from "@/components/ui/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
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

  // const [state, setState] = useReducer(
  //   (state: any, newState: any) => ({ ...state, ...newState }),
  //   {

  //     employee_dialog: false,
  //     AbsentPolicy: [
  //       {
  //         id: 1,
  //         start_time: 0,
  //         end_time: 60,
  //         period_type: "Daily",
  //         type: "Count",
  //         value: 1,
  //       },
  //       {
  //         id: 2,
  //         start_time: 0,
  //         end_time: 60,
  //         period_type: "Daily",
  //         type: "Count",
  //         value: 1,
  //       },
  //     ],
  //   }
  // );
  const [state, setState] = useReducer(
    (state: any, newState: any) => ({ ...state, ...newState }),
    {
      employee_dialog: false,
      AbsentPolicy: [
        {
          id: 1,
          period_type: "00:00",
          // end_time: "00:60",
          policy_count: 0,
          absent_count: 0,
          // period_type: "Daily",
          // type: "Count",
          // value: 1,
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
  useEffect(() => {
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
  // absentPolcy
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);

  const deleteRows = () => {
    try {
      const updatedData = state.AbsentPolicy.filter(
        (row: any) => !selectedIds.includes(row.id)
      );
      setState({ AbsentPolicy: updatedData });
      setSelectedIds([]); // clear selection
    } catch (err) {
      console.error("Error deleting rows:", err);
    }
  };
  const addRow = useCallback(() => {
    const currentList = state.AbsentPolicy ?? [];

    // Find max id for uniqueness
    const maxId = currentList.length
      ? Math.max(...currentList.map((item: any) => item.id))
      : 0;

    const newRow = {
      id: maxId + 1,
      period_type: "00:00",
      // end_time: "00:60",
      policy_count: 0,
      absent_count: 0,
    };

    // ✅ Use concat (faster than spread for large arrays)
    setState({
      AbsentPolicy: currentList.concat(newRow),
    });
  }, [state.AbsentPolicy, setState]);

  const handleDataChange = (updatedData: any[]) => {
    console.log("Updated Table Data:", updatedData);
  };

  //
  // Policy
  const [selectedIdsPolicy, setSelectedIdsPolicy] = useState<
    (string | number)[]
  >([]);
  const handlePolicyChange = useCallback((updatedData: any[]) => {
    setState((prev:any) => {
      if (JSON.stringify(prev.Policy) === JSON.stringify(updatedData)) {
        return prev; // Skip update if data didn't change
      }
      return { ...prev, Policy: updatedData };
    });
  }, []);

  /** ✅ Memoized function to handle selected rows */
  const handleSelectionChange = useCallback((selectedIds: (string | number)[]) => {
    setState((prev:any) => ({
      ...prev,
      selectedPolicyIds: selectedIds,
    }));
  }, []);

  const deleteRowsPolicy = () => {
    try {
      const updatedData = state.Policy.filter(
        (row: any) => !selectedIds.includes(row.id)
      );
      setState({ Policy: updatedData });
      setSelectedIds([]); // clear selection
    } catch (err) {
      console.error("Error deleting rows:", err);
    }
  };
  const addRowPolicy = useCallback(() => {
    const currentList = state.Policy ?? [];

    // Find max id for uniqueness
    const maxId = currentList.length
      ? Math.max(...currentList.map((item: any) => item.id))
      : 0;

    const newRow = {
      id: maxId + 1,
      start_time: "00:00",
      end_time: "00:60",
      period_type: "Daily",
      type: "Count",
      value: 1,
    };

    // ✅ Use concat (faster than spread for large arrays)
    setState({
      Policy: currentList.concat(newRow),
    });
  }, [state?.Policy, setState]);

  const handleDataChangePolicy = (updatedData: any[]) => {
    console.log("Updated Table Data:", updatedData);
  };
  const createPolicy = async () => {
    // console.log(state, "s->>>>");
    try {
      const send_object = {
        policy_name: state?.policy_name,
        policy_type: state?.policy_type,
        no_of_excuse: Number(state?.no_of_excuse), //int
        policy: state?.Policy?.map((item: any) => {
          return {
            start_time: Number(item.start_time), //int
            end_time: Number(item.end_time), //int
            period_type: item.period_type, //Select Daily or Monthly
            type: item.type, //Select Count, Excuse, Absent
            value: Number(item.value), //int
          };
        }),
        absent_policy: state?.AbsentPolicy?.map((item: any) => {
          return {
            period_type: item.period_type, //Select Daily or Monthly
            policy_count: Number(item.policy_count), //int
            absent_count: item.absent_count,
          };
        }),
      };
      const resp = await apiClient.post("/resource/Attendance Policies", send_object);  
      console.log(resp, "resp");
      toast.success("Policy created successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error creating policy:", error);
      toast.error("Failed to create policy");
    }
  };
  return (
    <>
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
            <Button
              icon={faPlus}
              variant="secondary"
              onClick={() => {
                // setIsModalOpen(true);
                setState({ employee_dialog: true });
                // addRow();
              }}
            >
              New
            </Button>
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
        onSave={() => createPolicy()}
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
                      input_name="policy_id"
                      input_value={state.policy_id}
                      onchange={(
                        e: React.ChangeEvent<
                          HTMLInputElement | HTMLTextAreaElement
                        >
                      ) => setState({ policy_id: e.target.value })}
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
                      options={state?.AttendancePoliciesOptions_ ?? [{value:"Late Arrival", label:"Late Arrival"}, {value:"Early Departure", label:"Early Departure"}]}
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
          <Button
            icon={faPlus}
            variant="secondary"
            onClick={() => {
              console.log(state, "s->>>>");
            }}
          >
            state
          </Button>
          <Box
            sx={{
              width: "100%",
              display: state?.policy_type ? "block" : "none",
            }}
          >
            {/* Tabs header */}
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Policy " />
              <Tab label="AbsentPolicy " />
            </Tabs>

            {/* Tab panels */}
            <TabPanel value={value} index={0}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 12 }} display={"flex"} gap={"10px"}>
                  {" "}
                  <Button
                    icon={faPlus}
                    variant="secondary"
                    onClick={() => {
                      // setIsModalOpen(true);
                      addRowPolicy();
                    }}
                  >
                    New
                  </Button>
                  <Button
                    icon={faTrash}
                    variant="secondary"
                    onClick={() => {
                      // setIsModalOpen(true);
                      deleteRowsPolicy();
                    }}
                  >
                    Delete
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
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
                      {
                        key: "value",
                        label: "Value",
                        editable: true,
                        type: "input",
                      },
                    ]}
                    data={state?.Policy ?? []}
                    // onDataChange={handleDataChange}
                    // onDataChange={handlePolicyChange}
                    onDataChange={(updatedData) =>
                      setState({ Policy: updatedData })
                    }
                    onSelectionChange={handleSelectionChange}
                  />
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 12 }}>
                  {" "}
                  <Button icon={faPlus} variant="secondary" onClick={addRow}>
                    New
                  </Button>
                  <Button
                    icon={faTrash}
                    variant="secondary"
                    onClick={() => {
                      // setIsModalOpen(true);
                      deleteRows();
                    }}
                  >
                    Delete
                  </Button>
                </Grid>
                <Grid>
                  {" "}
                  <EditableDataTable
                    columns={[
                      {
                        key: "period_type",
                        label: "Periodtype",
                        editable: true,
                        type: "select",
                        options: ["Daily", "Monthly", "None"],
                      },
                      {
                        key: "policy_count",
                        label: "Policy count",
                        editable: true,
                        type: "input",
                      },
                      {
                        key: "absent_count",
                        label: "Absent count",
                        editable: true,
                        type: "input",
                      },

                      // "start_time": 0,//int
                      // "end_time": 60,//int
                      // "period_type": "Daily",//Select Daily or Monthly
                      // "type": "Count",//Select Count, Excuse, Absent
                      // "value": 1 //int
                    ]}
                    data={
                      state?.AbsentPolicy ?? [
                        {
                          id: 1,
                          start_time: 0,
                          end_time: 60,
                          period_type: "Daily",
                          type: "Count",
                          value: 1,
                        },
                        {
                          id: 2,
                          start_time: 0,
                          end_time: 60,
                          period_type: "Daily",
                          type: "Count",
                          value: 1,
                        },
                      ]
                    }
                    onDataChange={(updatedData) =>
                      setState({ AbsentPolicy: updatedData })
                    }
                    onSelectionChange={(ids) => setSelectedIds(ids)} // ✅ Capture selected rows
                    // onDataChange={handleDataChange}
                  />
                </Grid>
              </Grid>
            </TabPanel>
          </Box>
        </div>
      </MuiDialog>

      {/* <MuiDialog></MuiDialog> */}
    </>
  );
};

export default AttendancePolicy;
