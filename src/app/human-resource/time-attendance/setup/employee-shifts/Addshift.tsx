"use client";

import React, { useState, useEffect } from 'react';

interface AddShiftProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (shiftData: any) => void;
  onSaveAndClose?: (shiftData: any) => void;
}

const AddShift: React.FC<AddShiftProps> = ({
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

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

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
          <h2 className="text-xl font-bold text-[#2878aa]">Shift</h2>
          <button onClick={onClose} className="text-[#2878aa]">Close</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Add Schedule Button */}
          <div className="mb-4">
            <button
              onClick={addSchedule}
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
                    <th className="px-4 py-3">S.No</th>
                    <th className="px-4 py-3">In Time</th>
                    <th className="px-4 py-3">Out Time</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Start Date</th>
                    <th className="px-4 py-3">End Date</th>
                    <th className="px-4 py-3">Remarks</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {schedules.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-500">No schedules found</td>
                    </tr>
                  ) : (
                    schedules.map((schedule, index) => (
                      <tr key={schedule.id}>
                        <td className="px-4 py-3">{index + 1}</td>
                        <td className="px-4 py-3">
                          <input
                            type="time"
                            value={schedule.inTime}
                            onChange={(e) => updateSchedule(schedule.id, 'inTime', e.target.value)}
                            className="border px-2 py-1 rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="time"
                            value={schedule.outTime}
                            onChange={(e) => updateSchedule(schedule.id, 'outTime', e.target.value)}
                            className="border px-2 py-1 rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={schedule.duration}
                            onChange={(e) => updateSchedule(schedule.id, 'duration', e.target.value)}
                            className="border px-2 py-1 rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={schedule.startDate}
                            onChange={(e) => updateSchedule(schedule.id, 'startDate', e.target.value)}
                            className="border px-2 py-1 rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={schedule.endDate}
                            onChange={(e) => updateSchedule(schedule.id, 'endDate', e.target.value)}
                            className="border px-2 py-1 rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="text"
                            value={schedule.remarks}
                            onChange={(e) => updateSchedule(schedule.id, 'remarks', e.target.value)}
                            className="border px-2 py-1 rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => removeSchedule(schedule.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
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
    </div>
  );
};

export default AddShift;
