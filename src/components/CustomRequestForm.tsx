import React, { useState } from 'react';
import { PlusCircle, MessageSquare, MapPin, Send, HelpCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data';
import { CustomImportRequest } from '../types';
import { speakText } from '../utils/speech';

interface CustomRequestFormProps {
  onBack: () => void;
  onSubmitRequest: (request: CustomImportRequest) => void;
}

export default function CustomRequestForm({
  onBack,
  onSubmitRequest,
}: CustomRequestFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [imageLink, setImageLink] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; mapsUrl?: string } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  // Trigger geolocation lookup
  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      speakText("Geolocation is not supported by your device or browser.");
      alert("Geolocation is not supported by your device.");
      return;
    }

    setIsLocating(true);
    speakText("Requesting your device GPS location. Please allow access.");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setLocation({ latitude, longitude, mapsUrl });
        setIsLocating(false);
        speakText("GPS Coordinates captured successfully. Handshake link is ready.");
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
        speakText("Could not fetch GPS location. Please enter delivery address details manually in description.");
        alert("Could not access your location. Please check your browser or device permission settings.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !description.trim() || !budget.trim()) {
      speakText("Please fill in all mandatory fields before sending.");
      return;
    }

    // Prepare request payload for local logs
    const newRequest: CustomImportRequest = {
      id: `req-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      description: description.trim(),
      budget: parseFloat(budget) || 0,
      imageLink: imageLink.trim() || undefined,
      location: location || undefined,
      timestamp: new Date().toLocaleString(),
    };

    // Save to local logs state
    onSubmitRequest(newRequest);

    // Dynamic WhatsApp url preparation
    const locationString = location?.mapsUrl 
      ? `\n📍 GPS Location: ${location.mapsUrl}` 
      : '';
    const emailString = email ? `\n📧 Email: ${email}` : '';
    const photoString = imageLink ? `\n📸 Reference Photo: ${imageLink}` : '';

    const whatsappMessage = 
      `*🆕 PHORAMEC CUSTOM IMPORT REQUEST*\n` +
      `--------------------------------------\n` +
      `👤 *Name:* ${name}\n` +
      `📞 *Phone:* ${phone}${emailString}\n` +
      `📝 *Import Item:* ${description}\n` +
      `💰 *Max Budget:* GHS ${parseFloat(budget).toLocaleString()}${photoString}${locationString}\n` +
      `--------------------------------------\n` +
      `*Phoramec, please buy and import this for me!*`;

    const encodedMsg = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMsg}`;

    speakText("Custom request processed. Redirecting to WhatsApp to complete your order.");
    setFormSuccess(true);

    // Open WhatsApp after a short delay
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      onBack();
    }, 1500);
  };

  // Generate dynamic live WhatsApp bubble preview
  const getWhatsAppPreview = () => {
    const descText = description || "e.g., iPhone 15 Pro, Brand New, with Box";
    const budgetVal = budget ? `GHS ${parseFloat(budget).toLocaleString()}` : "GHS 0.00";
    const locationText = location ? "📍 GPS Location Shared" : "📍 Location details will appear here if shared";
    return (
      <div className="rounded-xl bg-[#d9fdd3] p-4 text-neutral-800 shadow-sm border border-[#b7ebae] text-xs font-mono max-w-sm whitespace-pre-line leading-relaxed">
        <strong>Phoramec Imports Avenue</strong>
        <div className="mt-2 text-[11px]">
          {`*🆕 CUSTOM IMPORT REQUEST*
👤 *Name:* ${name || "[Name]"}
📞 *Phone:* ${phone || "[Phone]"}${email ? `\n📧 *Email:* ${email}` : ''}
📝 *Item:* ${descText}
💰 *Max Budget:* ${budgetVal}
${imageLink ? `📸 *Reference Photo:* ${imageLink}` : ''}
${location ? `📍 *GPS Link:* ${location.mapsUrl}` : locationText}`}
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6">
      
      {/* Back Header */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex h-12 items-center gap-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-4 text-sm font-bold text-neutral-700 dark:text-gray-300 transition-all hover:bg-neutral-200 dark:hover:bg-white/5 active:scale-95"
          onMouseEnter={() => speakText("Back to category catalog page.")}
          id="custom-req-back-btn"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <h2 className="font-display text-lg font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
          <span className="w-2 h-6 bg-yellow-500 rounded-full"></span>
          Custom Import Form
        </h2>
      </div>

      {formSuccess ? (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 p-6 text-center shadow-lg">
          <CheckCircle className="mx-auto h-16 w-16 text-green-400 animate-bounce" />
          <h3 className="mt-4 text-lg font-black text-green-400">
            Request Prepared Successfully!
          </h3>
          <p className="mt-2 text-sm text-neutral-700 dark:text-gray-300">
            Now redirecting to WhatsApp to complete your message delivery. Please tap "Send" in WhatsApp if prompted.
          </p>
        </div>
      ) : (
        <form onSubmit={handleFormSubmit} className="space-y-5 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#1a1a1a] p-5 shadow-lg">
          
          <div className="border-b border-neutral-200 dark:border-white/10 pb-3">
            <h3 className="font-display text-base font-extrabold text-neutral-900 dark:text-white">
              What do you want us to buy?
            </h3>
            <p className="text-xs text-neutral-500 dark:text-gray-400">
              We shop from top retailers in the US, UK, and China and deliver safely to your doorstep in Ghana.
            </p>
          </div>

          <div className="space-y-4">
            {/* Contact Name (Mandatory) */}
            <div>
              <label className="block text-xs font-bold text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                Your Full Name <span className="text-yellow-500">*</span>
              </label>
              <input
                type="text"
                required
                className="block h-12 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-4 text-sm font-semibold text-neutral-900 dark:text-white transition-all placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-yellow-500/20"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="req-input-name"
              />
            </div>

            {/* Contact Phone (Mandatory) */}
            <div>
              <label className="block text-xs font-bold text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                WhatsApp Phone Number <span className="text-yellow-500">*</span>
              </label>
              <input
                type="tel"
                required
                className="block h-12 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-4 text-sm font-semibold text-neutral-900 dark:text-white transition-all placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-yellow-500/20"
                placeholder="e.g. 055 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                id="req-input-phone"
              />
            </div>

            {/* Optional Email Address */}
            <div>
              <label className="block text-xs font-bold text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1 flex justify-between">
                <span>Email Address</span>
                <span className="text-yellow-600 dark:text-yellow-500 font-bold normal-case text-[11px]">Optional (For Email Receipt)</span>
              </label>
              <input
                type="email"
                className="block h-12 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-4 text-sm font-semibold text-neutral-900 dark:text-white transition-all placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-yellow-500/20"
                placeholder="yourname@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="req-input-email"
              />
            </div>

            {/* Item Description (Mandatory) */}
            <div>
              <label className="block text-xs font-bold text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                Detailed Product Description <span className="text-yellow-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                className="block w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] p-4 text-sm font-semibold text-neutral-900 dark:text-white transition-all placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-yellow-500/20"
                placeholder="Describe brand, model, specifications, colour, and size"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                id="req-input-description"
              />
            </div>

            {/* Budget (Mandatory) */}
            <div>
              <label className="block text-xs font-bold text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                Your Maximum Budget (GHS) <span className="text-yellow-500">*</span>
              </label>
              <input
                type="number"
                required
                min="1"
                className="block h-12 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-4 text-sm font-semibold text-neutral-900 dark:text-white transition-all placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-yellow-500/20"
                placeholder="e.g. 5000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                id="req-input-budget"
              />
            </div>

            {/* Reference Image Link (Optional) */}
            <div>
              <label className="block text-xs font-bold text-neutral-600 dark:text-gray-400 uppercase tracking-wider mb-1 flex justify-between">
                <span>Reference Image URL</span>
                <span className="text-neutral-500 dark:text-gray-500 font-semibold normal-case text-[11px]">Optional</span>
              </label>
              <input
                type="url"
                className="block h-12 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] px-4 text-sm font-semibold text-neutral-900 dark:text-white transition-all placeholder:text-neutral-400 dark:placeholder:text-gray-500 focus:border-yellow-500 focus:bg-white dark:focus:bg-[#121212] focus:ring-2 focus:ring-yellow-500/20"
                placeholder="Paste reference picture web link here"
                value={imageLink}
                onChange={(e) => setImageLink(e.target.value)}
                id="req-input-image"
              />
            </div>

            {/* Geolocation Hook */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleShareLocation}
                disabled={isLocating}
                className={`flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-dashed text-xs font-bold transition-all active:scale-95 ${
                  location 
                    ? 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400' 
                    : 'border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-[#1e1e1e] text-neutral-700 dark:text-gray-300 hover:bg-neutral-200 dark:hover:bg-[#222]'
                }`}
                id="req-gps-btn"
              >
                <MapPin className={`h-4 w-4 ${isLocating ? 'animate-spin text-yellow-500' : ''}`} />
                {isLocating 
                  ? 'Accessing GPS Satellites...' 
                  : location 
                    ? '📍 Delivery GPS Coordinates Captured!' 
                    : 'Tap to Share Delivery Location (GPS)'}
              </button>
            </div>
          </div>

          {/* Real-time WhatsApp Text Bubble Preview */}
          <div className="space-y-2 pt-3 border-t border-neutral-200 dark:border-white/10">
            <h4 className="text-xs font-extrabold text-neutral-500 dark:text-gray-500 uppercase tracking-wider">
              WhatsApp Text Preview
            </h4>
            <div className="rounded-xl bg-neutral-100 dark:bg-[#121212] p-4 text-neutral-700 dark:text-gray-300 shadow-sm border border-neutral-200 dark:border-white/5 text-xs font-mono max-w-sm whitespace-pre-line leading-relaxed">
              <strong>Phoramec Imports Avenue</strong>
              <div className="mt-2 text-[11px]">
                {`*🆕 CUSTOM IMPORT REQUEST*
👤 *Name:* ${name || "[Name]"}
📞 *Phone:* ${phone || "[Phone]"}${email ? `\n📧 *Email:* ${email}` : ''}
📝 *Item:* ${description || "e.g., iPhone 15 Pro, Brand New, with Box"}
💰 *Max Budget:* ${budget ? `GHS ${parseFloat(budget).toLocaleString()}` : "GHS 0.00"}
${imageLink ? `📸 *Reference Photo:* ${imageLink}` : ''}
${location ? `📍 *GPS Link:* ${location.mapsUrl}` : (location ? "📍 GPS Location Shared" : "📍 Location details will appear here if shared")}`}
              </div>
            </div>
          </div>

          {/* Submit Button (Extreme Hit-Box Target) */}
          <button
            type="submit"
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 font-black text-black transition-all hover:bg-yellow-600 active:scale-95 shadow-md"
            id="req-submit-btn"
            onMouseEnter={() => speakText("Tap here to compile request and send directly to Phoramec on WhatsApp.")}
          >
            <Send className="h-4 w-4" />
            Send Custom Import via WhatsApp
          </button>
        </form>
      )}
    </div>
  );
}
