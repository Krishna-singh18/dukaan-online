import React from 'react';
import { useStore } from '../../hooks/useStore';
import { generateWhatsAppInquiryUrl } from '../../utils/whatsappOrder';

/**
 * WhatsApp Button Component
 * Can be rendered as an inline action button or floating action button (FAB)
 * 
 * @param {Object} props
 * @param {'inline' | 'floating'} props.mode
 * @param {string} props.label
 * @param {string} props.message
 * @param {string} props.className
 */
export function WhatsAppButton({
  mode = 'inline',
  label = 'Order on WhatsApp',
  message = '',
  className = '',
  size = 'md',
}) {
  const { storeConfig } = useStore();
  const url = generateWhatsAppInquiryUrl(message, storeConfig?.whatsappNumber, storeConfig?.name);

  const WhatsAppIcon = ({ size = 20, className = '' }) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.17-3.12.82.83-3.04-.19-.3a8.17 8.17 0 0 1-1.25-4.47c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1 1.06-.16 1.47-.72 1.47-.81.08-.09.08-.17.06-.29z"/>
    </svg>
  );

  if (mode === 'floating') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with store on WhatsApp"
        className={`fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 bg-[#25D366] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl hover:bg-[#20ba5a] active:scale-95 transition-all duration-300 flex items-center gap-2.5 group ${className}`}
      >
        <WhatsAppIcon size={24} />
        <span className="hidden sm:inline font-semibold text-sm">
          {label}
        </span>
      </a>
    );
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5 font-semibold',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center font-medium rounded-xl bg-[#25D366] text-white hover:bg-[#20ba5a] shadow-sm hover:shadow transition-all duration-200 active:scale-[0.98] ${sizes[size] || sizes.md} ${className}`}
    >
      <WhatsAppIcon size={size === 'lg' ? 22 : 18} />
      <span>{label}</span>
    </a>
  );
}

export default WhatsAppButton;

