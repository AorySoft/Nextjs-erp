'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUser, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import SearchInput from '../ui/SearchInput';
import { NavigationItem } from '@/types';

interface SidebarProps {
  className?: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'front-desk',
    label: 'Front Desk',
    icon: 'building',
    href: '/front-desk',
    isActive: false
  },
  {
    id: 'human-resource',
    label: 'Human Resource',
    icon: 'user',
    href: '/human-resource',
    isActive: true,
    hasChevron: true
  }
];

export default function Sidebar({ className = "" }: SidebarProps) {
  return (
    <aside className={`flex flex-col bg-[#e2e6ea] w-[230px] min-w-[230px] border-r border-[#a0aec0] overflow-y-auto ${className}`}>
      {/* Logo Section */}
      <div className="flex justify-center items-center h-[120px] border-b border-[#a0aec0]">
        <img 
          src="https://storage.googleapis.com/a1aa/image/778b0ce9-718f-493d-8402-d1de9c92ef53.jpg"
          alt="Company logo with blue and white colors, circular shape with letter e and dots"
          className="w-20 h-20 object-contain"
          width={80}
          height={80}
        />
      </div>

      {/* Search Section */}
      <div className="border-b border-[#a0aec0] px-3 py-1">
        <SearchInput />
      </div>

      {/* Navigation */}
      <nav className="flex flex-col text-[13px] font-semibold text-[#0a74da]">
        {navigationItems.map((item) => (
          <a
            key={item.id}
            href={item.href}
            className={`flex items-center gap-2 px-3 py-2 hover:bg-[#d0d7de] border-l-4 transition-colors ${
              item.isActive 
                ? 'bg-[#d0d7de] border-[#0a74da]' 
                : 'border-transparent hover:border-[#0a74da]'
            }`}
          >
            <FontAwesomeIcon 
              icon={item.icon === 'building' ? faBuilding : faUser} 
              className="text-[16px]"
            />
            {item.label}
            {item.hasChevron && (
              <FontAwesomeIcon 
                icon={faChevronRight} 
                className="ml-auto text-[12px]"
              />
            )}
          </a>
        ))}
      </nav>
    </aside>
  );
}