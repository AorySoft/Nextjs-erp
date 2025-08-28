'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faWifi, faBuilding } from '@fortawesome/free-solid-svg-icons';

interface FooterProps {
  className?: string;
}

export default function Footer({ className = "" }: FooterProps) {
  return (
    <footer className={`flex items-center justify-between bg-[#f0f3f5] border-t border-[#a0aec0] px-4 h-[30px] text-[12px] text-[#555] flex-shrink-0 ${className}`}>
      {/* Left side - User info */}
      <div>
        User : 
        <span className="font-semibold text-[#0a74da] ml-1">
          Developer
        </span>
      </div>

      {/* Center - Connection status */}
      <div className="flex items-center gap-2 text-[#555]">
        <FontAwesomeIcon icon={faGlobe} />
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-[#a0aec0]"></span>
          <span className="w-2 h-2 rounded-full bg-[#a0aec0]"></span>
          <span className="w-2 h-2 rounded-full bg-[#d0d7de]"></span>
          <span className="w-2 h-2 rounded-full bg-[#a0aec0]"></span>
        </div>
        <FontAwesomeIcon icon={faWifi} />
        <div className="flex items-center gap-1 text-[#0a74da] font-semibold">
          <FontAwesomeIcon icon={faBuilding} className="text-sm" />
          <span>EDAP</span>
        </div>
      </div>

      {/* Right side - Copyright */}
      <div className="flex items-center gap-3">
        <div className="text-[13px] text-[#555]">
          All Rights Reserved by 
          <span className="font-semibold text-[#0a74da] ml-1">
            AorySoft
          </span>
        </div>
        <div className="border-l border-[#a0aec0] pl-3">
          <div className="flex items-center gap-1 text-[#0a74da] font-semibold">
            <FontAwesomeIcon icon={faBuilding} className="text-sm" />
            <span>AorySoft</span>
          </div>
        </div>
      </div>
    </footer>
  );
}