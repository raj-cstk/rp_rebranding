"use client";
import { useState, useEffect, useCallback } from "react";
import { ContentstackClient } from "@/lib/contentstack-client"
import Footer from "@/components/footer";
import Header from "@/components/header";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { LyticsTracking, useEntity, useJstag } from "@/context/lyticsTracking";
import { Dialog, DialogPanel, DialogBackdrop } from "@headlessui/react";
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
import RecommendationsBanner from "@/components/recommendationsBanner";
import { useParams } from "next/navigation";
import Link from "next/link";
import RPCommerce from "@/lib/rpcommerce";
import { pdpReferences } from "@/helpers/referencePaths";
import { useDataContext } from "@/context/data.context";


export default function Page({  }) {
  const [entry, setEntry] = useState({});
  const [product, setProduct] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const params = useParams();
  const router = useRouter();
  const [variants, setVariants] = useState([]);
  const [variantsOpen, setVariantsOpen] = useState(false);
  const [variantImageIndices, setVariantImageIndices] = useState({});
  const [translations, setTranslations] = useState({});

  const initialData = useDataContext();

  const handleGoBack = () => {
    router.back();
  };

  const getProductsbyURL = useCallback(async (id) => {
      const products = await RPCommerce.getProductByUrl(id, params.locale);
      if(products && products.length > 0) {
          setVariants(products?.[0]?.variants);
          setProduct(products?.[0]);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
    }, [params.locale]);

  const getContent = useCallback(async () => {
    if (params.id === "untitled" || !params.id) return;
    setIsLoading(true);
      const query = await ContentstackClient.getElementByUrlWithRefs(
        "pdp",
        "/pdp/" + params.id,
        params.locale,
        pdpReferences,
        initialData
      );
      if (query && query.length > 0){
        console.log(query)
        setProduct(query?.[0]?.product?.items?.[0])
        setEntry(query?.[0]);
        setVariants(query?.[0]?.variants?.items);
        setIsLoading(false);
    } else {
      console.log("can't find contentstack entry, fetching product by url")
      await getProductsbyURL(params.id);
    }
  }, [params.id, params.locale, initialData, getProductsbyURL]);

  const getTranslations = useCallback(async () => {
    try {
      // Clear translations when locale changes
      setTranslations({});
      // Pass null for initialData to always fetch fresh translations for the current locale
      const translationsEntry = await ContentstackClient.getElement(
        "bltd9ee50006d3067ad",
        "translations",
        params.locale,
        null
      );
      if (translationsEntry && translationsEntry.key_values) {
        const translationsMap = {};
        translationsEntry.key_values.forEach((item) => {
          translationsMap[item.key] = item.value;
        });
        setTranslations(translationsMap);
      } else {
        console.warn(`No translations found for locale: ${params.locale}`);
      }
    } catch (error) {
      console.error("Error fetching translations:", error);
    }
  }, [params.locale]);

  const getTranslation = (key, fallback) => {
    return translations[key] || fallback;
  };

  useEffect(() => {
    getTranslations();
    ContentstackClient.onEntryChange(getContent);
  }, [getTranslations, getContent]);

  
  if (isLoading || (!entry && !product)) {
    return (
      <div className="relative">
        <Header locale={params.locale} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600"></div>
            <p className="mt-4 text-gray-600">Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <Header locale={params.locale} />
      <div className="max-w-8xl mx-auto px-8 pt-10 flex flex-col font-paragraph mb-12">
        <div className="w-full md:flex gap-16">
          <div className="md:w-1/2">
            <button
              onClick={() => handleGoBack()}
              className="flex mb-4 items-center text-cyan-600 hover:text-[#D1A261]"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              <p className="inline-block">{getTranslation("back_button", "Back to previous products")}</p>
            </button>
            <div className="mt-4 flex gap-4">
              
              {/* Thumbnails column */}
              <div className="flex flex-col gap-3">
                {((entry?.images?.length === 0 || !entry?.images) ||
                  (product?.media && product?.media?.length > 0)) && (
                  <div className="flex flex-col gap-3">
                    {product.media?.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        className={
                          "border p-1 cursor-pointer bg-white my-[6px] " +
                          (imageIndex === index ? "border-black" : "border-gray-300")
                        }
                        onClick={() => setImageIndex(index)}
                      >
                        <img
                          className="h-[68px] w-[68px] object-cover"
                          src={image?.path}
                          alt={product?.name || `Product image ${index + 1}`}
                        />
                      </button>
                    ))}
                  </div>
                )}
                {entry?.images?.length > 0 && (
                  <div className="flex flex-col gap-3">
                    {entry?.images?.map((image, index) => (
                      <button
                        key={index}
                        type="button"
                        className={
                          "border p-1 cursor-pointer bg-white my-[6px] " +
                          (imageIndex === index ? "border-black" : "border-gray-300")
                        }
                        onClick={() => setImageIndex(index)}
                      >
                        <img
                          className="h-[68px] w-[68px] object-cover"
                          src={image.image?.url}
                          alt={entry?.product_name || `Product image ${index + 1}`}
                          {...image?.$?.image}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Main image */}
              <div className="flex-1">
                {(product?.media && product?.media?.length > 0) && (
                  <img
                    className="object-cover mx-auto h-[500px] w-full"
                    src={product?.media[imageIndex].path}
                    alt={product?.name || "Product image"}
                  />
                )}
                {(!product?.media || !product.media?.[0]?.media?.[0]) && entry?.images?.[imageIndex]?.image?.url && (
                  <img
                    className="object-cover mx-auto h-[500px] w-full"
                    src={entry.images[imageIndex].image.url}
                    alt={entry?.product_name || "Product image"}
                    {...entry.images[imageIndex].$?.image}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="xl:w-1/2 lg:w-4/6 md:w-3/4 mt-10">
            <div className="text-[32px] leading-none mt-8" {...entry?.$?.product_name}>
              {entry?.product_name ? entry?.product_name : product?.name}
            </div>
            {(product?.sku || entry?.sku) && (
              <div className="text-[20px] mt-4">
                {entry?.sku ? entry?.sku : product?.sku}
              </div>
            )}
            {(product?.price || entry?.price) && (
              <div className="text-[32px] mt-4">
                
                {entry?.currency_symbol ? entry?.currency_symbol : product?.currency_symbol}{entry?.price ? entry?.price : product?.price}
              </div>
            )}
            <div id="wrapper" className="relative w-3/4 mt-4">
              {variants && variants.length > 0 && (
                <button
                  className="flex items-center gap-3 min-h-[75px] px-4 mt-4 md:w-full lg:w-3/4 xl:w-4/6 relative rounded-[60px] button tracking-widest uppercase bg-white font-bold text-cyan-600 shadow-sm ring-2 ring-inset ring-cyan-600 hover:bg-cyan-600 hover:text-white"
                  onClick={() => setVariantsOpen(true)}
                >
                  <img className="w-[70px] h-[70px] rounded-[50%] flex-shrink-0" src={variants?.[0]?.media?.[0]?.path} alt={variants?.[0]?.name || "Product variant"}></img>
                  <div className="flex-1 text-center whitespace-normal break-words">{getTranslation("variations_button", "SEE ALL VARIATIONS")}</div>
                </button>
              )}
              <button
                className="mt-4 rounded-[60px] md:w-full lg:w-3/4 xl:w-4/6 text-nowrap relative button px-8 py-4 text-md tracking-widest uppercase bg-white font-bold text-cyan-600 shadow-sm ring-2 ring-inset ring-cyan-600 hover:bg-cyan-600 hover:text-white"
                onClick={() => setPurchaseOpen(true)}
              >
               {getTranslation("cart_button", "Add to Cart")}
              </button>
            </div>

            
          </div>
        </div>
        <div className="text-[32px] leading-none normal-case mt-8">
          {getTranslation("description_label", "Description")}
        </div>
        <div
          className="mt-4 font-extralight whitespace-pre-line [&_p]:mt-3 [&_ul]:list-disc  [&_ul]:pl-10 text-sm tracking-wide"
          dangerouslySetInnerHTML={{
            __html: entry?.description
              ? entry?.description
              : product?.description,
          }}
          {...entry?.$?.description}
        ></div>
      </div>

      <div
        className={
          entry?.modular_blocks?.length === 0
            ? "visual-builder__empty-block-parent"
            : ""
        }
        {...entry?.$?.modular_blocks}
      >
        {entry?.modular_blocks?.map((block, index) => (
          <div key={index} {...entry?.$?.["modular_blocks__" + index]}>
            {block.hasOwnProperty("hero") && (
              <PageHero
                key={index}
                content={block.hero}
                {...entry?.$?.["modular_blocks__" + index]}
              />
            )}
            {block.hasOwnProperty("people") && (
              <People
                key={index}
                content={block.people}
                isKiosk={
                  entry?._applied_variants?.title === "cs76fdee0e83c5c333"
                }
              />
            )}
            {block.hasOwnProperty("text_block") && (
              <TextSection key={index} content={block.text_block} />
            )}
            {block.hasOwnProperty("cards") &&
              <Cards key={index} content={block.cards} />
            }
            {block.hasOwnProperty("review") &&
              <Reviews key={index} content={block.review} />
            }
            {block.hasOwnProperty("product_banner") &&
              <ProductFeature key={index} content={block.product_banner} />
            }
            {block.hasOwnProperty("category_banner") &&
              <CategoryBanner key={index} content={block.category_banner} />
            }
            {block.hasOwnProperty("lead_capture") &&
              <LeadCapture key={index} content={block.lead_capture} />
            }
            {block.hasOwnProperty("agent") &&
              <Agent key={index} agentData={block.agent} />
            }
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
                  entry?._applied_variants?.title === "cs76fdee0e83c5c333"
                }
                {...block.$?.image_grid}
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
          </div>
        ))}
      </div>

      {/* Variants Slideout */}
      {variantsOpen && (
        <div
          className="fixed top-0 h-full bg-black opacity-50 w-full z-40 transition-opacity duration-300"
          onClick={() => setVariantsOpen(false)}
        ></div>
      )}
      <div
        className={`fixed w-[450px] z-50 h-full top-0 right-0 border-l bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          variantsOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b">
            <div className="text-lg">All Variations</div>
            <XMarkIcon
              className="size-6 cursor-pointer"
              onClick={() => setVariantsOpen(false)}
            />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 gap-4">
              {variants && variants?.length > 0 && (
                variants.map((variant, index) => {
                  const variantImages = variant.media || [];
                  const currentImageIndex = variantImageIndices[index] || 0;
                  const hasMultipleImages = variantImages.length > 1;

                  const handlePreviousImage = (e) => {
                    e.stopPropagation();
                    setVariantImageIndices(prev => ({
                      ...prev,
                      [index]: currentImageIndex > 0 ? currentImageIndex - 1 : variantImages.length - 1
                    }));
                  };
                  const handleNextImage = (e) => {
                    e.stopPropagation();
                    setVariantImageIndices(prev => ({
                      ...prev,
                      [index]: currentImageIndex < variantImages.length - 1 ? currentImageIndex + 1 : 0
                    }));
                  };

                  return (
                    <div key={index}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                      {variantImages.length > 0 && (
                        <div className="relative mb-3">
                          <img
                            className="w-full h-48 object-cover rounded-md"
                            src={variantImages[currentImageIndex]?.path}
                            alt={variant?.name || "Variant"}
                          />
                          {hasMultipleImages && (
                            <>
                              <button
                                type="button"
                                onClick={handlePreviousImage}
                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                                aria-label="Previous image"
                              >
                                <ArrowLeftIcon className="h-5 w-5" />
                              </button>
                              <button
                                type="button"
                                onClick={handleNextImage}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
                                aria-label="Next image"
                              >
                                <ArrowRightIcon className="h-5 w-5" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                      <Link href={variant?.url ? variant?.url : "#"}>
                      <div className="text-lg font-semibold mb-2">
                        {variant.name}
                      </div>
                      {variant?.price && (
                        <p className="text-xl font-bold text-cyan-600">
                          {variant.price}
                        </p>
                      )}
                      {product?.price && (
                        <p className="text-xl font-bold text-cyan-600">
                          {product?.currency_symbol}{product?.price}
                        </p>
                      )}
                      {variant?.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2" dangerouslySetInnerHTML={{
                          __html: variant?.description,
                        }}>
                        </p>
                      )}
                      </Link>
                    </div>
                  );
              }))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
