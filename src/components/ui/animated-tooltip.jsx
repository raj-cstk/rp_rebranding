"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function AnimatedTooltip({ items }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="flex flex-row items-center">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="relative group"
          style={{ marginLeft: i === 0 ? 0 : '-22px', zIndex: hoveredIndex === item.id ? 50 : items.length - i }}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 18 } }}
                exit={{ opacity: 0, y: 10, scale: 0.85, transition: { duration: 0.15 } }}
                className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium text-white shadow-xl"
                style={{ background: item.tooltipBg ?? item.color, fontFamily: 'var(--font-montserrat), sans-serif', letterSpacing: '0.08em' }}
              >
                {item.name}
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                  style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: `5px solid ${item.tooltipBg ?? item.color}` }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.2, y: -6, zIndex: 50 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="flex items-center justify-center rounded-full"
            style={{
              width: '88px',
              height: '88px',
              background: '#000',
              border: '3px solid #000',
              color: item.color,
              position: 'relative',
            }}
          >
            <item.icon style={{ width: '42px', height: '42px' }} />
          </motion.a>
        </div>
      ))}
    </div>
  );
}
