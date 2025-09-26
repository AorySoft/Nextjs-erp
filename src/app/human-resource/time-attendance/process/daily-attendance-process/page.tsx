"use client";
import React, { useState } from "react";
import Button from "@/components/ui/CustomButton";
import { Plus, RefreshCw, Clock } from "lucide-react";
import { Box, Card, CardContent, Typography, Stack } from "@mui/material";
import { toast } from "react-toastify";
import apiClient from "@/services/apiClient";

// Helper function to show loading toast
const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    autoClose: false,
    closeButton: false,
    closeOnClick: false
  });
};

// Helper function to update toast
const updateToast = (toastId: any, message: string, type: 'success' | 'error' = 'success') => {
  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    autoClose: type === 'success' ? 5000 : 10000,
    closeButton: true
  });
};

export default function DailyAttendanceProcess() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [lastProcessed, setLastProcessed] = useState<string>(new Date().toLocaleString());

  const processAttendance = async () => {
    const toastId = showLoadingToast('Processing attendance for all employees. This may take a few minutes...');
    
    try {
      setActiveAction('process');
      setIsProcessing(true);
      
      const response = await apiClient.get('/method/process_attendance_api', {
        timeout: 600000, // 10 minutes
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      setLastProcessed(new Date().toLocaleString());
      updateToast(toastId, 'Attendance processed successfully!');
      return response;
    } catch (error: any) {
      console.error('Error processing attendance:', error);
      
      if (error.code === 'ECONNABORTED') {
        updateToast(toastId, 'Processing is taking longer than expected. Please check back in a few minutes.', 'error');
      } else {
        updateToast(toastId, error.response?.data?.message || 'Failed to process attendance', 'error');
      }
      throw error;
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActiveAction(null), 1500);
    }
  };

  const reverseAttendance = async () => {
    const toastId = showLoadingToast('Reversing attendance data. This may take a moment...');
    
    try {
      setActiveAction('reverse');
      setIsProcessing(true);
      
      const response = await apiClient.post('/method/reverse_today_attendance', {}, {
        timeout: 300000, // 5 minutes
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache'
        }
      });
      
      setLastProcessed(new Date().toLocaleString());
      updateToast(toastId, 'Attendance reversed successfully!');
      return response;
    } catch (error: any) {
      console.error('Error reversing attendance:', error);
      
      if (error.code === 'ECONNABORTED') {
        updateToast(toastId, 'Reversing attendance is taking longer than expected. Please check back in a few minutes.', 'error');
      } else {
        updateToast(toastId, error.response?.data?.message || 'Failed to reverse attendance', 'error');
      }
      throw error;
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActiveAction(null), 1500);
    }
  };

  const processAutoAttendance = async () => {
    const toastId = showLoadingToast('Running daily auto process. This may take a few minutes...');
    
    try {
      setActiveAction('auto');
      setIsProcessing(true);
      
      const response = await apiClient.post('/method/process_daily_attendance_shift', {}, {
        timeout: 600000, // 10 minutes
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache'
        }
      });
      
      setLastProcessed(new Date().toLocaleString());
      updateToast(toastId, 'Daily auto process completed successfully!');
      return response;
    } catch (error: any) {
      console.error('Error in daily auto process:', error);
      
      if (error.code === 'ECONNABORTED') {
        updateToast(toastId, 'Daily auto process is taking longer than expected. Please check back in a few minutes.', 'error');
      } else {
        updateToast(toastId, error.response?.data?.message || 'Failed to run daily auto process', 'error');
      }
      throw error;
    } finally {
      setIsProcessing(false);
      setTimeout(() => setActiveAction(null), 1500);
    }
  };

  const handleAction = async (action: string) => {
    try {
      switch (action) {
        case 'process':
          await processAttendance();
          break;
        case 'reverse':
          await reverseAttendance();
          break;
        case 'auto':
          await processAutoAttendance();
          break;
        default:
          break;
      }
    } catch (error) {
      // Error handling is done in individual functions
      console.error('Action error:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Daily Attendance Process
        </Typography>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Attendance Actions</Typography>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
            <Button
              variant={activeAction === 'process' ? 'contained' : 'outlined'}
              value="Process"
              startIcon={<Plus />}
              onClick={() => handleAction('process')}
              disable={isProcessing && activeAction !== 'process'}
              style={{
                backgroundColor: activeAction === 'process' ? '#1976d2' : 'transparent',
                color: activeAction === 'process' ? '#fff' : '#1976d2',
                borderColor: '#1976d2',
                marginRight: '8px'
              }}
            />
            <Button
              variant={activeAction === 'reverse' ? 'contained' : 'outlined'}
              value="Reverse Attendance"
              startIcon={<RefreshCw />}
              onClick={() => handleAction('reverse')}
              disable={isProcessing && activeAction !== 'reverse'}
              style={{
                backgroundColor: activeAction === 'reverse' ? '#9c27b0' : 'transparent',
                color: activeAction === 'reverse' ? '#fff' : '#9c27b0',
                borderColor: '#9c27b0',
                marginRight: '8px'
              }}
            />
            <Button
              variant={activeAction === 'auto' ? 'contained' : 'outlined'}
              value="Daily Auto Process"
              startIcon={<Clock />}
              onClick={() => handleAction('auto')}
              disable={isProcessing && activeAction !== 'auto'}
              style={{
                backgroundColor: activeAction === 'auto' ? '#2e7d32' : 'transparent',
                color: activeAction === 'auto' ? '#fff' : '#2e7d32',
                borderColor: '#2e7d32'
              }}
            />
          </Stack>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {activeAction === 'process' && 'Processing daily attendance...'}
            {activeAction === 'reverse' && 'Reversing attendance data...'}
            {activeAction === 'auto' && 'Running daily auto process...'}
            {!activeAction && 'Select an action to begin.'}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mt: 3 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Last Processed</Typography>
        </Box>
        <CardContent>
          <Typography variant="body1">
            {lastProcessed}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Status: {isProcessing ? 'Processing...' : 'Idle'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
