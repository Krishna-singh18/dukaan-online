import React, { useState } from 'react';
import { useStore } from '../hooks/useStore';
import { SectionHeading } from '../components/common/SectionHeading';
import { generateWhatsAppInquiryUrl } from '../utils/whatsappOrder';
import {
  Phone,
  MapPin,
  Clock,
  Truck,
  ExternalLink,
  MessageCircle,
  Send,
  CheckCircle2
} from 'lucide-react';

export function Contact() {
  const { storeConfig } = useStore();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSendInquiry = (e) => {
    e.preventDefault();
    if (!inquiryMessage.trim()) return;

    let text = `Namaste ${storeConfig.name}!\n`;
    if (inquiryName.trim()) {
      text += `My name is *${inquiryName.trim()}*.\n`;
    }
    text += `Inquiry: ${inquiryMessage.trim()}`;

    const url = generateWhatsAppInquiryUrl(text, storeConfig?.whatsappNumber, storeConfig?.name);
    window.open(url, '_blank');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="py-6 sm:py-14 bg-background min-h-[75vh]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <span className="inline-block text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-secondary text-primary mb-3">
            Get in Touch
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-mainText tracking-tight mb-2 sm:mb-3">
            We Are Here to Help You
          </h1>
          <p className="text-xs sm:text-base text-secondaryText">
            Have questions about products, bulk orders, or daily doorstep delivery? Call, visit, or chat with us directly on WhatsApp.
          </p>
        </div>

        {/* 2-Column Contact Info & Direct Inquiry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start mb-12 sm:mb-14">
          
          {/* Left Column: Direct Contact Details & Working Hours */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            
            {/* Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              
              {/* Phone Card */}
              <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs hover:border-emerald-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary mb-3">
                  <Phone size={19} />
                </div>
                <h3 className="font-bold text-sm text-mainText mb-1">Call Us Directly</h3>
                <p className="text-xs text-secondaryText mb-2 sm:mb-3">Instant phone assistance for local orders</p>
                <a
                  href={`tel:${storeConfig.displayPhone}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline"
                >
                  <span>{storeConfig.displayPhone}</span>
                </a>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs hover:border-emerald-200 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-[#25D366] mb-3">
                  <MessageCircle size={19} />
                </div>
                <h3 className="font-bold text-sm text-mainText mb-1">WhatsApp Chat</h3>
                <p className="text-xs text-secondaryText mb-2 sm:mb-3">Fast responses &amp; easy order placement</p>
                <a
                  href={generateWhatsAppInquiryUrl('', storeConfig?.whatsappNumber, storeConfig?.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#25D366] hover:underline"
                >
                  <span>{storeConfig.displayPhone || 'Chat on WhatsApp'}</span>
                  <ExternalLink size={13} />
                </a>
              </div>

              {/* Hours Card */}
              <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs sm:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0">
                    <Clock size={19} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-mainText mb-1">Store &amp; Delivery Hours</h3>
                    <div className="space-y-1 text-xs text-secondaryText">
                      <p>
                        <strong className="text-mainText">Open:</strong> {storeConfig.openingHours.days} ({storeConfig.openingHours.timing})
                      </p>
                      <p>
                        <strong className="text-mainText">Delivery Hours:</strong> {storeConfig.openingHours.deliveryTiming}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs sm:col-span-2">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0">
                    <MapPin size={19} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-mainText mb-1">Shop Address</h3>
                    <p className="text-xs sm:text-sm text-secondaryText mb-2.5">
                      {storeConfig.address.fullAddress}
                    </p>
                    <a
                      href={storeConfig.address?.mapsUrl || `https://maps.google.com/?q=${encodeURIComponent(storeConfig.address?.fullAddress || storeConfig.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:underline bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200"
                    >
                      <span>Open in Google Maps Navigation</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </div>

            </div>

            {/* Delivery Areas Pill Box */}
            <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-2xs">
              <div className="flex items-center gap-2 mb-1.5 font-bold text-sm text-mainText">
                <Truck size={17} className="text-primary" />
                <span>Local Doorstep Delivery Coverage ({storeConfig.delivery.deliveryRadius})</span>
              </div>
              <p className="text-xs text-secondaryText mb-3">
                Orders delivered within {storeConfig.delivery.estimatedTime}. Free delivery on orders over ₹{storeConfig.delivery.freeDeliveryAbove}.
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {storeConfig.delivery.deliveryAreas.map((area, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-medium bg-secondary text-primary px-2.5 py-1 rounded-lg border border-emerald-100"
                  >
                    📍 {area}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Direct WhatsApp Message Form */}
          <div className="lg:col-span-5 bg-surface rounded-2xl p-5 sm:p-7 border border-gray-100 shadow-2xs">
            <h3 className="text-base sm:text-lg font-bold text-mainText mb-1">
              Send a Message to Store Owner
            </h3>
            <p className="text-xs text-secondaryText mb-4 sm:mb-5">
              Enter your inquiry or custom grocery list. This will open directly in WhatsApp for quick conversation.
            </p>

            <form onSubmit={handleSendInquiry} className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-xs font-bold text-mainText mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="e.g. Sunita Devi"
                  className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-mainText mb-1">
                  Your Question or Grocery Items *
                </label>
                <textarea
                  rows={4}
                  required
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="e.g. Do you have fresh paneer and 10kg Aashirvaad Atta available for delivery right now?"
                  className="w-full px-3.5 py-2.5 rounded-xl text-base sm:text-sm bg-background border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Send size={15} />
                <span>Send via WhatsApp Chat</span>
              </button>

              {submitted && (
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-primary shrink-0" />
                  <span>WhatsApp message prepared! Please send it in WhatsApp.</span>
                </div>
              )}
            </form>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Contact;
