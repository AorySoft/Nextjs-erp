"use client";
import { useState, useEffect } from 'react';
import { Box, Card, Typography, FormControl, InputLabel, MenuItem, Button } from '@mui/material';
import { Search } from '@mui/icons-material';
import DataTable from '@/components/ui/DataTable';
import DatePicker from '@/components/ui/DatePicker';
import CustomSelectField from '@/components/ui/CustomSelectField';
import request from '@/services/apiClient';

interface Employee {
  value: string;
  label: string;
}

interface AttendanceRecord {
  key: string;
  date: string;
  day_name: string;
  employee: string;
  employee_name: string;
  status: string;
  shift_in: string;
  shift_out: string;
  actual_in: string;
  actual_out: string;
  late_minutes: number;
  early_minutes: number;
}

export default function DailyAttendanceData() {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [dateRange, setDateRange] = useState<[string, string]>(['', '']);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);

  // Table columns configuration
  const columns:any = [
    { 
      key: 'date', 
      label: 'Date',
      sortable: true 
    },
    { 
      key: 'day_name', 
      label: 'Day',
      sortable: true
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (row: AttendanceRecord) => (
        <span style={{ 
          color: getStatusColor(row.status),
          fontWeight: 500
        }}>
          {row.status}
        </span>
      )
    },
    { 
      key: 'shift_in', 
      label: 'Shift In' 
    },
    { 
      key: 'shift_out', 
      label: 'Shift Out' 
    },
    { 
      key: 'actual_in', 
      label: 'Actual In' 
    },
    { 
      key: 'actual_out', 
      label: 'Actual Out' 
    },
    { 
      key: 'late_minutes', 
      label: 'Late (mins)',
      render: (row: AttendanceRecord) => row.late_minutes || '--'
    },
    { 
      key: 'early_minutes', 
      label: 'Early (mins)',
      render: (row: AttendanceRecord) => row.early_minutes || '--'
    }
  ];

  // Fetch employees for the dropdown
  useEffect(() => {
   const fetchEmployees = async () => {
  try {
    setLoading(true);
    const response: any = await request.get(
      '/resource/Employee?fields=["name","attendance_device_id","employee_name","branch","designation","department","cell_number","custom_employment_category","employment_type"]&limit_page_length=0'
    );

    if (response && Array.isArray(response.data)) {
      const employeeOptions = response.data.map((emp: any) => ({
        value: emp.name,
        label: `${emp.employee_name} (${emp.name})`,
        ...emp // Include all employee data in case it's needed later
      }));
      
      setEmployees(employeeOptions);
    }
  } catch (error) {
    console.error('Error fetching employees:', error);
  } finally {
    setLoading(false);
  }
};

    fetchEmployees();
  }, []);

  const fetchAttendanceData = async () => {
    if (!selectedEmployee) {
      // You might want to use your toast notification here
      console.warn('Please select an employee');
      return;
    }

    try {
      setLoading(true);
      const [startDate, endDate] = dateRange;
      
      const response:any = await request.post('/method/get_attendance_summary', {
        start_date: startDate,
        end_date: endDate,
        employee: selectedEmployee,
      });
      if(response?.message.records){
const formattedData = response.message.records.map((record: any) => ({
        key: record.attendance_date,
        date: record.attendance_date,
        day_name: record.day_name,
        employee: record.employee,
        employee_name: record.employee_name,
        status: record.status,
        shift_in: record.shift_in || '--:--',
        shift_out: record.shift_out || '--:--',
        actual_in: record.actual_in || '--:--',
        actual_out: record.actual_out || '--:--',
        late_minutes: record.late_minutes,
        early_minutes: record.early_minutes
      }));

      setAttendanceData(formattedData);
      }
      else{
      setAttendanceData([]);

      }
      
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'present': return '#52c41a';
      case 'absent': return '#f5222d';
      case 'leave': return '#faad14';
      case 'holiday': return '#722ed1';
      case 'weekly-off': return '#13c2c2';
      default: return 'inherit';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Daily Attendance Data
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, 
          mb: 3,
          alignItems: 'flex-end'
        }}>
          <FormControl sx={{ minWidth: 250 ,display: 'flex', 
          flexWrap: 'wrap', 
          gap: 2, }}>
            <CustomSelectField
              label="Employee"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              options={employees}
            />
             <DatePicker
            input_label="Start Date"
            input_value={dateRange[0]}
            onchange={(e) => setDateRange([e.target.value, dateRange[1]])}
          />

          <DatePicker
            input_label="End Date"
            input_value={dateRange[1]}
            onchange={(e) => setDateRange([dateRange[0], e.target.value])}
          />
          <Button
            variant="contained"
            onClick={fetchAttendanceData}
            disabled={loading}
            startIcon={<Search />}
            sx={{ 
              height: 30,
              minWidth: 100
            }}
          >
            Search
          </Button>
          </FormControl>

         

          
        </Box>

        <DataTable
          columns={columns}
          data={attendanceData}
          defaultLimit={10}
        />
      </Card>
    </Box>
  );
}