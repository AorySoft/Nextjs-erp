'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faWifi } from '@fortawesome/free-solid-svg-icons';

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
        <img 
          src="https://storage.googleapis.com/a1aa/image/373ce9dd-b078-4ab4-b9f7-b28768295996.jpg"
          alt="edap logo in blue text on white background"
          className="h-5"
          height={20}
          width={50}
        />
      </div>

      {/* Right side - Copyright */}
      <div className="flex items-center gap-3">
        <div className="text-[13px] text-[#555]">
          All Rights Reserved by 
          <span className="font-semibold text-[#0a74da] ml-1">
            DigiCop Solutions
          </span>
        </div>
        <div className="border-l border-[#a0aec0] pl-3">
          <img 
            src="https://storage.googleapis.com/a1aa/image/5618cbf6-1f9d-4fc5-c269-92f859b0f401.jpg"
            alt="DigiCop logo in blue text on white background"
            className="h-5"
            height={20}
            width={40}
          />
        </div>
      </div>
    </footer>
  );
}