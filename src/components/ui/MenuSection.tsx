'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBars, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { MenuSection as MenuSectionType } from '@/types';

interface MenuSectionProps {
  section: MenuSectionType;
  className?: string;
}

interface MenuItemProps {
  label: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

function MenuItem({ label, isFavorite = false, onToggleFavorite }: MenuItemProps) {
  return (
    <li className="flex items-center gap-1">
      <FontAwesomeIcon icon={faBars} className="text-[12px] text-[#999]" />
      <span>{label}</span>
      <button 
        onClick={onToggleFavorite}
        className="ml-auto text-[#999] cursor-pointer hover:text-[#0a74da] transition-colors"
        aria-label={`${isFavorite ? 'Remove from' : 'Add to'} favorites`}
      >
        <FontAwesomeIcon 
          icon={isFavorite ? faStarSolid : faStarRegular} 
        />
      </button>
    </li>
  );
}

export default function MenuSection({ section, className = "" }: MenuSectionProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 text-[#0a74da] font-semibold text-[14px] mb-2">
        <FontAwesomeIcon icon={faBook} />
        <span>{section.title}</span>
      </div>
      <div className="flex gap-20 text-[13px] text-[#333]">
        {section.items.map((column, columnIndex) => (
          <div key={columnIndex}>
            <div className="font-semibold text-[#0a74da] mb-1">
              {column.title}
            </div>
            <ul className="space-y-1">
              {column.items.map((item, itemIndex) => (
                <MenuItem 
                  key={itemIndex}
                  label={item.label}
                  isFavorite={item.isFavorite}
                  onToggleFavorite={() => {
                    // Handle favorite toggle logic here
                    console.log(`Toggle favorite for: ${item.label}`);
                  }}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}