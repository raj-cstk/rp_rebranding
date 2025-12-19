"use client";
import { useState, useEffect } from "react";
import { ContentstackClient } from "@/lib/contentstack-client"
import Footer from "@/components/footer";
import Header from "@/components/header";
import PageHero from "@/components/pageHero";
import TextSection from "@/components/textSection";
import People from "@/components/people";
import Hero from "@/components/hero";
import ArticleBanner from "@/components/articleBanner";
import ImageGrid from "@/components/imageGrid";
import Tabs from "@/components/tabs";
import Marquee from "@/components/marquee";
import FormBuilder from "@/components/formBuilder";
import Cards from "@/components/cards";
import Reviews from "@/components/reviews";
import CategoryBanner from "@/components/categoryBanner";
import Agent from "@/components/agent";
import LeadCapture from "@/components/leadCapture";
import ProductFeature from "@/components/productFeature";
import ResortPackage from "@/components/resortPackage";
import { AnimatePresence, motion } from "framer-motion";
import { useJstag } from "@/context/lyticsTracking";
import RecommendationsBanner from "@/components/recommendationsBanner";
import { useParams } from "next/navigation";
import RPCommerce from "@/lib/rpcommerce";
import CategoryHero from "@/components/categoryHero";
import ProductCard from "@/components/productCard";
import FilterPanel from "@/components/filterPanel";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilterList } from '@awesome.me/kit-610837e1f9/icons/classic/solid';
import { jsonToHTML } from '@contentstack/utils';

