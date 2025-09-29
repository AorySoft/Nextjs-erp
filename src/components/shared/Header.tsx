'use client';

import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThLarge, 
  faCubes, 
  faTachometerAlt, 
  faFileAlt, 
  faTh,
  faUserCircle,
  faSignOutAlt,
  faKey
} from '@fortawesome/free-solid-svg-icons';
import { X, Mail } from "lucide-react";
import Button from '../ui/Button';
import { logout } from '@/lib/auth';
import { forgotPasswordAPI } from '@/services/api';
import { toast } from 'react-toastify';

interface HeaderProps {
  title?: string;
  className?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function Header({ 
  title = "The Benchmark Hifz Campus (Boys)", 
  className = "",
  breadcrumbs = []
}: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEntityName, setSelectedEntityName] = useState(title);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Forgot Password Modal State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    cnic: "",
    cellNumber: "",
    dateOfBirth: "",
    email: "",
  });
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState("");
  const [forgotPasswordFieldErrors, setForgotPasswordFieldErrors] = useState({
    cnic: "",
    cellNumber: "",
    dateOfBirth: "",
    email: "",
  });
  const [step, setStep] = useState(1); // 1: Verify credentials, 2: Enter email
  
  // Get selected entity from storage
  useEffect(() => {
    const getSelectedEntity = () => {
      try {
        const selectedEntity = localStorage.getItem('selectedEntity') || 
                              sessionStorage.getItem('selectedEntity');
        
        if (selectedEntity) {
          const entity = JSON.parse(selectedEntity);
          if (entity.branch) {
            setSelectedEntityName(entity.branch); // Use branch field as display name
          } else if (entity.name) {
            setSelectedEntityName(entity.name); // Fallback to name if branch not available
          } else {
            // Fallback to default title if entity exists but no name
            setSelectedEntityName(title);
          }
        } else {
          // No entity selected, use default title
          setSelectedEntityName(title);
        }
      } catch (error) {
        console.error('Error getting selected entity:', error);
        // On error, fallback to default title
        setSelectedEntityName(title);
      }
    };

    getSelectedEntity();
  }, [title]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  
  // Get current date and time
  const dateStr = currentTime.toLocaleDateString('en-US', { 
    month: 'short', 
    day: '2-digit', 
    year: 'numeric' 
  });
  const timeStr = currentTime.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });

  const handleLogout = async () => {
    await logout();
  };

  // Forgot Password Functions
  const validateForgotPasswordForm = () => {
    const errors = { cnic: "", cellNumber: "", dateOfBirth: "", email: "" };
    let isValid = true;

    if (step === 1) {
      if (!forgotPasswordData.cnic.trim()) {
        errors.cnic = "CNIC is required";
        isValid = false;
      } else if (!/^\d{5}-\d{7}-\d{1}$/.test(forgotPasswordData.cnic)) {
        errors.cnic = "CNIC must be in format: 12345-6789102-1";
        isValid = false;
      }

      if (!forgotPasswordData.cellNumber.trim()) {
        errors.cellNumber = "Cell number is required";
        isValid = false;
      } else if (!/^03\d{9}$/.test(forgotPasswordData.cellNumber)) {
        errors.cellNumber = "Cell number must be in format: 03001234567";
        isValid = false;
      }

      if (!forgotPasswordData.dateOfBirth) {
        errors.dateOfBirth = "Date of birth is required";
        isValid = false;
      }
    } else if (step === 2) {
      if (!forgotPasswordData.email.trim()) {
        errors.email = "Email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordData.email)) {
        errors.email = "Please enter a valid email address";
        isValid = false;
      }
    }

    setForgotPasswordFieldErrors(errors);
    return isValid;
  };

  const handleForgotPasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForgotPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (forgotPasswordFieldErrors[name as keyof typeof forgotPasswordFieldErrors]) {
      setForgotPasswordFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setForgotPasswordError("");
  };

  const handleVerifyCredentials = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForgotPasswordForm()) return;

    setForgotPasswordLoading(true);
    setForgotPasswordError("");

    try {
      const result = await forgotPasswordAPI.getEmployeeByCredentials(
        forgotPasswordData.cnic,
        forgotPasswordData.cellNumber,
        forgotPasswordData.dateOfBirth
      );

      if (result.data && result.data.length > 0) {
        setStep(2);
        setForgotPasswordSuccess("Credentials verified successfully. Please enter your email address.");
        toast.success("Credentials verified successfully!");
      } else {
        setForgotPasswordError("No employee found with the provided credentials. Please check your information and try again.");
        toast.error("Invalid credentials. Please check your information.");
      }
    } catch (error: unknown) {
      console.error("Verify credentials error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to verify credentials. Please try again.";
      setForgotPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForgotPasswordForm()) return;

    setForgotPasswordLoading(true);
    setForgotPasswordError("");

    try {
      await forgotPasswordAPI.resetPassword(forgotPasswordData.email);
      setForgotPasswordSuccess("Password reset email sent successfully! Please check your email for further instructions.");
      toast.success("Password reset email sent successfully!");
      
      // Close modal after 3 seconds
      setTimeout(() => {
        setShowForgotPassword(false);
        setStep(1);
        setForgotPasswordData({ cnic: "", cellNumber: "", dateOfBirth: "", email: "" });
        setForgotPasswordSuccess("");
        setForgotPasswordError("");
      }, 3000);
    } catch (error: unknown) {
      console.error("Reset password error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email. Please try again.";
      setForgotPasswordError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setStep(1);
    setForgotPasswordData({ cnic: "", cellNumber: "", dateOfBirth: "", email: "" });
    setForgotPasswordSuccess("");
    setForgotPasswordError("");
    setForgotPasswordFieldErrors({ cnic: "", cellNumber: "", dateOfBirth: "", email: "" });
  };

  return (
    <div className={`flex-shrink-0 ${className}`}>
      {/* Top Header Row - Keep existing styling */}
      <header className="flex items-center justify-between bg-[#d0d7de] border-b border-[#a0aec0] px-4 h-[40px] text-[13px] text-[#555]">
        {/* Left side - Title */}
        <div className="flex items-center gap-2 font-semibold">
          <FontAwesomeIcon icon={faThLarge} className="text-[14px]" />
          {selectedEntityName}
        </div>

        {/* Right side - Date/Time and User Profile */}
        <div className="flex items-center gap-3">
          {/* Date Time Display */}
          <div className="flex items-center gap-3 border border-[#0a74da] rounded px-3 py-[3px] text-[#0a74da] text-[12px] font-semibold">
            <span>{dateStr}</span>
            <span>{timeStr}</span>
          </div>

          {/* User Profile with Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="User profile"
              className="w-7 h-7 rounded-full bg-[#d0d7de] flex items-center justify-center text-[#0a74da] hover:bg-[#c0c7ce] transition-colors"
            >
              <FontAwesomeIcon icon={faUserCircle} className="text-[18px]" />
            </button>
            
            {/* Profile Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[160px]">
                <button
                  onClick={() => {
                    setShowForgotPassword(true);
                    setShowDropdown(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faKey} className="text-[12px]" />
                  Forgot Password
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-[12px]" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Bottom White Row - Module Buttons and Breadcrumbs */}
      <div className="flex items-center justify-between bg-white border-b border-[#a0aec0] px-4 h-[40px] text-[13px] text-[#555]">
        {/* Left side - Module Buttons */}
        <div className="flex items-center gap-3">
          <Button icon={faCubes} variant="primary">
            MODULES
          </Button>
          
          <Button icon={faTachometerAlt} variant="secondary">
            DASHBOARD
          </Button>
          
          <Button icon={faFileAlt} variant="secondary">
            REPORTS
          </Button>
          
          <Button icon={faTh} variant="secondary">
            WORKBENCH
          </Button>
        </div>

        {/* Right side - Breadcrumbs */}
        <div className="flex items-center gap-2">
          {breadcrumbs.length > 0 && (
            <nav className="flex items-center gap-2 text-[12px]">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  {crumb.href ? (
                    <a 
                      href={crumb.href}
                      className="text-[#0a74da] hover:underline"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-[#555] font-medium">{crumb.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 && (
                    <span className="text-[#999]">/</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#2878aa]">
                  {step === 1 ? "Verify Your Identity" : "Reset Password"}
                </h2>
                <button
                  onClick={closeForgotPasswordModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Success Message */}
              {forgotPasswordSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                  {forgotPasswordSuccess}
                </div>
              )}

              {/* Error Message */}
              {forgotPasswordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {forgotPasswordError}
                </div>
              )}

              {/* Step 1: Verify Credentials */}
              {step === 1 && (
                <form onSubmit={handleVerifyCredentials} className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    Please enter your CNIC, cell number, and date of birth to verify your identity.
                  </div>

                  {/* CNIC Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNIC
                    </label>
                    <input
                      type="text"
                      name="cnic"
                      value={forgotPasswordData.cnic}
                      onChange={handleForgotPasswordInputChange}
                      placeholder="12345-6789102-1"
                      className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2878aa] focus:border-[#2878aa] text-sm ${
                        forgotPasswordFieldErrors.cnic ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {forgotPasswordFieldErrors.cnic && (
                      <p className="text-red-500 text-xs mt-1">
                        {forgotPasswordFieldErrors.cnic}
                      </p>
                    )}
                  </div>

                  {/* Cell Number Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cell Number
                    </label>
                    <input
                      type="text"
                      name="cellNumber"
                      value={forgotPasswordData.cellNumber}
                      onChange={handleForgotPasswordInputChange}
                      placeholder="03001234567"
                      className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2878aa] focus:border-[#2878aa] text-sm ${
                        forgotPasswordFieldErrors.cellNumber ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {forgotPasswordFieldErrors.cellNumber && (
                      <p className="text-red-500 text-xs mt-1">
                        {forgotPasswordFieldErrors.cellNumber}
                      </p>
                    )}
                  </div>

                  {/* Date of Birth Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={forgotPasswordData.dateOfBirth}
                      onChange={handleForgotPasswordInputChange}
                      className={`w-full px-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2878aa] focus:border-[#2878aa] text-sm ${
                        forgotPasswordFieldErrors.dateOfBirth ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {forgotPasswordFieldErrors.dateOfBirth && (
                      <p className="text-red-500 text-xs mt-1">
                        {forgotPasswordFieldErrors.dateOfBirth}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={forgotPasswordLoading}
                    className="w-full py-2 bg-[#2878aa] text-white rounded-lg font-semibold hover:bg-[#2878aa] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {forgotPasswordLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify Identity"
                    )}
                  </button>
                </form>
              )}

              {/* Step 2: Enter Email */}
              {step === 2 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="text-sm text-gray-600 mb-4">
                    Please enter your email address to receive password reset instructions.
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={forgotPasswordData.email}
                        onChange={handleForgotPasswordInputChange}
                        placeholder="Enter your email address"
                        className={`w-full pl-10 pr-3 py-2 border-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2878aa] focus:border-[#2878aa] text-sm ${
                          forgotPasswordFieldErrors.email ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                    </div>
                    {forgotPasswordFieldErrors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {forgotPasswordFieldErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={forgotPasswordLoading}
                      className="flex-1 py-2 bg-[#2878aa] text-white rounded-lg font-semibold hover:bg-[#2878aa] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {forgotPasswordLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Sending...
                        </div>
                      ) : (
                        "Send Reset Email"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}