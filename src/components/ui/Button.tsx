'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface ButtonProps {
  children: React.ReactNode;
  icon?: IconDefinition;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
  onClick?: () => void;
  className?: string;
}

export default function Button({ 
  children, 
  icon, 
  variant = 'secondary', 
  size = 'sm',
  onClick,
  className = ''
}: ButtonProps) {
  const baseClasses = "flex items-center gap-1 font-semibold rounded transition-colors";
  
  const variantClasses = {
    primary: "bg-[#0a74da] text-white hover:bg-[#0a74da]/90",
    secondary: "bg-[#f0f3f5] text-[#0a74da] border border-[#a0aec0] hover:bg-[#e2e6ea]"
  };
  
  const sizeClasses = {
    sm: "text-[12px] px-3 py-[3px]",
    md: "text-[13px] px-4 py-2"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {icon && <FontAwesomeIcon icon={icon} />}
      {children}
    </button>
  );
}