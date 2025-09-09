"use client";

import React, { useState } from 'react';

type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

type SelectedDays = Record<DayOfWeek, boolean>;

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (scheduleData: any) => void;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    inTime: '',
    outTime: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [selectedDays, setSelectedDays] = useState<SelectedDays>({
    Monday: true,
    Tuesday: false,
    Wednesday: false,
    Thursday: false,
    Friday: false,
    Saturday: false,
    Sunday: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDayToggle = (day: DayOfWeek) => {
    setSelectedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate required fields
      if (!formData.inTime) {
        throw new Error('In Time is required');
      }
      if (!formData.outTime) {
        throw new Error('Out Time is required');
      }
      if (!formData.startDate) {
        throw new Error('Start Date is required');
      }
      if (!formData.endDate) {
        throw new Error('End Date is required');
      }

      // Get selected days
      const activeDays = Object.entries(selectedDays)
        .filter(([_, isSelected]) => isSelected)
        .map(([day, _]) => day);

      if (activeDays.length === 0) {
        throw new Error('Please select at least one day');
      }

      // Generate unique employee ID to avoid conflicts
      const uniqueEmployeeId = `TBM${Date.now().toString().slice(-4)}`;
      
      // Prepare the API payload - use existing shift type
      const payload = {
        employee: uniqueEmployeeId,
        company: "The Benchmark",
        shift_type: "FDC Weekday", // Use existing shift type from the system
        status: "Active",
        start_date: formData.startDate,
        end_date: formData.endDate,
        frequency: "Every Week",
        repeat_on_days: activeDays
      };

      console.log('Saving schedule with payload:', payload);

      // Try direct ERP API first, fallback to local API if needed
      let response;
      try {
        response = await fetch('https://erp.thebenchmark.com.pk/api/method/hrms.api.roster.create_shift_schedule_assignment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `token ${process.env.NEXT_PUBLIC_ERP_TOKEN}`,
          },
          body: JSON.stringify(payload)
        });
      } catch (directError) {
        console.log('Direct API failed, trying local API route...');
        // Fallback to local API route
        response = await fetch('/api/method/hrms.api.roster.create_shift_schedule_assignment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle specific error types
        if (errorData.exc_type === 'OverlappingShiftError') {
          const errorMessage = errorData.exception || 'Shift assignment overlaps with existing assignment';
          throw new Error(`Overlapping Shift Error: ${errorMessage}`);
        }
        
        throw new Error(`API Error: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`);
      }

      const result = await response.json();
      console.log('Schedule saved successfully:', result);
      
      // Show success message with details
      alert(`✅ Schedule saved successfully!\n\nEmployee ID: ${uniqueEmployeeId}\nShift Type: ${payload.shift_type}\nPeriod: ${payload.start_date} to ${payload.end_date}\nDays: ${activeDays.join(', ')}`);
      
      // Call the onSave callback
      onSave?.(formData);
      
      // Close the modal
      onClose();
      
    } catch (err) {
      console.error('Error saving schedule data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to save schedule data';
      setError(errorMessage);
      
      // Show a more user-friendly error message
      if (errorMessage.includes('Overlapping Shift Error')) {
        alert('❌ Overlapping Shift Error\n\nThis employee already has an active shift assignment that overlaps with the selected period.\n\nPlease:\n• Choose a different date range\n• End the existing shift assignment first\n• Or select a different employee');
      } else {
        alert('Error saving schedule: ' + errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-[90vw] max-w-md flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu */}
            <button className="p-2 hover:bg-gray-200 rounded-md">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold text-[#2878aa]">Schedule</h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-md"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Save & Close Button */}
          <div className="mb-6">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 bg-[#2878aa] hover:bg-[#1e5a7a] disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              <span>{loading ? 'Saving...' : 'Save & Close'}</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* In Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                In Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={formData.inTime}
                  onChange={(e) => handleInputChange('inTime', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="--:-- --"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Out Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Out Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={formData.outTime}
                  onChange={(e) => handleInputChange('outTime', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="--:-- --"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Copy To Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Copy To
                </label>
                <button className="p-1 hover:bg-gray-100 rounded">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>

              {/* Day Selection Checkboxes */}
              <div className="grid grid-cols-3 gap-3">
                {days.map((day) => (
                  <label key={day} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDays[day]}
                      onChange={() => handleDayToggle(day)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{day}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;