"use client";

import React, { useState, useEffect } from 'react';
import ScheduleModal from '@/components/ui/ScheduleModal';

interface ShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (shiftData: any) => void;
  onSaveAndClose?: (shiftData: any) => void;
}

const ShiftModal: React.FC<ShiftModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onSaveAndClose
}) => {
  const [formData, setFormData] = useState({
    code: '',
    shiftType: 'Time Based',
    shiftBasedOn: '',
    shiftDuration: '',
    shiftName: ''
  });

  const [selectedDay, setSelectedDay] = useState('Monday');
  const [schedules, setSchedules] = useState<any[]>([]);
  const [shiftData, setShiftData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Fetch shift data from API
  const fetchShiftData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resource/Shift Type/FDC Weekday`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setShiftData(data.data);
      
      // Convert API data to schedule format
      if (data.data) {
        const schedule = {
          id: 1,
          inTime: data.data.start_time || '',
          outTime: data.data.end_time || '',
          duration: calculateDuration(data.data.start_time, data.data.end_time),
          startDate: new Date().toISOString().split('T')[0], // Today's date
          endDate: '', // Can be left empty or set as needed
          remarks: data.data.name || 'FDC Weekday'
        };
        setSchedules([schedule]);
        
        // Populate form data with API data
        setFormData(prev => ({
          ...prev,
          code: data.data.name || '',
          shiftName: data.data.name || '',
          shiftType: 'Time Based',
          shiftDuration: calculateDuration(data.data.start_time, data.data.end_time)
        }));
      }
    } catch (err) {
      console.error('Error fetching shift data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch shift data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate duration between start and end time
  const calculateDuration = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return '';
    
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHours}h ${diffMinutes}m`;
  };

  // Fetch data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchShiftData();
    }
  }, [isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await saveShiftData();
      onSave?.(formData);
    } catch (error) {
      console.error('Error saving shift:', error);
    }
  };

  const handleSaveAndClose = async () => {
    try {
      await saveShiftData();
      onSaveAndClose?.(formData);
      onClose();
    } catch (error) {
      console.error('Error saving shift:', error);
    }
  };

  const saveShiftData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.shiftName) {
        throw new Error('Shift Name is required');
      }
      if (!formData.code) {
        throw new Error('Code is required');
      }

      // Calculate shift times from schedule data
      const inTime = schedules[0]?.inTime || '06:00:00';
      const outTime = schedules[0]?.outTime || '18:00:00';
      
      // Prepare the Shift Type creation payload
      const payload = {
        start_time: inTime,
        end_time: outTime,
        enable_auto_attendance: "1",
        name: `${formData.shiftName}_${Date.now()}`, // Make name unique to avoid duplicates
        determine_check_in_and_check_out: "Strictly based on Log Type in Employee Checkin",
        auto_update_last_sync: "1",
        custom_late_arrival_policy: "Late Arrival Policy (5 mins grace)",
        custom_early_departure_policy: "Early Departure Policy"
      };

      console.log('Creating shift type with payload:', payload);

      // Try direct ERP API first, fallback to local API if needed
      let response;
      try {
        // Create Shift Type using POST to resource endpoint
        const queryParams = new URLSearchParams(payload).toString();
        response = await fetch(`https://erp.thebenchmark.com.pk/api/resource/Shift Type?${queryParams}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`,
          }
        });
      } catch (directError) {
        console.log('Direct API failed, trying local API route...');
        // Fallback to local API route
        const queryParams = new URLSearchParams(payload).toString();
        response = await fetch(`/api/resource/Shift Type?${queryParams}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          }
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle specific error types
        if (errorData.exc_type === 'OverlappingShiftError') {
          const errorMessage = errorData.exception || 'Shift assignment overlaps with existing assignment';
          throw new Error(`Overlapping Shift Error: ${errorMessage}`);
        }
        
        if (errorData.exc_type === 'DuplicateEntryError') {
          const errorMessage = errorData.exception || 'A shift type with this name already exists';
          throw new Error(`Duplicate Entry Error: ${errorMessage}`);
        }
        
        if (errorData.exc_type === 'LinkValidationError') {
          const errorMessage = errorData.exception || 'Invalid shift type reference';
          throw new Error(`Validation Error: ${errorMessage}`);
        }
        
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log('Shift Type created successfully:', result);
      
      // Show success message with details
      alert(`✅ Shift Type created successfully!\n\nName: ${payload.name}\nStart Time: ${payload.start_time}\nEnd Time: ${payload.end_time}\nAuto Attendance: ${payload.enable_auto_attendance ? 'Enabled' : 'Disabled'}`);
      
    } catch (err) {
      console.error('Error saving shift data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save shift data';
      setError(errorMessage);
      
      // Show a more user-friendly error message
      if (errorMessage.includes('Overlapping Shift Error')) {
        alert('❌ Overlapping Shift Error\n\nThis employee already has an active shift assignment that overlaps with the selected period.\n\nPlease:\n• Choose a different date range\n• End the existing shift assignment first\n• Or select a different employee');
      } else if (errorMessage.includes('Duplicate Entry Error')) {
        alert('❌ Duplicate Entry Error\n\nA shift type with this name already exists in the system.\n\nPlease:\n• Use a different shift name\n• The system will automatically add a timestamp to make it unique');
      } else {
        alert('Error creating shift type: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getSelectedDays = () => {
    // Return the currently selected day and all weekdays for now
    // You can enhance this to track multiple selected days
    const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    
    // If a specific day is selected, include it
    if (selectedDay && weekdays.includes(selectedDay)) {
      return [selectedDay, ...weekdays.filter(day => day !== selectedDay)];
    }
    
    // Default to all weekdays
    return weekdays;
  };

  const checkForOverlappingShifts = async (employee: string, startDate: string, endDate: string) => {
    try {
      // You can add a check here to see if there are existing shifts
      // This would require another API call to get existing shift assignments
      // For now, we'll handle the error when it occurs
      return false;
    } catch (error) {
      console.error('Error checking for overlapping shifts:', error);
      return false;
    }
  };

  const addSchedule = () => {
    const newSchedule = {
      id: Date.now(),
      inTime: '',
      outTime: '',
      duration: '',
      startDate: '',
      endDate: '',
      remarks: ''
    };
    setSchedules(prev => [...prev, newSchedule]);
  };

  const updateSchedule = (id: number, field: string, value: string) => {
    setSchedules(prev => prev.map(schedule => 
      schedule.id === id ? { ...schedule, [field]: value } : schedule
    ));
  };

  const removeSchedule = (id: number) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] max-w-6xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu */}
            <button className="p-2 hover:bg-gray-200 rounded-md">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold text-[#2878aa] gray-900">Shift</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 text-[#2878aa] disabled:text-gray-400 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              <span>{loading ? 'Saving...' : 'Save'}</span>
            </button>
            
            <button
              onClick={handleSaveAndClose}
              disabled={loading}
              className="flex items-center space-x-2 text-[#2878aa] disabled:text-gray-400 px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              <span>{loading ? 'Saving...' : 'Save & Close'}</span>
            </button>
            
            <button
              onClick={onClose}
              className="flex items-center space-x-2 text-[#2878aa] px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Basic Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  placeholder="Enter Code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Shift Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.shiftType}
                    onChange={(e) => handleInputChange('shiftType', e.target.value)}
                    placeholder="Time Based"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Shift Based On */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift Based On
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.shiftBasedOn}
                    onChange={(e) => handleInputChange('shiftBasedOn', e.target.value)}
                    placeholder="Select shift based on"
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Shift Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift Duration
                </label>
                <input
                  type="text"
                  value={formData.shiftDuration}
                  onChange={(e) => handleInputChange('shiftDuration', e.target.value)}
                  placeholder="Enter Shift Duration"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date Range Info */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Period
                </label>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Start: {schedules[0]?.startDate || (() => {
                    const futureDate = new Date();
                    futureDate.setDate(futureDate.getDate() + 1);
                    return futureDate.toISOString().split('T')[0];
                  })()}</span>
                  <span>End: {schedules[0]?.endDate || (() => {
                    const futureDate = new Date();
                    futureDate.setDate(futureDate.getDate() + 31);
                    return futureDate.toISOString().split('T')[0];
                  })()}</span>
                </div>
                <p className="text-xs text-green-600 mt-1">
                  ✅ Using future dates to avoid conflicts with existing assignments
                </p>
              </div>

              {/* Shift Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shift Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.shiftName}
                  onChange={(e) => handleInputChange('shiftName', e.target.value)}
                  placeholder="Enter Shift Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Days of Week */}
          <div className="mb-6">
            <div className="flex space-x-2 mb-4">
              {days.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedDay === day
                      ? 'text-[#2878aa]'
                      : 'text-gray-600'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{day}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Add Schedule Button */}
          <div className="mb-4">
            <button
              onClick={() => setIsScheduleModalOpen(true)}
              className="flex items-center space-x-2 text-[#2878aa] px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Schedule</span>
            </button>
          </div>

          {/* Schedule Table */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      In Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Out Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Start Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      End Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                          <p className="text-gray-500 text-lg">Loading shift data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-12 h-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="text-red-500 text-lg">Error loading data</p>
                          <p className="text-gray-500 text-sm mt-2">{error}</p>
                        </div>
                      </td>
                    </tr>
                  ) : schedules.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-12 h-12 text-blue-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <p className="text-gray-500 text-lg">No Record Found</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    schedules.map((schedule, index) => (
                      <tr key={schedule.id}>
                        <td className="px-4 py-3">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="time"
                            value={schedule.inTime}
                            onChange={(e) => updateSchedule(schedule.id, 'inTime', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="time"
                            value={schedule.outTime}
                            onChange={(e) => updateSchedule(schedule.id, 'outTime', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={schedule.duration}
                            onChange={(e) => updateSchedule(schedule.id, 'duration', e.target.value)}
                            placeholder="Duration"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={schedule.startDate}
                            onChange={(e) => updateSchedule(schedule.id, 'startDate', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={schedule.endDate}
                            onChange={(e) => updateSchedule(schedule.id, 'endDate', e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={schedule.remarks}
                              onChange={(e) => updateSchedule(schedule.id, 'remarks', e.target.value)}
                              placeholder="Remarks"
                              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => removeSchedule(schedule.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={(scheduleData) => {
          console.log('Schedule saved:', scheduleData);
          // You can add the schedule to the main schedules array here if needed
        }}
      />
    </div>
  );
};

export default ShiftModal;
