import React from 'react';
import { LanguageMode } from '../types';

interface BilingualTextProps {
  zh: string;
  en: string;
  mode: LanguageMode;
  className?: string;
  primaryClass?: string;
  secondaryClass?: string;
  vertical?: boolean;
}

export const BilingualText: React.FC<BilingualTextProps> = ({
  zh,
  en,
  mode,
  className = '',
  primaryClass = 'font-medium text-slate-900',
  secondaryClass = 'text-[11px] text-slate-400 font-normal leading-tight block',
  vertical = false,
}) => {
  const isZhFirst = mode === 'zh-first';

  if (vertical) {
    return (
      <div className={`flex flex-col ${className}`}>
        <span className={primaryClass}>{isZhFirst ? zh : en}</span>
        <span className={secondaryClass}>{isZhFirst ? en : zh}</span>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-baseline flex-wrap gap-x-1.5 ${className}`}>
      <span className={primaryClass}>{isZhFirst ? zh : en}</span>
      <span className={secondaryClass}>{isZhFirst ? en : zh}</span>
    </span>
  );
};
