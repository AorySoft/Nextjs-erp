'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function SearchInput({ 
  placeholder = "Search", 
  value, 
  onChange,
  className = ""
}: SearchInputProps) {
  return (
    <div className={`relative ${className}`}>
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full bg-[#e2e6ea] border-b border-[#0a74da] text-[#333] text-[13px] py-1 pl-2 pr-8 focus:outline-none"
        placeholder={placeholder}
      />
      <FontAwesomeIcon 
        icon={faSearch} 
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0a74da] text-[14px]"
      />
    </div>
  );
}