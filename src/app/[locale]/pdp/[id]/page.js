"use client";
import { useState, useEffect, useCallback } from "react";
import { ContentstackClient } from "@/lib/contentstack-client"
import Footer from "@/components/footer";
import Header from "@/components/header";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import { LyticsTracking, useEntity, useJstag } from "@/context/lyticsTracking";
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
import { useDataContext, useCommerceFallback } from "@/context/data.context";
import { jsonToHTML } from '@contentstack/utils';

function getAddToCartBlockMessage(product, variant) {
  const item = variant || product;
  if (!item) return null;
  if (item.available === false) return "This product is currently unavailable.";
  if (typeof item.stock_quantity === "number" && item.stock_quantity <= 0) {
    return "This product is out of stock.";
  }
  return null;
}

export default function Page({ }) {
  const params = useParams();
  const initialData = useDataContext();
  const commerceFallback = useCommerceFallback();
  const jstag = useJstag();

  const [entry, setEntry] = useState({});
  const [product, setProduct] = useState(() => commerceFallback?.product ?? {});
  const [isLoading, setIsLoading] = useState(() => {
    const hasStack = Array.isArray(initialData) && initialData.length > 0;
    const hasCommercePrefetch = Boolean(commerceFallback?.product);
    return !(hasStack || hasCommercePrefetch);
  });
  const [imageIndex, setImageIndex] = useState(0);
  const router = useRouter();
  const [variants, setVariants] = useState(
    () => commerceFallback?.variants ?? commerceFallback?.product?.variants ?? []
  );
  const [variantsOpen, setVariantsOpen] = useState(false);
  const [variantImageIndices, setVariantImageIndices] = useState({});
  const [translations, setTranslations] = useState({});
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [addToCartMessage, setAddToCartMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleGoBack = () => router.back();
  const handleChange = (event) => { event.preventDefault(); setInputValue(event.target.value); };

  function buyClick(price) {
    jstag.send({ shopify_total_spend: price, _e: "purchase", email: inputValue });
    jstag.call("resetPolling");
    setInputValue("");
    setPurchaseSuccess(true);
  }

  const getProductsbyURL = useCallback(async (id) => {
    try {
      const products = await RPCommerce.getProductByUrl(id, params.locale);
      if (products && products.length > 0) {
        setVariants(products[0]?.variants);
        setProduct(products[0]);
      }
    } catch (e) {
      console.error("getProductByUrl failed:", e);
    } finally {
      setIsLoading(false);
    }
  }, [params.locale]);

  const getContent = useCallback(async () => {
    if (params.id === "untitled" || !params.id) return;
    const hasStackPrefetch = Array.isArray(initialData) && initialData.length > 0;
    const hasCommercePrefetch = Boolean(commerceFallback?.product);
    if (!hasStackPrefetch && !hasCommercePrefetch) setIsLoading(true);

    const query = await ContentstackClient.getElementByUrlWithRefs(
      "pdp", "/pdp/" + params.id, params.locale, pdpReferences, initialData
    );
    if (query && query.length > 0) {
      const q0 = query[0];
      jsonToHTML({
        entry: q0,
        paths: ['modular_blocks_top.category_banner.description', 'modular_blocks_bottom.category_banner.description']
      });
      if (q0?.product && Array.isArray(q0?.product) && q0?.product?.length > 0) q0.product = q0.product[0];
      if (q0?.variants && Array.isArray(q0?.variants) && q0?.variants?.length > 0) q0.variants = q0.variants[0];
      setProduct(q0?.product?.items?.[0]);
      setAddToCartMessage("");
      setEntry(q0);
      setVariants(q0?.variants?.items);
      setIsLoading(false);
    } else if (commerceFallback?.product) {
      setVariants(commerceFallback.variants ?? commerceFallback.product?.variants ?? []);
      setProduct(commerceFallback.product);
      setEntry({});
      setIsLoading(false);
    } else {
      await getProductsbyURL(params.id);
    }
  }, [params.id, params.locale, initialData, commerceFallback, getProductsbyURL]);

  const getTranslations = useCallback(async () => {
    try {
      setTranslations({});
      const translationsEntries = await ContentstackClient.getElementByType("translations", params.locale, null);
      const translationsEntry = translationsEntries?.find(e => e.title === "PDP Translations");
      if (translationsEntry?.key_values) {
        const map = {};
        translationsEntry.key_values.forEach(item => { map[item.key] = item.value; });
        setTranslations(map);
      }
    } catch (error) {
      console.error("Error fetching translations:", error);
    }
  }, [params.locale]);

  const getTranslation = (key, fallback) => translations[key] || fallback;

  useEffect(() => {
    getTranslations();
    ContentstackClient.onEntryChange(getContent);
  }, [getTranslations, getContent]);

  useEffect(() => {
    if (isLoading || !jstag) return;
    const productName = entry?.product_name || product?.name;
    if (productName) jstag.send({ product_viewed: productName });
    if (product?.categories?.length > 0) {
      product.categories.forEach((c) => jstag.send({ product_viewed_category: c.name }));
    }
  }, [isLoading, entry?.uid, entry?.product_name, product?.categories, product?.name, jstag]);

  if (isLoading || (!entry && !product)) {
    return (
      <div style={{ background: '#fff', minHeight: '100vh' }} className="flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12" style={{ border: '1px solid rgba(209,162,97,0.2)', borderTopColor: '#D1A261' }} />
          <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginTop: '1.5rem' }}>
            Loading
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>

      {/* Cart toast */}
      {addToCartMessage && (
        <div
          role="alert"
          className="fixed inset-x-0 bottom-0 z-[9999] flex min-h-10 items-center justify-center gap-2 px-3 py-3 pr-11 text-center text-xs leading-snug shadow-lg"
          style={{ background: '#fff', borderTop: '1px solid rgba(209,162,97,0.3)', color: 'rgba(0,0,0,0.7)' }}
        >
          <span className="max-w-2xl">{addToCartMessage}</span>
          <button
            type="button"
            onClick={() => setAddToCartMessage("")}
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center"
            style={{ color: 'rgba(0,0,0,0.35)' }}
            aria-label="Dismiss"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      <Header locale={params.locale} />

      {/* Product section */}
      <div className="max-w-7xl mx-auto px-8 pt-8 pb-20">
        <div className="w-full md:flex gap-16">

          {/* Left — images */}
          <div className="md:w-1/2">
            <button
              onClick={handleGoBack}
              className="flex mb-8 items-center gap-2 transition-opacity hover:opacity-70"
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#D1A261' }}
            >
              <ArrowLeftIcon className="h-3.5 w-3.5" />
              {getTranslation("back_button", "Back")}
            </button>

            <div className="flex gap-4">
              {/* Thumbnails */}
              <div className="flex flex-col gap-3">
                {((entry?.images?.length === 0 || !entry?.images) && product?.media?.length > 0) && (
                  product.media.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setImageIndex(index)}
                      style={{ border: `1px solid ${imageIndex === index ? '#D1A261' : 'rgba(0,0,0,0.12)'}`, background: '#f5f5f5', padding: '3px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    >
                      <img className="h-[68px] w-[68px] object-cover" src={image?.path} alt={product?.name || `Product image ${index + 1}`} />
                    </button>
                  ))
                )}
                {entry?.images?.length > 0 && (
                  entry.images.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setImageIndex(index)}
                      style={{ border: `1px solid ${imageIndex === index ? '#D1A261' : 'rgba(0,0,0,0.12)'}`, background: '#f5f5f5', padding: '3px', cursor: 'pointer', transition: 'border-color 0.2s' }}
                    >
                      <img
                        className="h-[68px] w-[68px] object-cover"
                        src={image.image?.url}
                        alt={entry?.product_name || `Product image ${index + 1}`}
                        {...image?.$?.image}
                      />
                    </button>
                  ))
                )}
              </div>

              {/* Main image */}
              <div className="flex-1 overflow-hidden" style={{ background: '#f5f5f5' }}>
                {product?.media?.length > 0 && (!entry?.images || entry?.images?.length === 0) && (
                  <img className="object-cover w-full h-[500px]" src={product?.media?.[imageIndex]?.path} alt={product?.name || "Product image"} />
                )}
                {(!product?.media || !product.media?.[0]?.media?.[0]) && entry?.images?.[imageIndex]?.image?.url && (
                  <img
                    className="object-cover w-full h-[500px]"
                    src={entry?.images?.[imageIndex]?.image?.url}
                    alt={entry?.product_name || "Product image"}
                    {...entry?.images?.[imageIndex]?.$?.image}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right — product info */}
          <div className="xl:w-1/2 lg:w-4/6 md:w-3/4 mt-10 md:mt-0 flex flex-col justify-center">

            <div className="flex items-center gap-4 mb-6">
              <span style={{ width: '28px', height: '1px', background: '#D1A261', display: 'block' }} />
              <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261' }}>
                {entry?.sku || product?.sku || 'Experience'}
              </span>
            </div>

            <h1
              style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#1a1a1a', lineHeight: 1.1, marginBottom: '1.5rem' }}
              {...entry?.$?.product_name}
            >
              {entry?.product_name || product?.name}
            </h1>

            <div style={{ width: '32px', height: '1px', background: '#D1A261', marginBottom: '1.5rem' }} />

            {(product?.price || entry?.price) && (
              <div style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 400, fontSize: '1.9rem', color: '#D1A261', marginBottom: '2rem', letterSpacing: '0.02em' }}>
                {entry?.currency_symbol || product?.currency_symbol}{entry?.price || product?.price}
              </div>
            )}

            <div className="flex flex-col gap-4" style={{ maxWidth: '340px' }}>
              {variants?.length > 0 && (
                <button
                  onClick={() => setVariantsOpen(true)}
                  className="relative flex items-center px-5 py-4 transition-all"
                  style={{ border: '1px solid rgba(209,162,97,0.35)', background: 'transparent', color: '#D1A261', fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '9999px' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(209,162,97,0.07)'; e.currentTarget.style.borderColor = 'rgba(209,162,97,0.7)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(209,162,97,0.35)'; }}
                >
                  <span style={{ flex: 1, textAlign: 'center' }}>{getTranslation("variations_button", "See All Variations")}</span>
                  {variants?.[0]?.media?.[0]?.path && (
                    <img className="w-10 h-10 object-cover flex-shrink-0 rounded-full" style={{ position: 'absolute', right: '12px' }} src={variants[0].media[0].path} alt={variants[0].name || "Variant"} />
                  )}
                </button>
              )}

              <button
                type="button"
                disabled={addingToCart}
                aria-busy={addingToCart}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 transition-opacity disabled:opacity-50"
                style={{ background: '#D1A261', border: 'none', color: '#000', fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', cursor: addingToCart ? 'default' : 'pointer', minHeight: '52px', borderRadius: '9999px' }}
                onMouseEnter={e => { if (!addingToCart) e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                onClick={async () => {
                  if (addingToCart) return;
                  setAddToCartMessage("");
                  const productName = entry?.product_name || product?.name || "";
                  if (typeof jstag?.send === "function") jstag.send({ product_name: productName });
                  const productId = product?.id;
                  if (typeof window !== "undefined" && window.RedPandaCart?.addItem && productId) {
                    const blocked = getAddToCartBlockMessage(product, null);
                    if (blocked) { setAddToCartMessage(blocked); return; }
                    setAddingToCart(true);
                    try {
                      await window.RedPandaCart.addItem(productId, 1, { locale: params.locale });
                      if (typeof window.RedPandaCart.open === "function") window.RedPandaCart.open();
                      return;
                    } catch (err) {
                      console.error("RedPandaCart.addItem failed", err);
                      setAddToCartMessage(err?.message || "Could not add this product to your cart. It may be out of stock.");
                      return;
                    } finally {
                      setAddingToCart(false);
                    }
                  }
                  setPurchaseOpen(true);
                }}
              >
                {addingToCart ? (
                  <>
                    <span className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full" style={{ border: '1.5px solid rgba(0,0,0,0.2)', borderTopColor: '#000' }} aria-hidden />
                    <span>{getTranslation("cart_adding", "Adding…")}</span>
                  </>
                ) : getTranslation("cart_button", "Add to Cart")}
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        {(entry?.description || product?.description) && (
          <div className="mt-20 pt-16" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <div className="flex items-center gap-4 mb-8">
              <span style={{ width: '28px', height: '1px', background: '#D1A261', display: 'block' }} />
              <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', color: '#1a1a1a' }}>
                {getTranslation("description_label", "Description")}
              </h2>
            </div>
            <div
              className="whitespace-pre-line [&_p]:mt-3 [&_ul]:list-disc [&_ul]:pl-10"
              style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.78rem', lineHeight: 1.9, letterSpacing: '0.02em', color: 'rgba(0,0,0,0.55)' }}
              dangerouslySetInnerHTML={{ __html: entry?.description || product?.description }}
              {...entry?.$?.description}
            />
          </div>
        )}
      </div>

      {/* Modular blocks */}
      <div
        className={entry?.modular_blocks?.length === 0 ? "visual-builder__empty-block-parent" : ""}
        {...entry?.$?.modular_blocks}
      >
        {entry?.modular_blocks?.map((block, index) => (
          <div key={index} {...entry?.$?.["modular_blocks__" + index]}>
            {block.hasOwnProperty("hero") && <PageHero key={index} content={block.hero} />}
            {block.hasOwnProperty("people") && <People key={index} content={block.people} isKiosk={entry?._applied_variants?.title === "cs76fdee0e83c5c333"} />}
            {block.hasOwnProperty("text_block") && <TextSection key={index} content={block.text_block} />}
            {block.hasOwnProperty("cards") && <Cards key={index} content={block.cards} />}
            {block.hasOwnProperty("review") && <Reviews key={index} content={block.review} />}
            {block.hasOwnProperty("product_banner") && <ProductFeature key={index} content={block.product_banner} />}
            {block.hasOwnProperty("category_banner") && <CategoryBanner key={index} content={block.category_banner} />}
            {block.hasOwnProperty("lead_capture") && <LeadCapture key={index} content={block.lead_capture} />}
            {block.hasOwnProperty("agent") && <Agent key={index} agentData={block.agent} />}
            {block.hasOwnProperty("hero_banner") && <Hero key={index} content={block.hero_banner.hero} locale={params.locale} withHeader={false} />}
            {block.hasOwnProperty("image_grid") && <ImageGrid key={index} content={block.image_grid} isKiosk={entry?._applied_variants?.title === "cs76fdee0e83c5c333"} {...block.$?.image_grid} />}
            {block.hasOwnProperty("articles") && <ArticleBanner key={index} content={block.articles} />}
            {block.hasOwnProperty("tabs") && <Tabs key={index} content={block.tabs} />}
            {block.hasOwnProperty("marquee") && <Marquee key={index} content={block.marquee} />}
            {block.hasOwnProperty("form_builder") && <FormBuilder key={index} content={block.form_builder} />}
            {block.hasOwnProperty("recommendations_banner") && <RecommendationsBanner key={index} content={block.recommendations_banner} />}
          </div>
        ))}
      </div>

      {/* Variants slideout */}
      {variantsOpen && (
        <div className="fixed inset-0" style={{ background: 'rgba(0,0,0,0.4)', zIndex: 900 }} onClick={() => setVariantsOpen(false)} />
      )}
      <div
        className={`fixed w-[440px] right-0 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${variantsOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ top: '80px', height: 'calc(100vh - 80px)', background: '#0a0a0a', borderLeft: '1px solid rgba(255,255,255,0.08)', zIndex: 1000 }}
      >
        <div className="flex justify-between items-center px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: '1.4rem', color: '#fff' }}>
            All Variations
          </span>
          <button
            onClick={() => setVariantsOpen(false)}
            style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="flex flex-col gap-4">
            {variants?.length > 0 && variants.map((variant, index) => {
              const variantImages = variant.media || [];
              const currentImageIndex = variantImageIndices[index] || 0;
              const hasMultipleImages = variantImages.length > 1;
              const handlePreviousImage = (e) => {
                e.stopPropagation();
                setVariantImageIndices(prev => ({ ...prev, [index]: currentImageIndex > 0 ? currentImageIndex - 1 : variantImages.length - 1 }));
              };
              const handleNextImage = (e) => {
                e.stopPropagation();
                setVariantImageIndices(prev => ({ ...prev, [index]: currentImageIndex < variantImages.length - 1 ? currentImageIndex + 1 : 0 }));
              };
              return (
                <div
                  key={index}
                  className="cursor-pointer"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', background: '#111', padding: '1rem', transition: 'border-color 0.25s' }}
                  onClick={() => { if (variant?.url) router.push(variant.url); }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(209,162,97,0.5)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                >
                  {variantImages.length > 0 && (
                    <div className="relative mb-4">
                      <img className="w-full h-44 object-cover" src={variantImages[currentImageIndex]?.path} alt={variant?.name || "Variant"} />
                      {hasMultipleImages && (
                        <>
                          <button type="button" onClick={handlePreviousImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5" style={{ background: 'rgba(255,255,255,0.9)', color: '#000' }} aria-label="Previous image">
                            <ArrowLeftIcon className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5" style={{ background: 'rgba(255,255,255,0.9)', color: '#000' }} aria-label="Next image">
                            <ArrowRightIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                  <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: '1.15rem', color: '#fff', marginBottom: '0.4rem' }}>
                    {variant.name}
                  </p>
                  {(variant?.price || product?.price) && (
                    <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.7rem', letterSpacing: '0.1em', color: '#D1A261' }}>
                      {variant?.price || `${product?.currency_symbol}${product?.price}`}
                    </p>
                  )}
                  {variant?.description && (
                    <div className="mt-2 line-clamp-2" style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: variant.description }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Purchase slideout */}
      {purchaseOpen && (
        <div className="fixed inset-0 z-40 hidden sm:block" style={{ background: 'rgba(0,0,0,0.4)' }} />
      )}
      <div
        className={`fixed w-full sm:w-[380px] z-50 h-full top-0 right-0 shadow-2xl transition-all duration-500 flex flex-col ${purchaseOpen ? "translate-x-0" : "translate-x-full"}`}
        style={{ background: '#fff', borderLeft: '1px solid rgba(0,0,0,0.1)' }}
      >
        <div className="flex justify-end p-5">
          <button
            onClick={() => { setPurchaseOpen(false); setPurchaseSuccess(false); }}
            style={{ color: 'rgba(0,0,0,0.35)', transition: 'color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#000'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(0,0,0,0.35)'}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {purchaseSuccess ? (
          <div className="flex flex-col items-center justify-center flex-1 px-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center mb-6" style={{ border: '1px solid rgba(209,162,97,0.4)' }}>
              <svg className="h-6 w-6" style={{ color: '#D1A261' }} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: '1.8rem', color: '#1a1a1a', marginBottom: '0.75rem' }}>
              {getTranslation("purchase_success_title", "Purchase Complete")}
            </h3>
            <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.88rem', color: 'rgba(0,0,0,0.45)', lineHeight: 1.8, marginBottom: '2rem' }}>
              {getTranslation("purchase_success_message", "Thank you for your order.")}
            </p>
            <button
              onClick={() => { setPurchaseOpen(false); setPurchaseSuccess(false); }}
              className="w-full py-4 transition-opacity hover:opacity-85"
              style={{ background: '#D1A261', border: 'none', color: '#000', fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '9999px' }}
            >
              {getTranslation("purchase_success_button", "Continue Shopping")}
            </button>
          </div>
        ) : (
          <div className="flex flex-col flex-1 px-6 pb-8">
            <div style={{ borderBottom: '1px solid rgba(0,0,0,0.08)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
              <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '0.5rem' }}>
                Your Purchase
              </p>
              <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: '1.3rem', color: '#1a1a1a' }}>
                {entry?.product_name || product?.name}
              </p>
            </div>

            {product?.price && (
              <div className="flex justify-between mb-6">
                <div>
                  <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '0.4rem' }}>Price</p>
                  <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.92rem', color: 'rgba(0,0,0,0.7)' }}>
                    ${entry?.price || product?.price}
                  </p>
                </div>
                <div className="text-right">
                  <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 500, fontSize: '0.58rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.35)', marginBottom: '0.4rem' }}>Total</p>
                  <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 400, fontSize: '1.2rem', color: '#D1A261' }}>
                    ${entry?.price || product?.price}
                  </p>
                </div>
              </div>
            )}

            <input
              className="w-full mb-4"
              style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.12)', color: '#1a1a1a', padding: '12px 16px', fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.88rem', outline: 'none', transition: 'border-color 0.25s', boxSizing: 'border-box' }}
              placeholder="Email address"
              value={inputValue}
              onChange={handleChange}
              onFocus={e => e.target.style.borderColor = '#D1A261'}
              onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
            />

            <div className="flex items-center gap-2 mb-5">
              <input type="checkbox" defaultChecked readOnly style={{ accentColor: '#D1A261' }} />
              <label style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.82rem', color: 'rgba(0,0,0,0.5)' }}>Use card on file</label>
            </div>

            <div className="flex items-center gap-4 mb-6 px-4 py-3" style={{ background: '#f5f5f5', border: '1px solid rgba(0,0,0,0.07)' }}>
              <img className="h-7" src="https://images.contentstack.io/v3/assets/blt678db9efc83edd2d/blt237b95a3377390c0/681bec8e9b0925fa46df2048/amex-svgrepo-com.svg" alt="Credit card" />
              <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.85rem', color: 'rgba(0,0,0,0.5)' }}>...5309</p>
            </div>

            <button
              onClick={() => buyClick(entry?.price || product?.price)}
              className="w-full py-4 mb-3 transition-opacity hover:opacity-85"
              style={{ background: '#D1A261', border: 'none', color: '#000', fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '9999px' }}
            >
              Complete Purchase
            </button>

            <button className="w-full py-2 flex justify-center items-center" style={{ border: '1px solid rgba(90,48,244,0.3)', background: 'transparent' }}>
              <img className="h-9" src="https://images.contentstack.io/v3/assets/blt678db9efc83edd2d/bltbc9d297783dbfffc/681e1c146b233bd9775c08c4/spay.png" alt="Shop Pay" />
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
