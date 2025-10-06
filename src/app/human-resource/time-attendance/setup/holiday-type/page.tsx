"use client";

import React, { useState, useEffect } from 'react';
import DataTable from '@/components/ui/DataTable';
import { Edit, Trash, SquareUserRound } from 'lucide-react';
import { defaultColor } from '@/utils/constant';
import { toast } from 'react-toastify';
import apiClient from '@/services/apiClient';
import Button from '@/components/ui/Button';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import MuiDialog from '@/components/ui/DialogBox';

interface ShiftTypeData {
  name: string;
  custom_shift_name: string | null;
  start_time: string;
  end_time: string;
  sno?: number;
}

const HolidayTypePage: React.FC = () => {
  const [shiftTypes, setShiftTypes] = useState<ShiftTypeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch shift type data on component mount
  const fetchShiftTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get('/resource/Shift Type?fields=["name","custom_shift_name", "start_time", "end_time" ]&limit_page_length=0');
      
      if (response && Array.isArray(response.data)) {
        const transformedData: ShiftTypeData[] = response.data.map((shift: any, index: number) => ({
          ...shift,
          sno: index + 1,
        }));
        setShiftTypes(transformedData);
      }
    } catch (err: any) {
      console.error('Error fetching shift types:', err);
      setError(err.response?.data || err.message);
      toast.error('Failed to fetch shift type data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShiftTypes();
  }, []);

  // Define columns for the DataTable
  const columns = [
    {
      key: "action",
      label: "Action",
      searchable: false,
      render: (row: unknown, index: number) => {
        const shiftType = row as ShiftTypeData;
        return (
          <div className="flex gap-2">
            <div title="Delete shift type">
              <Trash
                size={16}
                color={defaultColor?.main_blue}
                style={{cursor:"pointer"}}
                onClick={() => handleDeleteShiftType(shiftType)}
              />
            </div>
            <div title="Edit shift type">
              <Edit
                size={16}
                color={defaultColor?.main_blue}
                style={{cursor:"pointer"}}
                onClick={() => handleEditShiftType(shiftType)}
              />
            </div>
            <div title="View shift type details">
              <SquareUserRound
                size={16}
                color={defaultColor?.main_blue}
                style={{cursor:"pointer"}}
                onClick={() => handleViewShiftType(shiftType)}
              />
            </div>
          </div>
        );
      },
    },
    { 
      key: "sno", 
      label: "S.no", 
      searchable: false,
      render: (row: unknown, index: number) => index + 1
    },
    { 
      key: "name", 
      label: "Name", 
      searchable: true,
    },
    {
      key: 'custom_shift_name',
      label: 'Custom Shift Name',
      searchable: true,
      render: (row: unknown, index: number) => {
        const shiftType = row as ShiftTypeData;
        return (
          <span className="text-sm">
            {shiftType.custom_shift_name || '-'}
          </span>
        );
      },
    },
    {
      key: 'start_time',
      label: 'Start Time',
      searchable: true,
      render: (row: unknown, index: number) => {
        const shiftType = row as ShiftTypeData;
        return (
          <span className="text-sm font-medium">
            {shiftType.start_time}
          </span>
        );
      },
    },
    {
      key: 'end_time',
      label: 'End Time',
      searchable: true,
      render: (row: unknown, index: number) => {
        const shiftType = row as ShiftTypeData;
        return (
          <span className="text-sm font-medium">
            {shiftType.end_time}
          </span>
        );
      },
    },
  ];

  // Action handlers
  const handleEditShiftType = (shiftType: ShiftTypeData) => {
    console.log('Edit shift type:', shiftType);
    toast.info('Edit functionality will be implemented');
  };

  const handleViewShiftType = (shiftType: ShiftTypeData) => {
    console.log('View shift type:', shiftType);
    toast.info('View functionality will be implemented');
  };

  const handleDeleteShiftType = (shiftType: ShiftTypeData) => {
    console.log('Delete shift type:', shiftType);
    toast.info('Delete functionality will be implemented');
  };

  const handleNewClick = () => {
    console.log('New shift type clicked');
    toast.info('New shift type functionality will be implemented');
  };

  const handleRefreshClick = () => {
    fetchShiftTypes();
  };

  return (
    <>
      <div className="p-4 h-[calc(100vh-120px)] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            Holiday Type
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleRefreshClick}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh
            </button>
            <Button
              icon={faPlus}
              variant="secondary"
              onClick={handleNewClick}
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
          <DataTable columns={columns} data={shiftTypes} />
        )}
      </div>
    </>
  );
};

export default HolidayTypePage;
