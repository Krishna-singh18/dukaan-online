import React from 'react';

/**
 * Reusable Section Heading Component
 * 
 * @param {Object} props
 * @param {string} props.badge - Small pill badge over heading
 * @param {string} props.title - Main heading text
 * @param {string} props.subtitle - Descriptive subtext
 * @param {'left' | 'center'} props.align - Alignment
 * @param {React.ReactNode} props.action - Optional right side action button/link
 * @param {string} props.className
 */
export function SectionHeading({
  badge,
  title,
  subtitle,
  align = 'left',
  action,
  className = '',
}) {
  const isCenter = align === 'center';

  return (
    <div className={`mb-6 sm:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 ${className}`}>
      <div className={`${isCenter ? 'text-center mx-auto' : 'text-left'}`}>
        {badge && (
          <span className="inline-block text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-secondary text-primary mb-2">
            {badge}
          </span>
        )}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-mainText tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm sm:text-base text-secondaryText max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {action && !isCenter && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}

export default SectionHeading;