export default function PLP() {
  const [entry, setEntry] = useState({});
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [filter, setFilter] = useState([]);
  const [sortBy, setSortBy] = useState("top_sellers");
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [categoryFilters, setCategoryFilters] = useState(null);
  const jstag = useJstag();
  const params = useParams();


  const getContent = async () => {
    const entry = await ContentstackClient.getElementByUrlWithRefs(
      "plp",
      "/plp/" + params.url,
      params.locale,
      [
        'modular_blocks_top.hero.hero',
        'modular_blocks_top.hero_banner.hero',
        'modular_blocks_top.articles.articles',
        'modular_blocks_top.review.reference',
        'modular_blocks_top.image_grid.image.page',
        'modular_blocks_top.review.testimonials',
        'modular_blocks_top.review.testimonials.reviews.review',
        'modular_blocks_top.product_banner.plp',
        'modular_blocks_top.cards.card.page',
        'modular_blocks_top.text_and_image.page',
        'modular_blocks_top.resort_package.resort_package',
        'modular_blocks_top.resort_package.resort_package.products',
        'modular_blocks_top.category_banner.plp',

        'modular_blocks_bottom.hero.hero',
        'modular_blocks_bottom.hero_banner.hero',
        'modular_blocks_bottom.articles.articles',
        'modular_blocks_bottom.review.reference',
        'modular_blocks_bottom.image_grid.image.page',
        'modular_blocks_bottom.review.testimonials',
        'modular_blocks_bottom.review.testimonials.reviews.review',
        'modular_blocks_bottom.product_banner.plp',
        'modular_blocks_bottom.cards.card.page',
        'modular_blocks_bottom.text_and_image.page',
        'modular_blocks_bottom.resort_package.resort_package',
        'modular_blocks_bottom.resort_package.resort_package.products',
        'modular_blocks_bottom.category_banner.plp'
      ]
    );

    jsonToHTML({
        entry: entry,
        paths: ['modular_blocks_top.category_banner.description', 'modular_blocks_bottom.category_banner.description', 'description']
    })

    setEntry(entry);
    getCategory(entry);
  };

  useEffect(() => {
    const getProducts = async (id) => {
      const products = await RPCommerce.getProductsByCategory(id, params.locale);
      setProducts(products);
    }
  
    const getFilters = async (id) => {
      const filters = await RPCommerce.getCategoryFilters(id, params.locale);
      setCategoryFilters(filters);
    }
  
    if(category?.id) {
      Promise.all([
        getProducts(category.id),
        getFilters(category.id)
      ])
    }
  }, [category, params.locale]);

  const getCategory = async (entry) => {
    const category = await RPCommerce.getCategoryByURL('/' + params.url, params.locale, true, 2) || entry?.[0]?.product_category?.items?.[0];
    const categoryData = {
      ...(category || {}),
      name: entry?.[0]?.headline || category.name,
      description: (entry?.[0]?.description && entry?.[0]?.description != "<p></p>" && entry?.[0]?.description != "") ? entry?.[0]?.description : category.description,
      image: entry?.[0]?.image?.url || category.image,
      video: entry?.[0]?.video?.url || null,
      $: entry?.[0]?.$
    };
    setCategory(categoryData);
  }

  useEffect(() => {
    ContentstackClient.onEntryChange(getContent);
    jstag.send({ lead_score: 25 });
    jstag.call('resetPolling');
    //fetchTaxonomyContent("6_day");
  }, [])

  const handleFilterChange = (item, isOn) => {
    if (isOn) {
      let temp = [...filter];
      temp.push(item);
      setFilter(temp);
    } else {
      const fils = filter.filter((f) => f !== item);
      setFilter(fils);
    }
  };

  const handleResetAll = () => {
    setFilter([]);
    setSortBy("top_sellers");
  };

  const sortProducts = (productsToSort) => {
    const sorted = [...productsToSort];

    switch (sortBy) {
      case "newest":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.created_at || 0);
          const dateB = new Date(b.created_at || 0);
          return dateB - dateA; // Newest first
        });

      case "price_low_high":
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price || 0);
          const priceB = parseFloat(b.price || 0);
          return priceA - priceB; // Low to high
        });

      case "price_high_low":
        return sorted.sort((a, b) => {
          const priceA = parseFloat(a.price || 0);
          const priceB = parseFloat(b.price || 0);
          return priceB - priceA; // High to low
        });

      default:
        return sorted; // top_sellers - keep original order
    }
  };

  const isInFilter = (product) => {
    if (filter.length === 0) return true;
    if (!product) return false;

    // Separate filters by type
    const attributeFilters = filter.filter(f => f.startsWith('attr_')).map(f => parseInt(f.replace('attr_', '')));
    const tagFilters = filter.filter(f => f.startsWith('tag_')).map(f => parseInt(f.replace('tag_', '')));
    const brandFilters = filter.filter(f => f.startsWith('brand_')).map(f => f.replace('brand_', ''));

    // Group attribute filters by attribute_id (e.g., Color=112, Size=113)
    // We need to get the attribute_id for each value_id from categoryFilters
    if (attributeFilters.length > 0 && categoryFilters?.filters?.attributes) {
      const attributeGroups = {};

      // Build groups: {attribute_id: [value_ids]}
      categoryFilters.filters.attributes.forEach(attr => {
        const selectedValueIds = attr.values
          .filter(v => attributeFilters.includes(v.id))
          .map(v => v.id);

        if (selectedValueIds.length > 0) {
          attributeGroups[attr.id] = selectedValueIds;
        }
      });

      // For each attribute group (Color, Size, etc.), check OR within group, AND between groups
      const productAttributeValueIds = product.attributes?.map(attr => attr.value_id) || [];

      for (const valueIds of Object.values(attributeGroups)) {
        // OR: Product must have at least one of the selected values for this attribute
        const hasMatchInGroup = valueIds.some(valueId =>
          productAttributeValueIds.includes(valueId)
        );

        // AND: If this attribute group has selections, product must match at least one
        if (!hasMatchInGroup) return false;
      }
    }

    // Check tags (OR within tags)
    if (tagFilters.length > 0) {
      const productTagIds = product.tags?.map(tag => tag.id) || [];
      const hasMatchingTag = tagFilters.some(filterId =>
        productTagIds.includes(filterId)
      );
      if (!hasMatchingTag) return false;
    }

    // Check brands (OR within brands)
    if (brandFilters.length > 0) {
      const productBrand = product.brand?.name || product.brand_name || product.brand;
      const hasMatchingBrand = brandFilters.some(brandName =>
        productBrand && (productBrand === brandName || productBrand.toLowerCase() === brandName.toLowerCase())
      );
      if (!hasMatchingBrand) return false;
    }

    return true;
  };

  return (
    <div className="relative overflow-hidden">
      <Header locale={params.locale} />
      <div className="flex min-h-screen">
        <div
          className={`pb-24 grow bg-white text-black`}
        >
          <AnimatePresence mode="wait">
            <div
              className={
                entry?.[0]?.modular_blocks_top?.length === 0
                  ? "visual-builder__empty-block-parent"
                  : ""
              }
              {...entry?.[0]?.$?.modular_blocks_top}
            >
              {entry?.[0]?.modular_blocks_top?.map((block, index) => {
                const metadata = entry?.[0]?.$?.[`modular_blocks_top__${index}`];
                const uniqueKey = `${Object.keys(block)[0]}_${index}_${block.wasReplaced ? "replaced" : "original"
                  }`;

                const blockContent = (
                  <>
                    {block.hasOwnProperty("resort_package") && (
                      <motion.div
                        key={`resort_package_${block.resort_package.resort_package[0]?.products?.map(p => p.uid).join("_")}`}
                      // initial={{ opacity: 0, y: 20 }}
                      // animate={{ opacity: 1, y: 0 }}
                      // exit={{ opacity: 0, y: -20 }}
                      // transition={{ duration: 0.5 }}
                      >
                        <ResortPackage
                          content={block.resort_package.resort_package[0]}
                          params={params}
                          {...metadata}
                        />
                      </motion.div>
                    )}
                    {block.hasOwnProperty("hero") && (
                      <PageHero
                        key={index}
                        content={block.hero}
                        {...metadata}
                      />
                    )}
                    {block.hasOwnProperty("people") && (
                      <People
                        key={index}
                        content={block.people}
                        isKiosk={
                          entry?.[0]?._applied_variants?.title ===
                          "cs76fdee0e83c5c333"
                        }
                      />
                    )}
                    {block.hasOwnProperty("text_block") && (
                      <TextSection key={index} content={block.text_block} />
                    )}
                    {block.hasOwnProperty("cards") && (
                      <Cards key={index} content={block.cards} />
                    )}
                    {block.hasOwnProperty("review") && (
                      <Reviews key={index} content={block.review} />
                    )}
                    {block.hasOwnProperty("product_banner") && (
                      <ProductFeature
                        key={index}
                        content={block.product_banner}
                      />
                    )}
                    {block.hasOwnProperty("category_banner") && (
                      <CategoryBanner
                        key={index}
                        content={block.category_banner}
                        locale={params.locale}
                      />
                    )}
                    {block.hasOwnProperty("lead_capture") && (
                      <LeadCapture key={index} content={block.lead_capture} />
                    )}
                    {block.hasOwnProperty("agent") && (
                      <Agent key={index} agentData={block.agent} />
                    )}
                    {block.hasOwnProperty("hero_banner") && (
                      <Hero
                        key={index}
                        content={block.hero_banner.hero}
                        locale={params.locale}
                        withHeader={false}
                      />
                    )}
                    {block.hasOwnProperty("image_grid") && (
                      <ImageGrid
                        key={index}
                        content={block.image_grid}
                        isKiosk={
                          entry?.[0]?._applied_variants?.title ===
                          "cs76fdee0e83c5c333"
                        }
                        {...block?.$?.image_grid}
                      />
                    )}
                    {block.hasOwnProperty("articles") && (
                      <ArticleBanner key={index} content={block.articles} />
                    )}
                    {block.hasOwnProperty("tabs") && (
                      <Tabs key={index} content={block.tabs} />
                    )}
                    {block.hasOwnProperty("marquee") && (
                      <Marquee key={index} content={block.marquee} />
                    )}
                    {block.hasOwnProperty("form_builder") && (
                      <FormBuilder key={index} content={block.form_builder} />
                    )}
                    {block.hasOwnProperty("recommendations_banner") && (
                      <RecommendationsBanner key={index} content={block.recommendations_banner} />
                    )}
                  </>
                );

                return block.wasReplaced ? (
                  <motion.div
                    key={uniqueKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    {blockContent}
                  </motion.div>
                ) : (
                  <div key={uniqueKey} {...metadata}>
                    {blockContent}
                  </div>
                );
              })}
            </div>
          </AnimatePresence>
          {(!entry || !entry?.[0] || entry?.[0]?.show_category_hero) && (
            <CategoryHero category={category} locale={params.locale} />
          )}
          <FilterPanel
            isOpen={filterPanelOpen}
            onClose={() => setFilterPanelOpen(false)}
            sortBy={sortBy}
            setSortBy={setSortBy}
            selectedFilters={filter}
            onFilterChange={handleFilterChange}
            onResetAll={handleResetAll}
            categoryFilters={categoryFilters}
          />
          {products?.length > 0 && <div className="w-full mx-auto px-12 mt-12 mb-8">
            <div className="text-[0.7rem] font-normal text-black">
              {products.filter((item) => isInFilter(item)).length} RESULTS
            </div>
          </div>}
          <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-2 gap-y-16 pb-16">
            {Array.isArray(products) && sortProducts(products.filter((item) => isInFilter(item)))
              .map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ProductCard item={item} />
                </motion.div>
              ))}
          </div>
        </div>
      </div>

      {!filterPanelOpen && (
        <button
          onClick={() => setFilterPanelOpen(true)}
          className={`fixed ${(process.env.LIVE_PREVIEW_ENABLED) ? "bottom-16" : "bottom-8"} right-8 z-50 bg-white hover:bg-gray-50 text-gray-800 font-medium px-6 py-4 rounded-full shadow-lg border border-gray-400 flex items-center gap-2 transition-all duration-200 hover:shadow-xl ${filterPanelOpen ? "hidden" : ""}`}
        >
          <FontAwesomeIcon icon={faFilterList} />
          <span className="uppercase tracking-wide text-[0.8rem] font-light">Filters and Sorting</span>
        </button>
      )}


      <AnimatePresence mode="wait">
        <div
          className={
            entry?.[0]?.modular_blocks_bottom?.length === 0
              ? "visual-builder__empty-block-parent"
              : ""
          }
          {...entry?.[0]?.$?.modular_blocks_bottom}
        >
          {entry?.[0]?.modular_blocks_bottom?.map((block, index) => {
            const metadata = entry?.[0]?.$?.[`modular_blocks_bottom__${index}`];
            const uniqueKey = `${Object.keys(block)[0]}_${index}_${block.wasReplaced ? "replaced" : "original"
              }`;

            const blockContent = (
              <>
                {block.hasOwnProperty("resort_package") && (
                  <motion.div
                    key={`resort_package_${block.resort_package.resort_package[0]?.products?.map(p => p.uid).join("_")}`}
                  // initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // exit={{ opacity: 0, y: -20 }}
                  // transition={{ duration: 0.5 }}
                  >
                    <ResortPackage
                      content={block.resort_package.resort_package[0]}
                      params={params}
                      {...metadata}
                    />
                  </motion.div>
                )}
                {block.hasOwnProperty("hero") && (
                  <PageHero
                    key={index}
                    content={block.hero}
                    {...metadata}
                  />
                )}
                {block.hasOwnProperty("people") && (
                  <People
                    key={index}
                    content={block.people}
                    isKiosk={
                      entry?.[0]?._applied_variants?.title ===
                      "cs76fdee0e83c5c333"
                    }
                  />
                )}
                {block.hasOwnProperty("text_block") && (
                  <TextSection key={index} content={block.text_block} />
                )}
                {block.hasOwnProperty("cards") && (
                  <Cards key={index} content={block.cards} />
                )}
                {block.hasOwnProperty("review") && (
                  <Reviews key={index} content={block.review} />
                )}
                {block.hasOwnProperty("product_banner") && (
                  <ProductFeature
                    key={index}
                    content={block.product_banner}
                  />
                )}
                {block.hasOwnProperty("category_banner") && (
                  <CategoryBanner
                    key={index}
                    content={block.category_banner}
                    locale={params.locale}
                  />
                )}
                {block.hasOwnProperty("lead_capture") && (
                  <LeadCapture key={index} content={block.lead_capture} />
                )}
                {block.hasOwnProperty("agent") && (
                  <Agent key={index} agentData={block.agent} />
                )}
                {block.hasOwnProperty("hero_banner") && (
                  <Hero
                    key={index}
                    content={block.hero_banner.hero}
                    locale={params.locale}
                    withHeader={false}
                  />
                )}
                {block.hasOwnProperty("image_grid") && (
                  <ImageGrid
                    key={index}
                    content={block.image_grid}
                    isKiosk={
                      entry?.[0]?._applied_variants?.title ===
                      "cs76fdee0e83c5c333"
                    }
                    {...block?.$?.image_grid}
                  />
                )}
                {block.hasOwnProperty("articles") && (
                  <ArticleBanner key={index} content={block.articles} />
                )}
                {block.hasOwnProperty("tabs") && (
                  <Tabs key={index} content={block.tabs} />
                )}
                {block.hasOwnProperty("marquee") && (
                  <Marquee key={index} content={block.marquee} />
                )}
                {block.hasOwnProperty("form_builder") && (
                  <FormBuilder key={index} content={block.form_builder} />
                )}
                {block.hasOwnProperty("recommendations_banner") && (
                  <RecommendationsBanner key={index} content={block.recommendations_banner} />
                )}
              </>
            );

            return block.wasReplaced ? (
              <motion.div
                key={uniqueKey}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
              >
                {blockContent}
              </motion.div>
            ) : (
              <div key={uniqueKey} {...metadata}>
                {blockContent}
              </div>
            );
          })}
        </div>
      </AnimatePresence>

      <Footer />
    </div>
  );
}
