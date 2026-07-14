'use client';
import Link from 'next/link';
import parse from "html-react-parser";
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import RPCommerce from '@/lib/rpcommerce';

export default function CategoryBanner({ content, locale }) {
  if(content?.categories && Array.isArray(content?.categories) && content?.categories?.length > 0) {
    content.categories = content?.categories?.[0];
  }
  
  const [category, setCategory] = useState(null);
  
  useEffect(() => {
    const getCategory = async () => {
      const category = await RPCommerce.getCategoryByURL((content?.categories?.items?.[0]?.url) ? (content?.categories?.items?.[0]?.url) : ('/' + (content?.title?.toLowerCase?.() ?? '')), locale, true, 2) || content?.categories?.items?.[0];
      const categoryData = {
        ...(category || {}),
        name: content.title || category?.name,
        description: (content.description && content.description != "<p></p>" && content.description != "") ? content.description : category?.description,
        image: content.image?.url || category?.image,
        video: content.video?.url || null,
        $: content?.$,
        plp: content.plp,
        plp_link_text: content.plp_link_text,
      };
      return categoryData;
    }
    
    
    getCategory().then(setCategory);
  }, [content, locale]);
  
  if (!content || !category || !category.name) return null;

  return (
    <section className="w-full bg-white">
      <div className="flex flex-col md:flex-row w-full">

        {/* Media */}
        <div
          className="relative overflow-hidden w-full md:w-1/2"
          style={{ minHeight: 'clamp(360px, 55vh, 620px)' }}
          {...(category.video ? category?.$?.video : category?.$?.image)}
        >
          {category.video ? (
            <video
              src={category.video}
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : category.image ? (
            <motion.div
              className="absolute inset-0"
              style={{ backgroundImage: `url(${category.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              initial={{ scale: 1.08 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-neutral-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
          )}
        </div>

        {/* Text */}
        <div className="w-full md:w-1/2 flex items-center bg-white">
          <motion.div
            className="px-8 md:px-12 py-14 md:py-24 w-full"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.6rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 500, display: 'block', marginBottom: '1.5rem' }}>
              Featured Category
            </span>

            {category.children && category.children.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6" {...category?.$?.categories}>
                {category.children.map((item, index) => (
                  <Link
                    key={item.id}
                    href={item.url ? `/plp${item.url}` : '#'}
                    className="whitespace-nowrap transition-all duration-300 hover:border-[#D1A261]"
                    style={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontSize: '0.6rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      border: '1px solid rgba(209,162,97,0.5)',
                      color: index === 0 ? '#0a0a0a' : '#9a9590',
                      background: index === 0 ? '#D1A261' : 'transparent',
                      borderColor: index === 0 ? '#D1A261' : 'rgba(209,162,97,0.5)',
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}

            <h2 style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', lineHeight: 1.15, color: '#1a1410', textTransform: 'none' }} {...category?.$?.title}>
              {category.name}
            </h2>

            <div style={{ width: '40px', height: '1px', background: '#D1A261', margin: '1.5rem 0' }} />

            <div
              className="line-clamp-5"
              style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '1rem', lineHeight: 1.9, color: '#6b6560' }}
              {...content?.$?.description}
            >
              {category.description && typeof category.description === 'string' ? parse(category.description) : ''}
            </div>

            {category?.plp?.length > 0 && category?.plp?.[0]?.url && (
              <Link
                href={category?.plp?.[0]?.url}
                className="group inline-flex items-center gap-3 mt-10 px-7 py-3.5 transition-all duration-300 w-fit"
                style={{ border: '1px solid #D1A261', color: '#D1A261', fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.68rem', letterSpacing: '0.2em', textTransform: 'uppercase', borderRadius: '9999px' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#D1A261'; e.currentTarget.style.color = '#000'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#D1A261'; }}
                {...content?.$?.plp}
              >
                <span {...content?.$?.plp_link_text}>{content?.plp_link_text || 'Explore Category'}</span>
                <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}