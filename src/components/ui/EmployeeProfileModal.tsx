'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faBars, 
  faCalendarAlt, 
  faSearch,
  faUser,
  faUsers,
  faPlus,
  faEdit,
  faChevronUp,
  faList,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import { EmployeeData, employeeAPI } from '@/services/api';

interface EmployeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: EmployeeData) => void;
  employeeData?: EmployeeData;
}

const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employeeData
}) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'employment'>('personal');
  const [formData, setFormData] = useState<EmployeeData>({
    name: employeeData?.name || '',
    gender: employeeData?.gender || '',
    date_of_birth: employeeData?.date_of_birth || '',
    custom_cnic: employeeData?.custom_cnic || '',
    custom_employment_category: employeeData?.custom_employment_category || '',
    company: 'The Benchmark', // Fixed company name as required by ERP system
    department: employeeData?.department || '',
    employment_type: employeeData?.employment_type || '',
    date_of_joining: employeeData?.date_of_joining || '',
    attendance_device_id: employeeData?.attendance_device_id || '',
    first_name: employeeData?.first_name || '',
    last_name: employeeData?.last_name || '',
    short_code: employeeData?.short_code || '',
    machine_code: employeeData?.machine_code || '',
    marital_status: employeeData?.marital_status || '',
    blood_group: employeeData?.blood_group || '',
    religion: employeeData?.religion || '',
    nationality: employeeData?.nationality || '',
    birth_country: employeeData?.birth_country || '',
    birth_city: employeeData?.birth_city || '',
    contact_no: employeeData?.contact_no || '',
    whatsapp_no: employeeData?.whatsapp_no || '',
    email: employeeData?.email || '',
    caste: employeeData?.caste || '',
    // Additional employment fields
    appointment_date: employeeData?.appointment_date || '',
    employee_grade: employeeData?.employee_grade || '',
    designation: employeeData?.designation || '',
    status: employeeData?.status || '',
    reporting_to: employeeData?.reporting_to || '',
    site: employeeData?.site || '',
  });

  const handleInputChange = (field: keyof EmployeeData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

      const handleSave = async () => {
      try {
        // Frontend validation for required fields
        const requiredFields: (keyof EmployeeData)[] = [
          'first_name', 
          'gender', 
          'date_of_birth', 
          'custom_cnic', 
          'custom_employment_category', 
          'department', 
          'employment_type', 
          'date_of_joining'
        ];
        
        const missingFields = requiredFields.filter(field => !formData[field] || String(formData[field]).trim() === '');
        
        if (missingFields.length > 0) {
          const fieldLabels: Record<keyof EmployeeData, string> = {
            first_name: 'First Name',
            gender: 'Gender',
            date_of_birth: 'Date of Birth',
            custom_cnic: 'CNIC',
            custom_employment_category: 'Employment Category',
            department: 'Department',
            employment_type: 'Employment Type',
            date_of_joining: 'Date of Joining'
          } as Record<keyof EmployeeData, string>;
          
          const missingLabels = missingFields.map(field => fieldLabels[field]).join(', ');
          alert(`Please fill in the following required fields: ${missingLabels}`);
          return;
        }

        if (employeeData?.name) {
          // Update existing employee
          await employeeAPI.updateEmployee(employeeData.name, formData);
        } else {
          // Create new employee
          // await employeeAPI.createEmployee(formData);
        }
        onSave?.(formData);
        onClose();
      } catch (error) {
        console.error('Error saving employee:', error);
        if (error instanceof Error) {
          alert(`Error: ${error.message}`);
        } else {
          alert('Error saving employee data');
        }
      }
    };

  const handleSaveAndClose = async () => {
    await handleSave();
    onClose();
  };

  const handleNew = () => {
    setFormData({
      name: '',
      gender: '',
      date_of_birth: '',
      custom_cnic: '',
      custom_employment_category: '',
      company: 'The Benchmark', // Fixed company name as required by ERP system
      department: '',
      employment_type: '',
      date_of_joining: '',
      attendance_device_id: '',
      first_name: '',
      last_name: '',
      short_code: '',
      machine_code: '',
      marital_status: '',
      blood_group: '',
      religion: '',
      nationality: '',
      birth_country: '',
      birth_city: '',
      contact_no: '',
      whatsapp_no: '',
      email: '',
      caste: '',
      // Additional employment fields
      appointment_date: '',
      employee_grade: '',
      designation: '',
      status: '',
      reporting_to: '',
      site: '',
    });
  };

  // Reset form when modal opens
  React.useEffect(() => {
    if (isOpen && !employeeData) {
      // Only reset if opening for new employee (not editing existing)
      handleNew();
      setActiveTab('personal'); // Reset to first tab
    }
  }, [isOpen, employeeData]);

  // Helper function to check if a field is filled
  const isFieldFilled = (field: keyof EmployeeData) => {
    const value = formData[field];
    return value && String(value).trim() !== '';
  };

  // Helper function to get field validation class
  const getFieldValidationClass = (field: keyof EmployeeData) => {
    const isRequired = ['first_name', 'gender', 'date_of_birth', 'custom_cnic', 
                       'custom_employment_category', 'department', 'employment_type', 
                       'date_of_joining'].includes(field);
    
    if (!isRequired) return 'border-gray-300';
    
    if (isFieldFilled(field)) {
      return 'border-green-500 focus:ring-green-500';
    } else {
      return 'border-red-300 focus:ring-red-500';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90%] max-w-6xl h-[90%] max-h-[800px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <FontAwesomeIcon icon={faBars} className="text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Employee Profile</h2>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleNew}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              New
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save
            </button>
            <button
              onClick={handleSaveAndClose}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              <FontAwesomeIcon icon={faSave} className="mr-2" />
              Save & Close
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('personal')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'personal'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FontAwesomeIcon icon={faList} />
            Personal Information
          </button>
          <button
            onClick={() => setActiveTab('employment')}
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'employment'
                ? 'text-teal-600 border-b-2 border-teal-600 bg-teal-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FontAwesomeIcon icon={faUsers} />
            Employment
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex gap-6">
            {/* Left Side - Form */}
            <div className="flex-1">
              {/* Basic Information */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FontAwesomeIcon icon={faChevronUp} className="text-gray-600" />
                  <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Fields marked with <span className="text-red-500">*</span> are required.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Code</label>
                    <input
                      type="text"
                      value={formData.short_code || ''}
                      onChange={(e) => handleInputChange('short_code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Machine Code</label>
                    <input
                      type="text"
                      value={formData.machine_code || ''}
                      onChange={(e) => handleInputChange('machine_code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input
                      type="text"
                      value="The Benchmark"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-600 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Company is fixed to &quot;The Benchmark&quot; as required by the system</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Joining Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.date_of_joining || ''}
                        onChange={(e) => handleInputChange('date_of_joining', e.target.value)}
                        placeholder="mm/dd/yyyy"
                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${getFieldValidationClass('date_of_joining')}`}
                      />
                      <FontAwesomeIcon 
                        icon={faCalendarAlt} 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.first_name || ''}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      placeholder="Enter First Name"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${getFieldValidationClass('first_name')}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={formData.last_name || ''}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      placeholder="Enter Last Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              {activeTab === 'personal' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.date_of_birth || ''}
                          onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                          placeholder="mm/dd/yyyy"
                          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${getFieldValidationClass('date_of_birth')}`}
                        />
                        <FontAwesomeIcon 
                          icon={faCalendarAlt} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.gender || ''}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${getFieldValidationClass('gender')}`}
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CNIC <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.custom_cnic || ''}
                        onChange={(e) => handleInputChange('custom_cnic', e.target.value)}
                        placeholder="Enter CNIC"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${getFieldValidationClass('custom_cnic')}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.blood_group || ''}
                          onChange={(e) => handleInputChange('blood_group', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nationality <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.nationality || ''}
                          onChange={(e) => handleInputChange('nationality', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.marital_status || ''}
                          onChange={(e) => handleInputChange('marital_status', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Birth Country <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.birth_country || ''}
                          onChange={(e) => handleInputChange('birth_country', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.religion || ''}
                          onChange={(e) => handleInputChange('religion', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Birth City <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.birth_city || ''}
                          onChange={(e) => handleInputChange('birth_city', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Caste</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.caste || ''}
                          onChange={(e) => handleInputChange('caste', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.contact_no || ''}
                        onChange={(e) => handleInputChange('contact_no', e.target.value)}
                        placeholder="Enter Contact No."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp No.</label>
                      <input
                        type="text"
                        value={formData.whatsapp_no || ''}
                        onChange={(e) => handleInputChange('whatsapp_no', e.target.value)}
                        placeholder="Enter WhatsApp No."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter Email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Employment Information */}
              {activeTab === 'employment' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Employment Information</h3>
                  
                  {/* Reporting To - Top Right Field */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reporting To</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.reporting_to || ''}
                        onChange={(e) => handleInputChange('reporting_to', e.target.value)}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <FontAwesomeIcon 
                        icon={faSearch} 
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee Type <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.employment_type || ''}
                          onChange={(e) => handleInputChange('employment_type', e.target.value)}
                          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${getFieldValidationClass('employment_type')}`}
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.custom_employment_category || ''}
                          onChange={(e) => handleInputChange('custom_employment_category', e.target.value)}
                          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${getFieldValidationClass('custom_employment_category')}`}
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.appointment_date || ''}
                          onChange={(e) => handleInputChange('appointment_date', e.target.value)}
                          placeholder="mm/dd/yyyy"
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FontAwesomeIcon 
                          icon={faCalendarAlt} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employee Grade</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.employee_grade || ''}
                          onChange={(e) => handleInputChange('employee_grade', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Attendance Device ID</label>
                      <input
                        type="text"
                        value={formData.attendance_device_id || ''}
                        onChange={(e) => handleInputChange('attendance_device_id', e.target.value)}
                        placeholder="Enter Device ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.department || ''}
                          onChange={(e) => handleInputChange('department', e.target.value)}
                          className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 ${getFieldValidationClass('department')}`}
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.designation || ''}
                          onChange={(e) => handleInputChange('designation', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Site <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.site || ''}
                          onChange={(e) => handleInputChange('site', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.status || ''}
                          onChange={(e) => handleInputChange('status', e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <FontAwesomeIcon 
                          icon={faSearch} 
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Profile Picture */}
            <div className="w-64 flex-shrink-0">
              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-64 flex flex-col items-center justify-center relative">
                <FontAwesomeIcon icon={faUser} className="text-6xl text-gray-400 mb-2" />
                <FontAwesomeIcon icon={faPlus} className="text-2xl text-gray-400" />
                <p className="text-sm text-gray-500 mt-2">Profile Picture</p>
                <button className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                  <FontAwesomeIcon icon={faEdit} className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfileModal;
