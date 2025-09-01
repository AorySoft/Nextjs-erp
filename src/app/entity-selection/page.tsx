"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import axios from "axios";
import { toast } from 'react-toastify';
import Image from "next/image";
import backImg from "../login/Benckmark-logo.png";

interface Branch {
  name: string;
  branch_code?: string;
  [key: string]: unknown;
}

const EntitySelectionPage = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/branches");
      
      if (response.data && response.data.data) {
        setBranches(response.data.data);
        // Set default selection to first branch if available
        if (response.data.data.length > 0) {
          setSelectedEntity(response.data.data[0].name);
        }
      }
    } catch (error: unknown) {
      console.error("Error fetching branches:", error);
      setError("Failed to load entities. Please try again.");
      toast.error("Failed to load entities");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = async () => {
    if (!selectedEntity) {
      toast.error("Please select an entity to proceed");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Save selected entity to session storage and cookies
      const selectedBranch = branches.find(branch => branch.name === selectedEntity);
      if (selectedBranch) {
        sessionStorage.setItem('selectedEntity', JSON.stringify(selectedBranch));
        localStorage.setItem('selectedEntity', JSON.stringify(selectedBranch));
        
        // Save to cookie for middleware access
        const cookieValue = encodeURIComponent(JSON.stringify(selectedBranch));
        document.cookie = `selectedEntity=${cookieValue}; path=/; max-age=${24 * 60 * 60}; SameSite=Lax`;
      }

      toast.success("Entity selected successfully!");
      
      // Redirect to dashboard after brief delay
      setTimeout(() => {
        window.location.href = "/human-resource";
      }, 1000);
      
    } catch (error) {
      console.error("Error saving entity selection:", error);
      toast.error("Failed to save entity selection");
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Entity Selection Card */}
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
            <h1 className="text-2xl font-bold text-[#2878aa] mb-2">SELECT ENTITY</h1>
            <p className="text-gray-600 text-[11px] leading-relaxed">
              Please select your entity to continue to the dashboard and access
              all the system features
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
              <button 
                onClick={fetchBranches}
                className="ml-2 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}

          {/* Entity Selection Form */}
          <form className="space-y-4">
            {/* Entity Selection Field */}
            <div>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  color="#000000"
                  strokeWidth={2}
                />
                {isLoading ? (
                  <div className="w-full pl-12 pr-4 py-1 sm:py-1 border-2 border-[#2878aa] rounded-xl bg-white/80 backdrop-blur-sm flex items-center text-sm sm:text-base text-black">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#2878aa] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-600">Loading entities...</span>
                    </div>
                  </div>
                ) : (
                  <select
                    value={selectedEntity}
                    onChange={(e) => setSelectedEntity(e.target.value)}
                    className="w-full pl-12 pr-12 py-1 sm:py-1 border-2 border-[#2878aa] rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#2878aa] focus:border-[#2878aa] text-sm sm:text-base text-black appearance-none cursor-pointer"
                  >
                    <option value="">Select Your Entity</option>
                    {branches.map((branch) => (
                      <option key={branch.name} value={branch.name}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                )}
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Proceed Button */}
            <button
              type="button"
              onClick={handleProceed}
              disabled={!selectedEntity || isSubmitting || isLoading}
              className={`w-full py-1 rounded-xl font-semibold text-white transition-all duration-200 ${
                selectedEntity && !isSubmitting && !isLoading
                  ? "bg-[#2878aa] hover:bg-[#2878aa] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </div>
              ) : (
                "Proceed"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-600 text-sm">
              Need help selecting an entity?
            </p>
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

export default EntitySelectionPage;
