"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Eye, EyeOff, User, Lock, X, Mail } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { saveSession, loginUser } from "@/lib/auth";
import { forgotPasswordAPI } from "@/services/api";
import { toast } from "react-toastify";
import Image from "next/image";
import backImg from "./Benckmark-logo.png";
const LoginForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    username: "",
    password: "",
  });

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

  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for message in URL parameters
    const message = searchParams.get("message");
    if (message) {
      setInfoMessage(decodeURIComponent(message));
    }
  }, [searchParams]);

  const validateForm = () => {
    const errors = { username: "", password: "" };
    let isValid = true;

    if (!formData.username.trim()) {
      errors.username = "Username is required";
      isValid = false;
    }

    if (!formData.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await loginUser(formData.username, formData.password);

      if (result.success && result.data) {
        // Handle successful login
        console.log("Login successful:", result.data);

        // Save session based on remember me preference
        saveSession(result.data, formData.rememberMe);

        // Show success toast and message
        toast.success("Login successful, redirecting...", {
          position: "top-right",
          autoClose: 1500,
        });
        setSuccessMessage("Login successful, redirecting...");
        setError(""); // Clear any previous errors

        // Redirect after brief delay to show success message
        setTimeout(() => {
          // Force reload to ensure cookies are available to middleware
          window.location.replace("/entity-selection");
        }, 1500);
      } else {
        const errorMessage = result.error || "Invalid credentials. Please try again.";
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again later.");
      setError("Login failed. Please try again later.");
    } finally {
      // Only set loading to false if we're not showing success message
      if (!document.querySelector(".bg-green-50")) {
        setIsLoading(false);
      }
    }
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

  const isFormValid = formData.username.trim() && formData.password.length >= 6;

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ease-in-out`}
      style={{
        backgroundImage: `url('https://bms.edap.com.pk/BlueGreyBG.149197dd2f3e8982.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "white",
      }}
    >
      {/* Background decorative elements */}

      {/* Login Card */}
      <div className="relative w-full max-w-md shadow-[ -2vh_1vh_5vh_#00000012 ] backdrop-blur-[16px] rounded-[8vh] bg-[#ffffffb5]">
        <div className="bg-transparent p-6 sm:p-8 ">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-transparent flex items-center justify-center">
              <div className="text-white text-xs font-bold" >
                <Image
                  src={backImg}
                  alt="Benchmark Logo"
                  width={147}
                  height={147}
                  style={{width: "100%", height: "100%"}} 
                />
              </div>
            </div>
            {/* <div className="text-blue-600 font-bold text-sm mb-2">
              THE BENCHMARK
            </div> */}
            <h1 className="text-2xl font-bold text-[#2878aa] mb-2">WELCOME</h1>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Please Enter your Id and password to login into BMS Panel to view
              all the Entity statistics
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}
          {infoMessage && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 text-sm">
              {infoMessage}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {successMessage}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username Field */}
            <div>
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  color="#000000"
                  strokeWidth={2}
                />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter Your Username"
                  className={`w-full pl-12 pr-4 py-1 sm:py-1 border-2 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#2878aa] focus:border-[#2878aa] text-sm sm:text-base text-black placeholder-gray-400 ${
                    fieldErrors.username ? "border-red-300" : "border-[#2878aa]"
                  }`}
                />
              </div>
              {fieldErrors.username && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {fieldErrors.username}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter Your Password"
                  className={`w-full pl-12 pr-4 py-1 sm:py-1 border-2 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#2878aa] focus:border-[#2878aa] text-sm sm:text-base text-black placeholder-gray-400 ${
                    fieldErrors.password ? "border-red-300" : "border-[#2878aa]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rememberMe"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm text-gray-600"
              >
                Keep me signed in
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-1 rounded-xl font-semibold text-white transition-all duration-200 ${
                isFormValid && !isLoading
                  ? "bg-[#2878aa] hover:bg-[#2878aa] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-[#2878aa] hover:text-[#2878aa] text-sm font-medium transition-colors"
            >
              Forgot Password ?
            </button>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <a href="#" className="hover:text-gray-700 transition-colors">
                Terms & Conditions
              </a>
              <span>|</span>
              <a href="#" className="hover:text-gray-700 transition-colors">
                Privacy Policy
              </a>
            </div>
          </div>
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
};

const LoginPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
};

export default LoginPage;
