"use client";
import { useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

export default function ProductCard({ item }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Get all images from media array, fallback to single image
  const allImages = item?.media && item.media.length > 0
    ? item.media.map(m => m?.path).filter(Boolean)
    : [item?.image || item?.image_path];

  const colorAttribute = item?.attributes?.find(attribute => attribute?.attribute_name?.toLowerCase() === "color")?.value;

  const handlePrevImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <Link
      href={item?.url ? "/pdp/" + item.url : "#"}
      className="block group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden mb-4" style={{ background: '#f5f5f5', aspectRatio: '1 / 1' }}>
        {allImages.map((imagePath, index) => (
          <img
            key={index}
            className="w-full h-full object-cover transition-all duration-700 ease-out"
            style={{
              opacity: index === currentImageIndex ? 1 : 0,
              position: index === currentImageIndex ? 'relative' : 'absolute',
              inset: 0,
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            }}
            src={imagePath}
            alt={`${item?.name ?? "Product"} - Image ${index + 1}`}
          />
        ))}

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.12)', opacity: isHovered ? 1 : 0, transition: 'opacity 0.4s' }}
        >
          <span
            style={{
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontSize: '0.6rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#fff',
              border: '1px solid #fff',
              padding: '10px 20px',
              transform: isHovered ? 'translateY(0)' : 'translateY(8px)',
              transition: 'transform 0.4s',
            }}
          >
            View
          </span>
        </div>

        {allImages.length > 1 && (
          <>
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              style={{ background: 'rgba(255,255,255,0.9)' }}
              onClick={handlePrevImage}
              aria-label="Previous image"
            >
              <FontAwesomeIcon icon={faAngleLeft} style={{ color: '#0a0a0a' }} className="w-3.5 h-3.5" />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              style={{ background: 'rgba(255,255,255,0.9)' }}
              onClick={handleNextImage}
              aria-label="Next image"
            >
              <FontAwesomeIcon icon={faAngleRight} style={{ color: '#0a0a0a' }} className="w-3.5 h-3.5" />
            </button>
          </>
        )}
      </div>

      <div className="px-1">
        {item?.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {item.tags.map((tag, index) => (
              <span
                key={index}
                style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D1A261', border: '1px solid rgba(209,162,97,0.5)', padding: '3px 8px' }}
              >
                {tag?.name}
              </span>
            ))}
          </div>
        )}

        <h3 className="line-clamp-1" style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: '1.15rem', lineHeight: 1.3, color: '#1a1410' }}>
          {item?.name}
        </h3>

        {item?.price != null && item?.price !== "" && (
          <p className="mt-1.5" style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 400, fontSize: '0.8rem', letterSpacing: '0.05em', color: '#9a9590' }}>
            {item.currency_symbol}{parseFloat(item.price).toFixed(2)}
          </p>
        )}

        {(colorAttribute || item.variants?.length > 0) && (
          <div className="flex items-center gap-3 mt-1.5" style={{ fontFamily: 'var(--font-raleway), sans-serif', fontSize: '0.75rem', color: '#9a9590' }}>
            {colorAttribute && <span>{colorAttribute}</span>}
            {item.variants?.length > 0 && <span>+ {item.variants.length} models</span>}
          </div>
        )}
      </div>
    </Link>
  );
}
