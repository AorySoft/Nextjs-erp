'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faThLarge, 
  faCubes, 
  faTachometerAlt, 
  faFileAlt, 
  faTh,
  faUserCircle
} from '@fortawesome/free-solid-svg-icons';
import Button from '../ui/Button';

interface HeaderProps {
  title?: string;
  className?: string;
}

export default function Header({ 
  title = "The Benchmark Hifz Campus (Boys)", 
  className = "" 
}: HeaderProps) {
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

  return (
    <header className={`flex items-center justify-between bg-[#d0d7de] border-b border-[#a0aec0] px-4 h-[40px] text-[13px] text-[#555] flex-shrink-0 ${className}`}>
      {/* Left side - Title */}
      <div className="flex items-center gap-2 font-semibold">
        <FontAwesomeIcon icon={faThLarge} className="text-[14px]" />
        {title}
      </div>

      {/* Right side - Buttons and Info */}
      <div className="flex items-center gap-3">
        {/* Action Buttons */}
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

        {/* Date Time Display */}
        <div className="flex items-center gap-3 border border-[#0a74da] rounded px-3 py-[3px] text-[#0a74da] text-[12px] font-semibold">
          <span>{dateStr}</span>
          <span>{timeStr}</span>
        </div>

        {/* User Profile */}
        <button 
          aria-label="User profile"
          className="w-7 h-7 rounded-full bg-[#d0d7de] flex items-center justify-center text-[#0a74da] hover:bg-[#c0c7ce] transition-colors"
        >
          <FontAwesomeIcon icon={faUserCircle} className="text-[18px]" />
        </button>
      </div>
    </header>
  );
}