import Link from 'next/link';
import parse from "html-react-parser";
import { motion } from "framer-motion";

export default function CategoryHero({ category, locale }) {
  if (!category || !category.name) return null;

  return (
    <div className="flex flex-col md:flex-row w-full bg-white">

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
        <div className="px-8 md:px-12 py-14 md:py-24 w-full">
          <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.6rem', letterSpacing: '0.32em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 500, display: 'block', marginBottom: '1.5rem' }}>
            Shop the Collection
          </span>

          {category.children && category.children.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6" {...category?.$?.product_category}>
              {category.children.map((child) => {
                const isActive = child.url === category.url;
                return (
                  <Link
                    key={child.id}
                    href={child.url ? `/${locale}/plp${child.url}` : '#'}
                    className="whitespace-nowrap transition-all duration-300 hover:border-[#D1A261]"
                    style={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontSize: '0.6rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      border: '1px solid rgba(209,162,97,0.5)',
                      color: isActive ? '#0a0a0a' : '#9a9590',
                      background: isActive ? '#D1A261' : 'transparent',
                      borderColor: isActive ? '#D1A261' : 'rgba(209,162,97,0.5)',
                    }}
                  >
                    {child.name}
                  </Link>
                );
              })}
            </div>
          )}

          <h1 style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2.2rem, 4vw, 3.4rem)', lineHeight: 1.15, color: '#1a1410', textTransform: 'none' }} className="line-clamp-1" {...category?.$?.headline}>
            {category.name}
          </h1>

          <div style={{ width: '40px', height: '1px', background: '#D1A261', margin: '1.5rem 0' }} />

          <div
            className="line-clamp-9"
            style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '1rem', lineHeight: 1.9, color: '#6b6560' }}
            {...category?.$?.description}
          >
            {parse(category.description) || `Explore our exclusive ${category.name} collection.`}
          </div>
        </div>
      </div>
    </div>
  );
}
