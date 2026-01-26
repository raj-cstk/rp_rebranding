"use client";
import Header from "@/components/header";
import { useParams } from "next/navigation";
import Footer from "@/components/footer";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ContentstackClient } from "@/lib/contentstack-client";

export default function CloudinaryPage(){
    const params = useParams();
    const [entry, setEntry] = useState({});
    const [selectedDemo, setSelectedDemo] = useState('responsive');

    const getContent = async () => {
        const entries = await ContentstackClient.getElementByType(
            "cloudinary",
            params.locale
        );
        if (entries && entries.length > 0) {
            setEntry(entries[0]);
            // Content fetched but not used yet - keeping hardcoded content for now
            console.log('Cloudinary content fetched from Contentstack:', entries[0]);
        }
    };

    useEffect(() => {
        getContent();
        ContentstackClient.onEntryChange(getContent);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Extract cloud name from secure_url if available
    const getCloudName = (url) => {
        if (!url) return 'demo';
        const match = url.match(/res\.cloudinary\.com\/([^\/]+)\//);
        return match ? match[1] : 'demo';
    };
    
    const cloudName = entry?.banner_image?.[0]?.secure_url 
        ? getCloudName(entry.banner_image[0].secure_url) 
        : 'demo';
    
    const demos = {
        responsive: {
            title: 'Responsive Images',
            description: 'Automatically serve the perfect image size for every device, reducing bandwidth and improving load times.',
            images: entry?.responsive_image?.[0]?.secure_url ? [
                { label: 'Mobile (400px)', url: entry.responsive_image[0].secure_url.replace(/\/upload\//, '/upload/w_400,c_fill,g_auto/') },
                { label: 'Tablet (800px)', url: entry.responsive_image[0].secure_url.replace(/\/upload\//, '/upload/w_800,c_fill,g_auto/') },
                { label: 'Desktop (1200px)', url: entry.responsive_image[0].secure_url.replace(/\/upload\//, '/upload/w_1200,c_fill,g_auto/') },
            ] : [
                { label: 'Mobile (400px)', url: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,c_fill,g_auto/sample.jpg` },
                { label: 'Tablet (800px)', url: `https://res.cloudinary.com/${cloudName}/image/upload/w_800,c_fill,g_auto/sample.jpg` },
                { label: 'Desktop (1200px)', url: `https://res.cloudinary.com/${cloudName}/image/upload/w_1200,c_fill,g_auto/sample.jpg` },
            ]
        },
        optimization: {
            title: 'Automatic Optimization',
            description: 'Cloudinary automatically optimizes images with format conversion, compression, and quality adjustments.',
            images: entry?.optimized_image?.[0]?.secure_url ? [
                { label: 'Original', url: entry.optimized_image[0].secure_url },
                { label: 'Optimized (WebP)', url: entry.optimized_image[0].secure_url.replace(/\/upload\//, '/upload/f_auto,q_auto/') },
                { label: 'Highly Optimized', url: entry.optimized_image[0].secure_url.replace(/\/upload\//, '/upload/f_auto,q_auto:best/') },
            ] : [
                { label: 'Original', url: `https://res.cloudinary.com/${cloudName}/image/upload/sample.jpg` },
                { label: 'Optimized (WebP)', url: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/sample.jpg` },
                { label: 'Highly Optimized', url: `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto:best/sample.jpg` },
            ]
        },
        transformations: {
            title: 'Dynamic Transformations',
            description: 'Apply real-time transformations like cropping, filters, overlays, and effects without storing multiple versions.',
            images: entry?.transformation_image?.[0]?.secure_url ? [
                { label: 'Original', url: entry.transformation_image[0].secure_url },
                { label: 'Grayscale', url: entry.transformation_image[0].secure_url.replace(/\/upload\//, '/upload/e_grayscale/') },
                { label: 'Sepia', url: entry.transformation_image[0].secure_url.replace(/\/upload\//, '/upload/e_sepia/') },
                { label: 'Vignette', url: entry.transformation_image[0].secure_url.replace(/\/upload\//, '/upload/e_vignette/') },
            ] : [
                { label: 'Original', url: `https://res.cloudinary.com/${cloudName}/image/upload/sample.jpg` },
                { label: 'Grayscale', url: `https://res.cloudinary.com/${cloudName}/image/upload/e_grayscale/sample.jpg` },
                { label: 'Sepia', url: `https://res.cloudinary.com/${cloudName}/image/upload/e_sepia/sample.jpg` },
                { label: 'Vignette', url: `https://res.cloudinary.com/${cloudName}/image/upload/e_vignette/sample.jpg` },
            ]
        },
        cropping: {
            title: 'Smart Cropping',
            description: 'Intelligent face detection and automatic cropping ensures perfect framing for every image.',
            images: entry?.cropping_image?.[0]?.secure_url ? [
                { label: 'Auto Crop', url: entry.cropping_image[0].secure_url.replace(/\/upload\//, '/upload/w_400,h_400,c_fill,g_auto/') },
                { label: 'Face Detection', url: entry.cropping_image[0].secure_url.replace(/\/upload\//, '/upload/w_400,h_400,c_fill,g_face/') },
                { label: 'Custom Focus', url: entry.cropping_image[0].secure_url.replace(/\/upload\//, '/upload/w_400,h_400,c_fill,g_center/') },
            ] : [
                { label: 'Auto Crop', url: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_400,c_fill,g_auto/sample.jpg` },
                { label: 'Face Detection', url: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_400,c_fill,g_face/sample.jpg` },
                { label: 'Custom Focus', url: `https://res.cloudinary.com/${cloudName}/image/upload/w_400,h_400,c_fill,g_center/sample.jpg` },
            ]
        }
    };

    return(
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .cloudinary-page h1 {
                    font-family: var(--font-playfair) !important;
                    font-weight: 400 !important;
                    letter-spacing: 0.05em !important;
                    text-transform: none !important;
                }
                .cloudinary-page h2 {
                    font-family: var(--font-raleway) !important;
                    font-weight: 300 !important;
                    letter-spacing: 0.05em !important;
                    text-transform: none !important;
                }
                .cloudinary-page h3 {
                    font-family: var(--font-raleway) !important;
                    font-weight: 500 !important;
                    letter-spacing: 0.03em !important;
                    text-transform: none !important;
                }
                .cloudinary-page p {
                    font-family: var(--font-raleway) !important;
                    font-weight: 300 !important;
                }
                .cloudinary-page button,
                .cloudinary-page a[class*="button"] {
                    font-family: var(--font-raleway) !important;
                    font-weight: 500 !important;
                    letter-spacing: 0.02em !important;
                }
            `}} />
            <div className="cloudinary-page">
            <Header locale={params.locale} />

            {/* Hero Section */}
            <div 
                className="relative h-[600px] flex items-center justify-center"
                style={entry?.banner_image?.[0]?.secure_url ? {
                    backgroundImage: `url(${entry.banner_image[0].secure_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                } : {
                    background: 'linear-gradient(to right, rgb(8 145 178), rgb(29 78 216))'
                }}
            >
                <div className="absolute inset-0 bg-black opacity-40"></div>
                <div className="relative z-10 text-center px-8">
                    <h1 
                        className="text-5xl md:text-7xl text-white mb-6 font-playfair font-normal tracking-wide leading-tight"
                        style={{ fontFamily: 'var(--font-playfair)', fontWeight: 400, letterSpacing: '0.05em', lineHeight: '1.2' }}
                    >
                        Cloudinary DAM Integration
                    </h1>
                    <p 
                        className="text-xl md:text-2xl text-white max-w-3xl mx-auto leading-relaxed font-raleway font-light tracking-wide"
                        style={{ fontFamily: 'var(--font-raleway)', fontWeight: 300, letterSpacing: '0.02em' }}
                    >
                        Experience seamless digital asset management with Cloudinary. 
                        Transform, optimize, and deliver stunning resort imagery across all platforms.
                    </p>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="max-w-6xl mx-auto px-8 py-24">
                <div className="text-center mb-16">
                    <h2 
                        className="text-4xl md:text-5xl text-neutral-700 mb-6 font-raleway font-light tracking-wide"
                        style={{ fontFamily: 'var(--font-raleway)', fontWeight: 300, letterSpacing: '0.05em' }}
                    >
                        Why Cloudinary for Your Resort
                    </h2>
                    <p 
                        className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto font-raleway font-light leading-relaxed"
                        style={{ fontFamily: 'var(--font-raleway)', fontWeight: 300 }}
                    >
                        Streamline your digital asset workflow with powerful image management and optimization
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-gray-50 p-8 rounded-lg flex flex-col h-full">
                        <div className="text-4xl mb-4 h-12 flex items-center">⚡</div>
                        <h3 
                            className="text-2xl text-neutral-700 mb-4 font-raleway font-medium tracking-wide h-20 flex items-start"
                            style={{ fontFamily: 'var(--font-raleway)', fontWeight: 500, letterSpacing: '0.03em', textTransform: 'none' }}
                        >
                            Lightning Fast
                        </h3>
                        <p 
                            className="text-neutral-600 leading-relaxed font-raleway font-light text-base"
                            style={{ fontFamily: 'var(--font-raleway)', fontWeight: 300 }}
                        >
                            Automatic format conversion and optimization reduce load times by up to 80%, 
                            ensuring your guests see beautiful images instantly.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-lg flex flex-col h-full">
                        <div className="text-4xl mb-4 h-12 flex items-center">📱</div>
                        <h3 
                            className="text-2xl text-neutral-700 mb-4 font-raleway font-medium tracking-wide h-20 flex items-start"
                            style={{ fontFamily: 'var(--font-raleway)', fontWeight: 500, letterSpacing: '0.03em', textTransform: 'none' }}
                        >
                            Responsive by Default
                        </h3>
                        <p 
                            className="text-neutral-600 leading-relaxed font-raleway font-light text-base"
                            style={{ fontFamily: 'var(--font-raleway)', fontWeight: 300 }}
                        >
                            One image URL automatically serves the perfect size for mobile, tablet, and desktop. 
                            No more managing multiple image versions.
                        </p>
                    </div>
                    <div className="bg-gray-50 p-8 rounded-lg flex flex-col h-full">
                        <div className="text-4xl mb-4 h-12 flex items-center">🎨</div>
                        <h3 
                            className="text-2xl text-neutral-700 mb-4 font-raleway font-medium tracking-wide h-20 flex items-start"
                            style={{ fontFamily: 'var(--font-raleway)', fontWeight: 500, letterSpacing: '0.03em', textTransform: 'none' }}
                        >
                            Dynamic Transformations
                        </h3>
                        <p 
                            className="text-neutral-600 leading-relaxed font-raleway font-light text-base"
                            style={{ fontFamily: 'var(--font-raleway)', fontWeight: 300 }}
                        >
                            Apply filters, crops, and effects on-the-fly without storing multiple versions. 
                            Perfect for A/B testing and seasonal campaigns.
                        </p>
                    </div>
                </div>
            </div>

            {/* Interactive Demo Section */}
            <div className="bg-gray-100 py-24">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl text-neutral-700 mb-6 font-raleway font-light tracking-wide">
                            See It In Action
                        </h2>
                        <p className="text-lg md:text-xl text-neutral-600 max-w-2xl mx-auto font-raleway font-light leading-relaxed">
                            Explore Cloudinary&apos;s powerful features with interactive demonstrations
                        </p>
                    </div>

                    {/* Demo Selector */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {Object.keys(demos).map((key) => (
                            <button
                                key={key}
                                onClick={() => setSelectedDemo(key)}
                                className={`px-6 py-3 rounded-md font-raleway font-medium tracking-wide transition-all ${
                                    selectedDemo === key
                                        ? 'bg-cyan-600 text-white shadow-lg'
                                        : 'bg-white text-neutral-700 hover:bg-gray-50'
                                }`}
                            >
                                {demos[key].title}
                            </button>
                        ))}
                    </div>

                    {/* Demo Display */}
                    <div className="bg-white rounded-lg p-8 shadow-lg">
                        <h3 className="text-2xl text-neutral-700 mb-4 font-raleway font-medium tracking-wide">
                            {demos[selectedDemo].title}
                        </h3>
                        <p className="text-neutral-600 mb-8 leading-relaxed font-raleway font-light">
                            {demos[selectedDemo].description}
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-6">
                            {demos[selectedDemo].images.map((img, index) => (
                                <div key={index} className="border rounded-lg overflow-hidden">
                                    <div className="aspect-square bg-gray-200 relative">
                                        <Image
                                            src={img.url}
                                            alt={img.label}
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="p-4 bg-white">
                                        <p className="text-sm font-raleway font-medium text-neutral-700 text-center">
                                            {img.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Integration Details */}
            <div className="max-w-4xl mx-auto px-8 py-24">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl text-neutral-700 mb-6 font-raleway font-light tracking-wide">
                        Seamless Integration
                    </h2>
                </div>

                <div className="space-y-8">
                    <div className="border-l-4 border-cyan-600 pl-6">
                        <h3 className="text-2xl text-neutral-700 mb-3 font-raleway font-medium tracking-wide">
                            Contentstack + Cloudinary
                        </h3>
                        <p className="text-neutral-600 leading-relaxed font-raleway font-light">
                            Our integration with Cloudinary allows content editors to select and manage images 
                            directly from Cloudinary within Contentstack. Images are automatically optimized 
                            and transformed based on your delivery requirements.
                        </p>
                    </div>

                    <div className="border-l-4 border-blue-600 pl-6">
                        <h3 className="text-2xl text-neutral-700 mb-3 font-raleway font-medium tracking-wide">
                            API-First Architecture
                        </h3>
                        <p className="text-neutral-600 leading-relaxed font-raleway font-light">
                            Access your entire media library programmatically. Transform images on-the-fly 
                            using URL parameters, or leverage Cloudinary&apos;s SDKs for advanced workflows 
                            and automation.
                        </p>
                    </div>

                    <div className="border-l-4 border-purple-600 pl-6">
                        <h3 className="text-2xl text-neutral-700 mb-3 font-raleway font-medium tracking-wide">
                            Global CDN Delivery
                        </h3>
                        <p className="text-neutral-600 leading-relaxed font-raleway font-light">
                            Images are delivered through Cloudinary&apos;s global CDN, ensuring fast load times 
                            for guests around the world. Automatic caching and edge optimization provide 
                            the best possible experience.
                        </p>
                    </div>
                </div>
            </div>

            {/* Resources Section */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 py-16">
                <div className="max-w-4xl mx-auto px-8">
                    <h2 className="text-4xl md:text-5xl text-white mb-6 font-raleway font-light tracking-wide text-center">
                        Integration Resources
                    </h2>
                    <p className="text-xl md:text-2xl text-white mb-8 leading-relaxed font-raleway font-light tracking-wide text-center">
                        Learn more about the Contentstack and Cloudinary integration, including installation, configuration, and implementation details.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        <a
                            href="https://www.contentstack.com/marketplace/cloudinary"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-cyan-600 rounded-lg p-6 hover:bg-gray-50 transition-colors group"
                        >
                            <h3 className="text-xl font-raleway font-medium mb-3 group-hover:text-cyan-700">
                                Cloudinary Marketplace App
                            </h3>
                            <p className="text-neutral-600 font-raleway font-light leading-relaxed">
                                Explore the Cloudinary app in Contentstack&apos;s Marketplace. Learn about features, use cases, and how to install the integration.
                            </p>
                            <div className="mt-4 text-sm font-raleway font-medium text-cyan-600 group-hover:text-cyan-700">
                                View Marketplace Page →
                            </div>
                        </a>
                        <a
                            href="https://www.contentstack.com/docs/developers/marketplace-apps/cloudinary"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-cyan-600 rounded-lg p-6 hover:bg-gray-50 transition-colors group"
                        >
                            <h3 className="text-xl font-raleway font-medium mb-3 group-hover:text-cyan-700">
                                Installation & Configuration Guide
                            </h3>
                            <p className="text-neutral-600 font-raleway font-light leading-relaxed">
                                Step-by-step documentation for installing and configuring the Cloudinary app, including credential setup and field configuration.
                            </p>
                            <div className="mt-4 text-sm font-raleway font-medium text-cyan-600 group-hover:text-cyan-700">
                                View Documentation →
                            </div>
                        </a>
                    </div>
                    <div className="mt-8 text-center">
                        <p className="text-white/90 font-raleway font-light text-sm">
                            The Cloudinary app supports Custom Fields and JSON RTE integration, allowing you to manage Cloudinary assets directly within Contentstack entries.
                        </p>
                    </div>
                </div>
            </div>

            <Footer locale={params.locale} />
            </div>
        </>
    )
}