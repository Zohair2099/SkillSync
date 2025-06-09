
import React from 'react';

// This SVG icon is a conceptual representation of a head profile with a gear inside,
// inspired by the user-provided image. It aims for a clean, modern look.
export const SkillSyncLogoIcon = ({ className, size = 32 }: { className?: string; size?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5" // Using a stroke width that's clear and balanced
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Simplified Head Profile (facing right) */}
      {/* This path creates a basic profile shape: back of head, top, forehead, nose, chin, neck area */}
      <path d="M17.5 19.277C17.5 19.277 17 14.777 14.5 13.277C12 11.777 10 13.777 10 13.777C10 13.777 7.5 15.277 7.5 17.777C7.5 20.277 9.5 21.777 12 21.777C14.5 21.777 17.5 19.277 17.5 19.277Z" />
      <path d="M14.5 13.277C14.5 13.277 15.5 9.777 14 7.777C12.5 5.777 10 5.277 9 6.777C8 8.277 9 11.777 9 11.777" />
      <path d="M11 10.277Q12 9.277 12.5 8.777L13 7.777L13.5 8.777Q14 9.277 13.5 10.277" /> {/* Simplified nose area */}
      
      {/* Gear (Cog) - Positioned within the main "cranium" area of the profile */}
      {/* Centered approx x=10.5, y=9 */}
      <circle cx="11" cy="9.5" r="2.3" />
      <path d="M11 7.2V6" />      {/* Top spoke */}
      <path d="M11 11.8V10.5" />   {/* Bottom spoke */}
      <path d="M13.05 8.45l0.85 -0.85" /> {/* Top-right spoke */}
      <path d="M8.95 11.55l-0.85 0.85" />  {/* Bottom-left spoke */}
      <path d="M13.05 10.55l0.85 0.85" /> {/* Bottom-right spoke */}
      <path d="M8.95 8.45l-0.85 -0.85" />   {/* Top-left spoke */}
    </svg>
  );
};
