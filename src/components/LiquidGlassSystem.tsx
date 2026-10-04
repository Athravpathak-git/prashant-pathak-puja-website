'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Liquid Glass Card Container
 */
export function GlassCard({
  children,
  variant = 'white',
  className = '',
  hoverEffect = false,
  padding = 'p-6',
  onClick,
}: {
  children: React.ReactNode;
  variant?: 'white' | 'ivory' | 'dark' | 'maroon';
  className?: string;
  hoverEffect?: boolean;
  padding?: string;
  onClick?: () => void;
}) {
  const variantStyles = {
    white: 'bg-white/70 backdrop-blur-md border border-[#B58A3A]/35 shadow-[0_8px_30px_rgb(90,23,32,0.04)]',
    ivory: 'bg-[#FAF7F0]/75 backdrop-blur-md border border-[#B58A3A]/35 shadow-[0_8px_30px_rgb(90,23,32,0.04)]',
    dark: 'bg-[#321116]/90 backdrop-blur-lg border border-[#B58A3A]/40 text-[#FAF7F0] shadow-[0_12px_40px_rgba(0,0,0,0.3)]',
    maroon: 'bg-[#5A1720]/85 backdrop-blur-lg border border-[#D8B96A]/40 text-[#FAF7F0] shadow-[0_12px_40px_rgba(66,18,24,0.3)]',
  };

  const hoverStyle = hoverEffect
    ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(181,138,58,0.2)] hover:border-[#B58A3A]/70 cursor-pointer'
    : '';

  return (
    <div
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden ${variantStyles[variant]} ${hoverStyle} ${padding} ${className}`}
    >
      {/* Subtle top glare reflection */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
      {children}
    </div>
  );
}

/**
 * Liquid Glass Action Button
 */
export function GlassButton({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  icon: Icon,
}: {
  children: React.ReactNode;
  variant?: 'primary' | 'gold' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ElementType;
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-5 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-7 py-3 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary: 'bg-gradient-to-r from-[#651C24] via-[#5A1720] to-[#421218] text-[#FAF7F0] border border-[#D8B96A]/50 shadow-[0_4px_16px_rgba(66,18,24,0.3)] hover:brightness-110 hover:shadow-[0_6px_20px_rgba(66,18,24,0.45)] hover:border-[#D8B96A]/80',
    gold: 'bg-gradient-to-r from-[#D8B96A] via-[#B58A3A] to-[#9C732B] text-[#24211E] font-semibold border border-[#B58A3A]/60 shadow-[0_4px_16px_rgba(181,138,58,0.25)] hover:brightness-105 hover:shadow-[0_6px_22px_rgba(181,138,58,0.4)]',
    secondary: 'bg-white/80 backdrop-blur-md text-[#24211E] border border-[#B58A3A]/40 shadow-sm hover:bg-white hover:border-[#B58A3A]/70 hover:shadow-md',
    ghost: 'bg-transparent text-[#651C24] hover:bg-[#B58A3A]/10 border border-transparent hover:border-[#B58A3A]/30',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current shrink-0" />
      ) : null}
      <span>{children}</span>
    </button>
  );
}

/**
 * Liquid Glass Form Input
 */
export function GlassInput({
  label,
  error,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  icon?: React.ElementType;
  containerClassName?: string;
}) {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-[#282321]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B58A3A] pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          {...props}
          className={`w-full ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 py-2.5 rounded-xl bg-white/75 backdrop-blur-md border border-[#B58A3A]/35 text-xs sm:text-sm text-[#282321] placeholder-[#6F625A]/60 shadow-inner focus:outline-none focus:bg-white focus:border-[#B58A3A] focus:ring-2 focus:ring-[#B58A3A]/20 transition-all ${
            error ? 'border-red-400 focus:ring-red-200' : ''
          } ${className}`}
        />
      </div>
      {error && <p className="text-[11px] text-red-600 font-medium pl-1">{error}</p>}
    </div>
  );
}

/**
 * Liquid Glass Form Select
 */
export function GlassSelect({
  label,
  error,
  icon: Icon,
  children,
  className = '',
  containerClassName = '',
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  icon?: React.ElementType;
  containerClassName?: string;
}) {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-[#282321]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B58A3A] pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <select
          {...props}
          className={`w-full ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-8 py-2.5 rounded-xl bg-white/75 backdrop-blur-md border border-[#B58A3A]/35 text-xs sm:text-sm text-[#282321] shadow-inner focus:outline-none focus:bg-white focus:border-[#B58A3A] focus:ring-2 focus:ring-[#B58A3A]/20 transition-all ${
            error ? 'border-red-400 focus:ring-red-200' : ''
          } ${className}`}
        >
          {children}
        </select>
      </div>
      {error && <p className="text-[11px] text-red-600 font-medium pl-1">{error}</p>}
    </div>
  );
}

/**
 * Liquid Glass Form Textarea
 */
export function GlassTextarea({
  label,
  error,
  className = '',
  containerClassName = '',
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  containerClassName?: string;
}) {
  return (
    <div className={`space-y-1.5 ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-[#282321]">
          {label}
        </label>
      )}
      <textarea
        {...props}
        className={`w-full p-3.5 rounded-xl bg-white/75 backdrop-blur-md border border-[#B58A3A]/35 text-xs sm:text-sm text-[#282321] placeholder-[#6F625A]/60 shadow-inner focus:outline-none focus:bg-white focus:border-[#B58A3A] focus:ring-2 focus:ring-[#B58A3A]/20 transition-all resize-y ${
          error ? 'border-red-400 focus:ring-red-200' : ''
        } ${className}`}
      />
      {error && <p className="text-[11px] text-red-600 font-medium pl-1">{error}</p>}
    </div>
  );
}

