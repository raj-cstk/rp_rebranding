"use client"

import { useState } from "react";
import { useJstag } from "../context/lyticsTracking";
import { ContentstackClient } from "@/lib/contentstack-client";


export default function Modal({ content , open = false, onClose = () => {} }) {
  const [formState, setFormState] = useState({});
  const jstag = useJstag();

  if (!open) return null;

  const modal = content?.[0];
  const blocks = modal?.modular_blocks || [];

  console.log("button reference in modal:", modal?.button_reference);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };


  // Handle form submit (button click)
  const handleSend = () => {
    if (typeof jstag !== "undefined" && jstag && typeof jstag.send === "function") {
      console.log("Sending to jstag:", formState);
      jstag.send(formState);
      console.log("Data sent to jstag successfully");
    } else {
      console.warn("jstag is not available");
    }
    onClose();
  };

  // Handle button click: fetch referenced entry and redirect if button_reference exists, else call handleSend
  const handleButtonClick = async () => {
    if (modal?.button_reference && modal.button_reference[0]?._content_type_uid && modal.button_reference[0]?.uid) {
      try {
        const locale = modal.locale || (typeof window !== 'undefined' ? window.location.pathname?.split('/').filter(Boolean)[0] : 'en');
        const entry = await ContentstackClient.getElement(
          modal.button_reference[0].uid,
          modal.button_reference[0]._content_type_uid,
          locale
        );
        console.log("Fetched referenced entry for button:", entry);
        // Try to get the url from the entry
        const url = entry?.url || entry?.[0]?.url;
        if (url) {
          // Prepend domain and locale if not already present
          let base = '';
          if (typeof window !== 'undefined') {
            base = window.location.origin;
          }
          // Ensure url starts with a slash
          const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
          // If locale is not already in the url, add it
          let finalUrl = normalizedUrl;
          if (!normalizedUrl.startsWith(`/${locale}/`)) {
            finalUrl = `/${locale}${normalizedUrl}`;
          }
          window.location.href = `${base}${finalUrl}`;
          return;
        }
      } catch (e) {
        console.warn('Failed to fetch referenced entry or url:', e);
      }
    }
    // Check if any of the blocks have name_block, phone_block, or email_block if yes then call handleSend to send form data to jstag, else just close the modal
    const hasFormBlock = Array.isArray(blocks) && blocks.some(
      block => block.name_block || block.phone_block || block.email_block
    );
    if (hasFormBlock) {
      handleSend();
      console.log("Form submitted with data:", formState);
    } else {
      onClose();
    }
  };
  

  const getOverlayOpacity = (overlayValue) => {
    const opacityMap = {
      "0%": 1,
      "25%": 0.75,
      "50%": 0.5,
      "75%": 0.25,
      "100%": 0,
    };
    return opacityMap[overlayValue] ?? 1; 
  };

  const overlayOpacity = getOverlayOpacity(modal?.overlay);

  // Determine button alignment
  let buttonContainerClass = "flex gap-3";
  if (modal?.alignment === "Left") {
    buttonContainerClass = "flex gap-3 justify-start";
  } else if (modal?.alignment === "Center") {
    buttonContainerClass = "flex gap-3 justify-center";
  } else if (modal?.alignment === "Right") {
    buttonContainerClass = "flex gap-3 justify-end";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black"
        style={{
          opacity: overlayOpacity,
        }}
        onClick={onClose}
      ></div>

      <div className="relative bg-white shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ×
        </button>

        {/* Modal Content */}
        <div className="p-8">

          {/* Render blocks in sequence */}
          {blocks.map((block, index) => (
            <div key={index}>
              {/* Image Block */}
              {block.image_block?.image?.url && (
                <div className="mb-6 h-fit overflow-hidden bg-gray-100 ">
                  <img
                    src={block.image_block.image.url}
                    alt={block.image_block.image?.title || "modal image"}
                    className="w-full h-full object-cover"
                    {...(block.image_block.$?.image || {})}
                  />
                </div>
              )}
              {/* Teaser Block */}
              {block.teaser_block?.teaser_text && (
                <p className="text-3xl! text-gray-600 mb-4 leading-relaxed" {...(block.teaser_block?.$?.teaser_text || {})}>
                  {block.teaser_block.teaser_text}
                </p>
              )}

              {/* Body Block */}
              {block.body_block?.body && (
                <div
                  className="text-base text-gray-700 mb-6 leading-relaxed prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: block.body_block.body }}
                  {...(block.body_block?.$?.body || {})}
                />
              )}

              {/* Full Name Field */}
              {block.name_block?.name_format === "Full Name" && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">{block.name_block?.full_name_label || "Full Name"}</label>
                  <input
                    type="text"
                    name="fullname"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={formState.fullname ??  ''}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* First and last Name Field */}
              {block.name_block?.name_format === "First And Last Name" && (
               <div>
                 <div className="mb-4">
                  <label className="block text-gray-700 mb-1">{block.name_block?.first_name_label || "First Name"}</label>
                  <input
                    type="text"
                    name="first_name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={formState.first_name ?? ''}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">{block.name_block?.last_name_label || "Last Name"}</label>
                  <input
                    type="text"
                    name="last_name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={formState.last_name ?? ''}
                    onChange={handleChange}
                  />
                </div>
              </div>
              )}


              {/* Phone Field */}
              {block.phone_block?.phone_number_field === true && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">{block.phone_block?.phone_number_label || "Phone Number"}</label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={formState.phone ?? ''}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* Email Field */}
              {block.email_block?.email_field === true && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">{block.email_block?.email_label || "Email Address"}</label>
                  <input
                    type="email"
                    name="email"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    value={formState.email ?? ''}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          ))}

          {/* Button */}
          {modal?.button_text && (
            <div className={buttonContainerClass}>
              <button
                onClick={handleButtonClick}
                className="text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                style={{
                  backgroundColor: modal?.button_colour?.hex || '#FFFFFF',
                  opacity: 0.8,
                }}
                {...(modal?.$?.button_text || {})}
              >
                {modal.button_text}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
