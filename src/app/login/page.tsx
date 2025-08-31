"use client";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import axios from "axios";
import { useSearchParams } from 'next/navigation';
import { saveSession } from '@/lib/auth';
import { toast } from 'react-toastify';

const LoginPage = () => {
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

  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for message in URL parameters
    const message = searchParams.get('message');
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
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
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
      const response = await axios.post("/api/auth/login", {
        usr: formData.username,
        pwd: formData.password,
      });

      if (response.data.message === "Logged In") {
        // Handle successful login
        console.log("Login successful:", response.data);
        
        // Save session based on remember me preference
        saveSession(response.data, formData.rememberMe);
        
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
        setError("Invalid credentials. Please try again.");
      }
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Invalid username or password");
          setError("Invalid username or password");
        } else if (error.code === 'ERR_NETWORK') {
          toast.error("Server is unavailable. Please try again later.");
          setError("Server is unavailable. Please try again later.");
        } else {
          toast.error("Login failed. Please try again later.");
          setError("Login failed. Please try again later.");
        }
      } else {
        toast.error("Login failed. Please try again later.");
        setError("Login failed. Please try again later.");
      }
    } finally {
      // Only set loading to false if we're not showing success message
      if (!document.querySelector('.bg-green-50')) {
        setIsLoading(false);
      }
    }
  };

  const isFormValid = formData.username.trim() && formData.password.length >= 6;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4 transition-all duration-500 ease-in-out">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md transform transition-all duration-300 hover:scale-[1.02]">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 transition-all duration-300">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center">
              <div className="text-white text-xs font-bold">LOGO</div>
            </div>
            <div className="text-blue-600 font-bold text-sm mb-2">THE BENCHMARK</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">WELCOME</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              Please Enter your Id and password to login into Edap Panel to view all the Entity statistics
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
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter Your Username"
                  className={`w-full pl-12 pr-4 py-3 sm:py-4 border-2 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    fieldErrors.username ? "border-red-300" : "border-blue-200"
                  }`}
                />
              </div>
              {fieldErrors.username && (
                <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.username}</p>
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
                  className={`w-full pl-12 pr-12 py-3 sm:py-4 border-2 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${
                    fieldErrors.password ? "border-red-300" : "border-blue-200"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.password}</p>
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
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                Keep me signed in
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                isFormValid && !isLoading
                  ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
            >
              Forgot Password ?
            </a>
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
    </div>
  );
};

export default LoginPage;
