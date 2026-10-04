import React from 'react';

export function GoldDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center my-6 ${className}`}>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent w-24 sm:w-36"></div>
      <div className="mx-3 text-gold-600 flex items-center gap-1.5">
        <span className="text-xs">✦</span>
        <svg className="w-5 h-5 text-gold-500 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L14.2 8.3L20.8 9.2L15.8 13.6L17.2 20.1L12 16.8L6.8 20.1L8.2 13.6L3.2 9.2L9.8 8.3L12 2Z" opacity="0.8" />
        </svg>
        <span className="text-xs">✦</span>
      </div>
      <div className="h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent w-24 sm:w-36"></div>
    </div>
  );
}

export function DecorativeCorner({ position = 'top-left' }: { position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const rotClasses = {
    'top-left': '',
    'top-right': 'rotate-90',
    'bottom-right': 'rotate-180',
    'bottom-left': '-rotate-90',
  };

  return (
    <div className={`w-8 h-8 pointer-events-none text-gold-400 opacity-60 ${rotClasses[position]}`}>
      <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 38V10C2 5.58172 5.58172 2 10 2H38" />
        <path d="M8 38V14C8 10.6863 10.6863 8 14 8H38" strokeWidth="1" strokeDasharray="2 2" />
        <circle cx="6" cy="6" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}

export function KalashIcon({ className = 'w-6 h-6 text-gold-500' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {/* Mango leaves / coconut on top */}
      <path d="M12 2C12 2 10 5 10 7C10 8 11 9 12 9C13 9 14 8 14 7C14 5 12 2 12 2Z" fill="currentColor" fillOpacity="0.3" />
      <path d="M7 6C8.5 7 10 8 10 8" />
      <path d="M17 6C15.5 7 14 8 14 8" />
      {/* Pot body */}
      <path d="M8 9H16L18 12C19.5 14.5 19 18 17 20C15 22 9 22 7 20C5 18 4.5 14.5 6 12L8 9Z" />
      <path d="M7 15H17" strokeDasharray="2 2" />
      {/* Base */}
      <path d="M9 22H15" strokeWidth="2" />
    </svg>
  );
}
