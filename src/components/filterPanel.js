"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

const sectionHeaderStyle = { fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1a1410' };
const optionLabelStyle = { fontFamily: 'var(--font-raleway), sans-serif', fontSize: '0.85rem', color: '#4a4540' };
const countStyle = { fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.7rem', color: '#9a9590' };
const sectionDivider = { borderBottom: '1px solid rgba(0,0,0,0.08)' };

export default function FilterPanel({
  isOpen,
  onClose,
  sortBy,
  setSortBy,
  selectedFilters,
  onFilterChange,
  onResetAll,
  categoryFilters
}) {
  const [expandedSections, setExpandedSections] = useState({
    sort: true // Start with Sort By section open by default
  });

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const SectionToggle = ({ id, label }) => (
    <button
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between text-left mb-4"
    >
      <span style={sectionHeaderStyle}>{label}</span>
      <FontAwesomeIcon
        icon={expandedSections[id] ? faChevronUp : faChevronDown}
        style={{ color: '#D1A261' }}
        className="w-3 h-3"
      />
    </button>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.4)' }}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed right-0 top-0 h-full w-full md:w-[460px] z-50 shadow-2xl flex flex-col"
            style={{ background: '#fff', borderLeft: '1px solid rgba(0,0,0,0.1)' }}
          >
            <div className="flex justify-between items-center px-8 py-6" style={sectionDivider}>
              <span style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: '1.6rem', color: '#1a1410' }}>
                Filters &amp; Sorting
              </span>
              <button
                onClick={onClose}
                style={{ color: 'rgba(0,0,0,0.35)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#000'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.35)'}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-6">

              <div className="mb-2 pb-6" style={sectionDivider}>
                <SectionToggle id="sort" label="Sort By" />

                {expandedSections['sort'] && (
                  <div className="space-y-3">
                    {[
                      { value: "top_sellers", label: "Top Sellers" },
                      { value: "newest", label: "Newest" },
                      { value: "price_low_high", label: "Price low to high" },
                      { value: "price_high_low", label: "Price high to low" }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="w-3.5 h-3.5 accent-[#D1A261]"
                          style={{ accentColor: '#D1A261' }}
                        />
                        <span className="ml-3 group-hover:text-[#1a1410] transition-colors" style={optionLabelStyle}>
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {categoryFilters?.filters && (
                <div className="mb-8">
                  {categoryFilters.filters.attributes?.map((attribute) => (
                    <div key={attribute.id} className="mb-2 pb-6" style={sectionDivider}>
                      <SectionToggle id={`attr_${attribute.id}`} label={attribute.name} />

                      {expandedSections[`attr_${attribute.id}`] && (
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {attribute.values?.map((value) => (
                            <label key={value.id} className="flex items-center cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedFilters.includes(`attr_${value.id}`)}
                                onChange={(e) =>
                                  onFilterChange(`attr_${value.id}`, e.target.checked)
                                }
                                className="w-4 h-4 accent-[#D1A261]"
                                style={{ accentColor: '#D1A261' }}
                              />
                              <span className="ml-3 group-hover:text-[#1a1410] transition-colors flex items-center gap-2" style={optionLabelStyle}>
                                {attribute.name === 'Color' && value.custom_info && (
                                  <span
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: value.custom_info, border: '1px solid rgba(0,0,0,0.15)' }}
                                  />
                                )}
                                {value.value}
                                <span style={countStyle}>({value.usage_count})</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {categoryFilters.filters.tags?.map((tagCategory) => (
                    tagCategory.tags?.length > 0 && (
                      <div key={tagCategory.id} className="mb-2 pb-6" style={sectionDivider}>
                        <SectionToggle id={`tags_${tagCategory.id}`} label="Tags" />

                        {expandedSections[`tags_${tagCategory.id}`] && (
                          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                            {tagCategory.tags.map((tag) => (
                              <label key={tag.id} className="flex items-center cursor-pointer group">
                                <input
                                  type="checkbox"
                                  checked={selectedFilters.includes(`tag_${tag.id}`)}
                                  onChange={(e) =>
                                    onFilterChange(`tag_${tag.id}`, e.target.checked)
                                  }
                                  className="w-4 h-4 accent-[#D1A261]"
                                  style={{ accentColor: '#D1A261' }}
                                />
                                <span className="ml-3 group-hover:text-[#1a1410] transition-colors" style={optionLabelStyle}>
                                  {tag.name}
                                  <span className="ml-1" style={countStyle}>({tag.product_count})</span>
                                </span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  ))}

                  {categoryFilters.filters.brands?.length > 0 && (
                    <div className="mb-2 pb-6" style={sectionDivider}>
                      <SectionToggle id="brands" label="Brands" />

                      {expandedSections['brands'] && (
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {categoryFilters.filters.brands.map((brand, index) => (
                            <label key={index} className="flex items-center cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedFilters.includes(`brand_${brand.name}`)}
                                onChange={(e) =>
                                  onFilterChange(`brand_${brand.name}`, e.target.checked)
                                }
                                className="w-4 h-4 accent-[#D1A261]"
                                style={{ accentColor: '#D1A261' }}
                              />
                              <span className="ml-3 group-hover:text-[#1a1410] transition-colors" style={optionLabelStyle}>
                                {brand.name}
                                <span className="ml-1" style={countStyle}>({brand.product_count})</span>
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-6 space-y-3" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
              <button
                onClick={onClose}
                className="w-full transition-opacity"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 600,
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#000',
                  background: '#D1A261',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '14px 24px',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Show Products
              </button>
              <button
                onClick={onResetAll}
                className="w-full transition-all duration-300"
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 600,
                  fontSize: '0.68rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#D1A261',
                  background: 'transparent',
                  border: '1px solid #D1A261',
                  borderRadius: '9999px',
                  padding: '14px 24px',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#D1A261'; e.currentTarget.style.color = '#000'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#D1A261'; }}
              >
                Reset All
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
