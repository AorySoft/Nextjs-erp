'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCogs, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { BreadcrumbItem } from '@/types';

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const defaultItems: BreadcrumbItem[] = [
  { label: 'Modules', icon: 'cogs' },
  { label: 'Human Resource' }
];

export default function Breadcrumb({ 
  items = defaultItems, 
  className = "" 
}: BreadcrumbProps) {
  return (
    <div className={`flex items-center gap-1 text-[#0a74da] text-[13px] px-4 py-1 border-b border-[#a0aec0] ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index === 0 && item.icon === 'cogs' && (
            <FontAwesomeIcon icon={faCogs} className="text-[16px]" />
          )}
          <span className={item.href ? "cursor-pointer hover:underline" : ""}>
            {item.label}
          </span>
          {index < items.length - 1 && (
            <FontAwesomeIcon icon={faChevronRight} className="text-[12px]" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}