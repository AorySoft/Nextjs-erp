'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUser, faChevronRight, faBuilding as faCompany } from '@fortawesome/free-solid-svg-icons';
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
        <div className="flex flex-col items-center">
          <FontAwesomeIcon 
            icon={faCompany} 
            className="text-4xl text-[#0a74da] mb-2"
          />
          <span className="text-lg font-bold text-[#0a74da]">NextERP</span>
        </div>
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