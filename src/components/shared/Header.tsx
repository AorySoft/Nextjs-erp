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
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import Button from '../ui/Button';
import { logout } from '@/lib/auth';

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
  
  // Get current date and time
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { 
    month: 'short', 
    day: '2-digit', 
    year: 'numeric' 
  });
  const timeStr = now.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });

  const handleLogout = async () => {
    await logout();
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
            
            {/* Logout Dropdown */}
            {showDropdown && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
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
    </div>
  );
}