import Image from 'next/image';
import Link from 'next/link';
import parse from "html-react-parser";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

export default function CategoryBanner({ content }) {
  const category = {
    name: content.title || content.categories?.items?.[0]?.name,
    description: content.description || content.categories?.items?.[0]?.description,
    image: content.image?.url || content.categories?.items?.[0]?.image?.url,
    video: content.video?.url || content.categories?.items?.[0]?.video?.url,
    children: content.categories?.items?.[0]?.children
  }

  if (!category || !category.name) return null;

  return (
    <div className="flex flex-col md:flex-row w-full mx-auto md:gap-15 gap-8 items-start bg-white mb-8 md:h-[400px] overflow-hidden">
      <div className="w-full md:w-[55%] aspect-square relative">
        {category.video ? (
          <video
            src={content.video.url}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover h-full w-full"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            No Media
          </div>
        )}
      </div>

      <div className="w-full md:w-[45%] flex flex-col gap-4 md:mt-6 ml-8 md:ml-0">
        {category.children && category.children.length > 0 && (
          <div className="flex flex-wrap gap-8 uppercase font-medium tracking-widest text-md text-gray-800 mb-6">
            {category.children.map((item, index) => (
              <Link
                key={item.id}
                href={item.url ? `/plp${item.url}` : '#'}
                className={`hover:underline hover:text-cyan-600 text-gray-800 ${index === 0 ? 'underline' : ''}`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        <h1 className="font-medium! text-4xl! text-black !font-sans !tracking-[0.05em]" {...content?.$?.title}>
          {category.name}
        </h1>

        <div className="text-md plp-description leading-relaxed" {...content?.$?.description}>
          {category.description ? parse(category.description) : ''}
        </div>

        {content.plp && content.plp.length > 0 && content.plp[0].url && (
          <Link
            href={content.plp[0].url}
            className="inline-flex items-center mt-4 px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium text-sm uppercase tracking-wider w-fit"
            {...content?.$?.plp}
          >
            <span {...content?.$?.plp_link_text}>{content.plp_link_text || 'Learn More'}</span>
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Link>
        )}
      </div>
    </div>
  );
}