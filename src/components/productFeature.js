import { ArrowRightIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

export default function ProductFeature({ content }) {
  if (content?.products && Array.isArray(content?.products) && content?.products?.length > 0) {
    content.products = content?.products?.[0];
  }

  return (
    <section className="w-full py-28" style={{ background: content?.background?.hex || '#f5f1e3' }}>
      <div className="max-w-7xl mx-auto px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 pb-8 border-b border-neutral-100">
          <div>
            <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 500, marginBottom: '1.2rem' }}>
              The Collection
            </p>
            <h2 style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2.5rem, 4.5vw, 3.8rem)', lineHeight: 1.1, color: '#0a0a0a', whiteSpace: 'nowrap' }} {...content?.$?.title}>
              {content?.title}
            </h2>
          </div>
          <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.9, color: '#6b6560', maxWidth: '340px' }} {...content?.$?.description}>
            {content?.description}
          </p>
        </div>

        {/* Empty state */}
        {content?.products?.data?.length === 0 && (
          <div className="h-[800px] visual-builder__empty-block-parent" {...content?.$?.products} />
        )}

        {/* Product grid */}
        {content?.products?.items?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12" {...content?.$?.products}>
            {content.products.items.map((item, index) => (
              <Link href={'/pdp/' + (item?.url || '#')} key={index} className="group block">
                <div className="relative overflow-hidden" style={{ height: content?.large_cards ? '600px' : '340px', backgroundColor: '#f5f5f5' }}>
                  <img
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    src={item?.image}
                    alt={item?.name}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-500 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 text-white border border-white px-5 py-2.5"
                      style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                      View
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="line-clamp-2" style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 400, fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.45, color: '#1a1410' }}>
                    {item?.name}
                  </p>
                  {item?.price && (
                    <p className="mt-1.5" style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 400, fontSize: '0.75rem', letterSpacing: '0.08em', color: '#9a9590' }}>
                      {item.currency_symbol}{parseFloat(item.price).toFixed(2)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA */}
        {content?.plp && (
          <div className="mt-16 pt-12 border-t border-neutral-100">
            <Link href={(content?.plp?.length > 0 && content?.plp?.[0]?.url) ? content?.plp?.[0]?.url : '#'}
              className="group inline-flex items-center gap-3 transition-colors duration-200"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#D1A261' }}
              {...content?.$?.plp}>
              <span {...content?.$?.plp_link_text}>{content?.plp_link_text || 'View All'}</span>
              <ArrowRightIcon className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