/**
 * Liquid Glass Badge / Pill
 */
export function GlassBadge({
  children,
  variant = 'gold',
  size = 'sm',
  className = '',
}: {
  children: React.ReactNode;
  variant?: 'gold' | 'maroon' | 'saffron' | 'white';
  size?: 'sm' | 'md';
  className?: string;
}) {
  const variantStyles = {
    gold: 'bg-[#FAF7F0]/90 text-[#805E21] border-[#B58A3A]/45 shadow-[0_2px_8px_rgba(181,138,58,0.12)]',
    maroon: 'bg-[#FDF2F4]/90 text-[#651C24] border-[#F1AAB7]/80 shadow-[0_2px_8px_rgba(101,28,36,0.12)]',
    saffron: 'bg-[#FFF7EB]/90 text-[#C86B24] border-[#FCC47B]/80 shadow-[0_2px_8px_rgba(200,107,36,0.12)]',
    white: 'bg-white/85 text-[#282321] border-[#B58A3A]/30 shadow-xs',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5',
    md: 'text-xs px-3.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border backdrop-blur-xs select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      <span className="text-[10px] text-[#B58A3A] leading-none">❖</span>
      <span>{children}</span>
    </span>
  );
}

/**
 * Liquid Glass Stat / Counter Card
 */
export function GlassStatCard({
  value,
  label,
  sublabel,
  icon: Icon,
  className = '',
}: {
  value: string | number;
  label: string;
  sublabel?: string;
  icon?: React.ElementType;
  className?: string;
}) {
  return (
    <GlassCard variant="white" padding="p-5 sm:p-6" className={className} hoverEffect>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-[#6F625A] uppercase tracking-wider">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold font-serif text-[#5A1720] tracking-tight">{value}</p>
          {sublabel && <p className="text-xs text-[#6F625A] pt-0.5">{sublabel}</p>}
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FAF7F0] to-white border border-[#B58A3A]/40 flex items-center justify-center text-[#B58A3A] shadow-xs shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </GlassCard>
  );
}

/**
 * Liquid Glass Empty State Container
 */
export function GlassEmptyState({
  title,
  description,
  action,
  className = '',
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <GlassCard variant="ivory" padding="p-8 sm:p-12" className={`text-center max-w-lg mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#651C24] to-[#C86B24] border border-[#D8B96A] text-[#FAF7F0] font-serif text-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
        ॐ
      </div>
      <h3 className="font-serif font-bold text-lg text-[#5A1720] mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-[#6F625A] max-w-md mx-auto mb-5 leading-relaxed">{description}</p>
      {action && <div className="flex justify-center">{action}</div>}
    </GlassCard>
  );
}

/**
 * Liquid Glass Loading State Container
 */
export function GlassLoadingState({
  message = 'लोड होत आहे...',
  className = '',
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-2 border-[#B58A3A]/30 border-t-[#651C24] animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center font-serif text-sm font-bold text-[#651C24]">ॐ</span>
      </div>
      <p className="mt-4 text-xs font-semibold text-[#6F625A] tracking-wide">{message}</p>
    </div>
  );
}

/**
 * Liquid Glass Section Wrapper
 */
export function GlassSection({
  children,
  className = '',
  containerClassName = 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section className={`py-12 sm:py-16 relative ${className}`}>
      <div className={containerClassName}>{children}</div>
    </section>
  );
}

/**
 * Liquid Glass Table Wrapper
 */
export function GlassTable({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-[#B58A3A]/35 bg-white/75 backdrop-blur-md shadow-xs ${className}`}>
      <table className="w-full text-left border-collapse text-xs sm:text-sm">{children}</table>
    </div>
  );
}
