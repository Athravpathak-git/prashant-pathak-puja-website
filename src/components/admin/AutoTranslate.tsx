'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export interface UseAutoTranslateProps {
  valueMr: string;
  valueEn: string;
  onChangeEn: (val: string) => void;
  debounceMs?: number;
  enabled?: boolean;
}

export function useAutoTranslateField({
  valueMr,
  valueEn,
  onChangeEn,
  debounceMs = 800,
  enabled = true,
}: UseAutoTranslateProps) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOutdated, setIsOutdated] = useState(false);
  const [provider, setProvider] = useState<string | null>(null);

  // Track if English was manually modified by the user
  const isManuallyEditedRef = useRef(false);
  const lastTranslatedSourceRef = useRef(valueMr);
  const activeRequestIdRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Function to perform immediate translation
  const translateNow = useCallback(
    async (sourceText: string, forceOverwrite = false) => {
      const trimmed = sourceText.trim();
      if (!trimmed) return;

      const requestId = Date.now();
      activeRequestIdRef.current = requestId;

      setIsTranslating(true);
      setError(null);

      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: trimmed }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'भाषांतर अयशस्वी (Translation failed)');
        }

        const data = await res.json();

        // Check if a newer request was dispatched
        if (activeRequestIdRef.current === requestId) {
          if (data.translatedText) {
            onChangeEn(data.translatedText);
            lastTranslatedSourceRef.current = trimmed;
            isManuallyEditedRef.current = false;
            setIsOutdated(false);
            if (data.provider) setProvider(data.provider);
          }
        }
      } catch (err: any) {
        if (activeRequestIdRef.current === requestId) {
          setError(err.message || 'भाषांतर अयशस्वी');
        }
      } finally {
        if (activeRequestIdRef.current === requestId) {
          setIsTranslating(false);
        }
      }
    },
    [onChangeEn]
  );

  // Debounced auto-translation on Marathi change
  useEffect(() => {
    if (!enabled) return;

    const trimmedMr = valueMr.trim();

    // Clear any pending timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Do not translate if empty or unchanged
    if (!trimmedMr || trimmedMr === lastTranslatedSourceRef.current) {
      return;
    }

    // If English field was manually edited by the user, flag as outdated rather than destructive overwrite
    if (isManuallyEditedRef.current && valueEn.trim() !== '') {
      setIsOutdated(true);
      return;
    }

    // Schedule debounced translation
    timerRef.current = setTimeout(() => {
      translateNow(trimmedMr);
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [valueMr, valueEn, enabled, debounceMs, translateNow]);

  const handleManualEnglishChange = (newVal: string) => {
    isManuallyEditedRef.current = true;
    setIsOutdated(false);
    onChangeEn(newVal);
  };

  const handleTranslateAgain = () => {
    translateNow(valueMr, true);
  };

  return {
    isTranslating,
    error,
    isOutdated,
    provider,
    translateNow: handleTranslateAgain,
    handleManualEnglishChange,
  };
}

interface TranslatePairInputProps {
  labelMr: string;
  labelEn: string;
  valueMr: string;
  valueEn: string;
  onChangeMr: (val: string) => void;
  onChangeEn: (val: string) => void;
  placeholderMr?: string;
  placeholderEn?: string;
  required?: boolean;
  type?: string;
  name?: string;
  className?: string;
  containerClassName?: string;
}

export function TranslatePairInput({
  labelMr,
  labelEn,
  valueMr,
  valueEn,
  onChangeMr,
  onChangeEn,
  placeholderMr,
  placeholderEn,
  required = false,
  type = 'text',
  name,
  className = '',
  containerClassName = '',
}: TranslatePairInputProps) {
  const {
    isTranslating,
    error,
    isOutdated,
    translateNow,
    handleManualEnglishChange,
  } = useAutoTranslateField({
    valueMr,
    valueEn,
    onChangeEn,
  });

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${containerClassName}`}>
      {/* Marathi Source Input */}
      <div>
        <label className="block text-xs font-semibold text-maroon-950 mb-1">
          {labelMr}
        </label>
        <input
          type={type}
          name={name ? `${name}_mr` : undefined}
          required={required}
          value={valueMr}
          onChange={(e) => onChangeMr(e.target.value)}
          placeholder={placeholderMr}
          className={`w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 transition-all ${className}`}
        />
      </div>

      {/* English Translated / Editable Input */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-maroon-950">
            {labelEn}
          </label>

          {/* Action & Status Indicator */}
          <div className="flex items-center gap-1.5 text-[11px]">
            {isTranslating ? (
              <span className="flex items-center gap-1 text-saffron-700 font-medium animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin text-saffron-600" />
                <span>भाषांतर होत आहे...</span>
              </span>
            ) : isOutdated ? (
              <button
                type="button"
                onClick={translateNow}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 transition-colors"
                title="मराठी बदलले आहे. पुन्हा भाषांतर करण्यासाठी क्लिक करा."
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>मराठी बदलले • पुन्हा भाषांतर करा</span>
              </button>
            ) : error ? (
              <button
                type="button"
                onClick={translateNow}
                className="flex items-center gap-1 text-red-600 hover:underline"
                title={error}
              >
                <AlertCircle className="w-3 h-3" />
                <span>अयशस्वी • पुन्हा प्रयत्न करा</span>
              </button>
            ) : (
              valueMr.trim() !== '' && (
                <button
                  type="button"
                  onClick={translateNow}
                  className="flex items-center gap-1 text-[#944B14] hover:text-[#5A1720] transition-colors"
                  title="पुन्हा भाषांतर करा (Translate Again)"
                >
                  <Sparkles className="w-3 h-3 text-gold-500" />
                  <span>Translate Again</span>
                </button>
              )
            )}
          </div>
        </div>

        <input
          type={type}
          name={name ? `${name}_en` : undefined}
          required={required}
          value={valueEn}
          onChange={(e) => handleManualEnglishChange(e.target.value)}
          placeholder={placeholderEn}
          className={`w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 transition-all ${
            isTranslating ? 'border-saffron-400 bg-saffron-50/20' : ''
          } ${className}`}
        />
      </div>
    </div>
  );
}

interface TranslatePairTextareaProps {
  labelMr: string;
  labelEn: string;
  valueMr: string;
  valueEn: string;
  onChangeMr: (val: string) => void;
  onChangeEn: (val: string) => void;
  placeholderMr?: string;
  placeholderEn?: string;
  required?: boolean;
  rows?: number;
  name?: string;
  className?: string;
  containerClassName?: string;
}

export function TranslatePairTextarea({
  labelMr,
  labelEn,
  valueMr,
  valueEn,
  onChangeMr,
  onChangeEn,
  placeholderMr,
  placeholderEn,
  required = false,
  rows = 3,
  name,
  className = '',
  containerClassName = '',
}: TranslatePairTextareaProps) {
  const {
    isTranslating,
    error,
    isOutdated,
    translateNow,
    handleManualEnglishChange,
  } = useAutoTranslateField({
    valueMr,
    valueEn,
    onChangeEn,
  });

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${containerClassName}`}>
      {/* Marathi Source Textarea */}
      <div>
        <label className="block text-xs font-semibold text-maroon-950 mb-1">
          {labelMr}
        </label>
        <textarea
          name={name ? `${name}_mr` : undefined}
          required={required}
          rows={rows}
          value={valueMr}
          onChange={(e) => onChangeMr(e.target.value)}
          placeholder={placeholderMr}
          className={`w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 transition-all ${className}`}
        />
      </div>

      {/* English Translated / Editable Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-maroon-950">
            {labelEn}
          </label>

          {/* Action & Status Indicator */}
          <div className="flex items-center gap-1.5 text-[11px]">
            {isTranslating ? (
              <span className="flex items-center gap-1 text-saffron-700 font-medium animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin text-saffron-600" />
                <span>भाषांतर होत आहे...</span>
              </span>
            ) : isOutdated ? (
              <button
                type="button"
                onClick={translateNow}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300 transition-colors"
                title="मराठी बदलले आहे. पुन्हा भाषांतर करण्यासाठी क्लिक करा."
              >
                <RefreshCw className="w-2.5 h-2.5" />
                <span>मराठी बदलले • पुन्हा भाषांतर करा</span>
              </button>
            ) : error ? (
              <button
                type="button"
                onClick={translateNow}
                className="flex items-center gap-1 text-red-600 hover:underline"
                title={error}
              >
                <AlertCircle className="w-3 h-3" />
                <span>अयशस्वी • पुन्हा प्रयत्न करा</span>
              </button>
            ) : (
              valueMr.trim() !== '' && (
                <button
                  type="button"
                  onClick={translateNow}
                  className="flex items-center gap-1 text-[#944B14] hover:text-[#5A1720] transition-colors"
                  title="पुन्हा भाषांतर करा (Translate Again)"
                >
                  <Sparkles className="w-3 h-3 text-gold-500" />
                  <span>Translate Again</span>
                </button>
              )
            )}
          </div>
        </div>

        <textarea
          name={name ? `${name}_en` : undefined}
          required={required}
          rows={rows}
          value={valueEn}
          onChange={(e) => handleManualEnglishChange(e.target.value)}
          placeholder={placeholderEn}
          className={`w-full px-3 py-2 bg-ivory-50 border border-gold-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-maroon-800 transition-all ${
            isTranslating ? 'border-saffron-400 bg-saffron-50/20' : ''
          } ${className}`}
        />
      </div>
    </div>
  );
}
