'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { locales, localeConfig, type Locale } from '@/lib/i18n/config';
import { useLanguageSwitcher } from '@/lib/i18n/hooks';

interface LanguageSwitcherProps {
  className?: string;
  showFlag?: boolean;
  showText?: boolean;
  variant?: 'dropdown' | 'inline';
}

export function LanguageSwitcher({ 
  className = '', 
  showFlag = true, 
  showText = true,
  variant = 'dropdown'
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentLocale, switchLanguage } = useLanguageSwitcher();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    switchLanguage(newLocale);
    setIsOpen(false);
  };

  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {locales.map((locale) => (
          <button
            key={locale}
            onClick={() => handleLanguageChange(locale)}
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium transition-colors ${
              locale === currentLocale
                ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-100 dark:hover:bg-gray-800'
            }`}
            aria-label={`Switch to ${localeConfig[locale].name}`}
          >
            {showFlag && (
              <span className="text-lg" role="img" aria-hidden="true">
                {localeConfig[locale].flag}
              </span>
            )}
            {showText && (
              <span className="hidden sm:inline">
                {localeConfig[locale].nativeName}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/20 backdrop-blur-sm"
        aria-label="Switch language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {showFlag ? (
          <span className="text-lg" role="img" aria-hidden="true">
            {localeConfig[currentLocale].flag}
          </span>
        ) : (
          <Globe className="w-5 h-5" />
        )}
        
        {showText && (
          <span className="text-sm font-medium hidden sm:inline">
            {localeConfig[currentLocale].nativeName}
          </span>
        )}
        
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 min-w-[180px] z-50 overflow-hidden">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLanguageChange(locale)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                locale === currentLocale ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
              }`}
              role="menuitem"
            >
              <span className="text-lg" role="img" aria-hidden="true">
                {localeConfig[locale].flag}
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-medium">
                  {localeConfig[locale].nativeName}
                </span>
                <span className="text-xs text-gray-500">
                  {localeConfig[locale].name}
                </span>
              </div>
              {locale === currentLocale && (
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Compact version for mobile/header use
export function CompactLanguageSwitcher({ className = '' }: { className?: string }) {
  return (
    <LanguageSwitcher 
      className={className}
      showFlag={true}
      showText={false}
      variant="dropdown"
    />
  );
}

// Inline version for footer/settings
export function InlineLanguageSwitcher({ className = '' }: { className?: string }) {
  return (
    <LanguageSwitcher 
      className={className}
      showFlag={true}
      showText={true}
      variant="inline"
    />
  );
}