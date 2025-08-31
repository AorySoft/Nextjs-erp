"use client";
import React, { useState, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import axios from "axios";
import { toast } from 'react-toastify';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-white/5 rounded-full blur-lg"></div>
      </div>

      {/* Entity Selection Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <div className="text-white text-2xl">🌐</div>
            </div>
            <div className="text-blue-600 font-bold text-sm mb-2">THE BENCHMARK</div>
            <p className="text-gray-500 text-xs">Coaching Education with Islamic System</p>
          </div>

          {/* Entity Selection */}
          <div className="mb-6">
            <label className="block text-blue-600 font-semibold text-sm mb-3">
              Select Entity*
            </label>
            
            {isLoading ? (
              <div className="w-full p-4 border-2 border-blue-200 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-gray-600 text-sm">Loading entities...</span>
                </div>
              </div>
            ) : error ? (
              <div className="w-full p-4 border-2 border-red-200 rounded-xl bg-red-50 text-red-600 text-sm">
                {error}
                <button 
                  onClick={fetchBranches}
                  className="ml-2 underline hover:no-underline"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedEntity}
                  onChange={(e) => setSelectedEntity(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 border-2 border-blue-200 rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none cursor-pointer"
                >
                  <option value="">Select an entity...</option>
                  {branches.map((branch) => (
                    <option key={branch.name} value={branch.name}>
                      {branch.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Proceed Button */}
          <button
            onClick={handleProceed}
            disabled={!selectedEntity || isSubmitting || isLoading}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
              selectedEntity && !isSubmitting && !isLoading
                ? "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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

          {/* Info Text */}
          <div className="mt-4 text-center">
            <p className="text-gray-500 text-xs">
              Please select your entity to continue to the dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntitySelectionPage;
