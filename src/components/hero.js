"use client"
import Link from "next/link";
import Header from "./header";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
export default function Hero({ content, locale, withHeader, cslp }) {
  const pathname = usePathname();
  if (!content || content?.length === 0) return <div></div>;

  let positionClass = "";
  let headlineClass = "";
  let bodyClass = "";
  let buttonClass = "";

 
  if (content && content?.length > 0){
    const c0 = content?.[0];
    if (c0?.text_position === "Top Left") {
    positionClass = "top-16 left-16";
    } else if (c0?.text_position === "Top Center") {
      positionClass = "top-16 left-1/2 transform -translate-x-1/2 ";
    } else if (c0?.text_position === "Top Right") {
      positionClass = "top-16 right-16";
    } else if (c0?.text_position === "Left") {
      positionClass = "top-1/2 left-16 transform -translate-y-1/2";
    } else if (c0?.text_position === "Center") {
      positionClass =
        "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
    } else if (c0?.text_position === "Right") {
      positionClass = "top-1/2 right-16 transform -translate-y-1/2";
      headlineClass = "text-right";
      bodyClass = "text-right";
      buttonClass = "justify-end";
    } else if (c0?.text_position === "Bottom Left") {
      positionClass = "bottom-16 left-16";
    } else if (c0?.text_position === "Bottom Center") {
      positionClass = "bottom-16 left-1/2 transform -translate-x-1/2";
    } else if (c0?.text_position === "Bottom Right") {
      positionClass = "bottom-16 right-16";
    }
  }

  if (content && content?.length > 0){  
    const c0 = content?.[0];
    if (c0?.alignment === "Left") {
      headlineClass = "text-left";
      bodyClass = "text-left";
      buttonClass = "justify-start";
    } else if (c0?.alignment === "Center") {
      headlineClass = "text-center";
      bodyClass = "";
      buttonClass = "justify-center";
    } else if (c0?.alignment === "Right") {
      headlineClass = "text-right";
      bodyClass = "text-right";
      buttonClass = "justify-end";
    }
  }

  if(content && content?.length) {  
    if (content?.[0]?.header_overlay !== true) {
      withHeader = false
    }
  }

  return (
    <>
      {(!withHeader && pathname === `/${locale}`) && <Header locale={locale} /> }
      <motion.div
        inital="offscreen"
        whileInView="onscreen"
        viewport={{ once: true }}
      >
        <div className=" ">
          
          {content?.map((hero, index) => {
            // Get aspect ratio class based on contentstack field
            let aspectRatioClass = "aspect-video"; // Default to 16:9
            if (hero?.aspect_ratio === "16:9") {
              aspectRatioClass = "aspect-video"; // 16:9
            } else if (hero?.aspect_ratio === "3:2") {
              aspectRatioClass = "aspect-[3/2]";
            } else if (hero?.aspect_ratio === "2:1") {
              aspectRatioClass = "aspect-[2/1]";
            } else if (hero?.aspect_ratio === "21:9") {
              aspectRatioClass = "aspect-[21/9]";
            }

            const mediaOpacity = hero?.media_overlay || "75%";
            const imageFile = hero?.image_options?.image?.url || null;
            const imageHeight = hero?.image_options?.image_height || "h-auto";
            const isScreenHeight = imageHeight === "h-screen";

            const videoFile = hero?.video_options?.video?.url || null;
            const videoControls = hero?.video_options?.video_controls;
            const videoLoop = hero?.video_options?.in_loop;

            const containerHeightClass = videoFile
              ? aspectRatioClass
              : isScreenHeight
                ? "h-screen w-full"
                : aspectRatioClass;

            return (
              <div
                key={index}
                className={`bg-black relative isolate overflow-hidden flex ${containerHeightClass}`}
              >

                {videoFile ? (
                  <video
                    className="absolute inset-0 -z-10 min-h-full min-w-full h-full w-full object-cover"
                    style={{ opacity: mediaOpacity }}
                    autoPlay={videoControls === "Autoplay"}
                    controls={videoControls === "Show Controls"}
                    muted={videoControls === "Autoplay"}
                    loop={videoControls === "Autoplay"
                            ? true
                            : videoControls === "Show Controls"
                            ? videoLoop
                            : false
                          }
                    {...hero?.$?.video_options?.video}
                  >
                    <source src={videoFile} />
                  </video>
                ) : imageFile ? (
                  <img
                    className="absolute inset-0 -z-10 min-h-full min-w-full h-full w-full object-cover"
                    style={{
                      opacity: mediaOpacity
                    }}
                    src={imageFile}
                    {...hero?.image_options?.$?.image}
                  />
                ) : null}

                {withHeader ? <Header color="white" locale={locale} /> : <></>}
                <div className={"absolute max-w-2xl " + positionClass}>
                  <div className="hidden md:block md:w-[42rem]">
                    <motion.div
                      variants={{
                        hidden: {
                          y: 300,
                        },
                        visible: {
                          y: 0,
                          transition: {
                            type: "spring",
                            stiffness: 170,
                            damping: 30,
                          },
                        },
                      }}
                      initial="hidden"
                      animate="visible"
                      {...hero?.$?.text_position}
                    >
                      {/* Eyebrow */}
                      <div className="flex items-center gap-3 mb-6">
                        <span className="block h-px bg-[#D1A261]" style={{ width: '32px' }} />
                        <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 800, fontSize: '0.78rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#D1A261' }}>
                          Red Panda Resort
                        </span>
                      </div>

                      <h1
                        className={"text-white " + headlineClass}
                        style={{
                          fontFamily: 'var(--font-cinzel), Georgia, serif',
                          fontWeight: 500,
                          fontSize: 'clamp(1.4rem, 3.5vw, 3rem)',
                          lineHeight: 1.15,
                          letterSpacing: '0.04em',
                          textShadow: '0 2px 40px rgba(0,0,0,0.4)',
                        }}
                        {...hero?.$?.header}
                      >
                        {hero?.header}
                      </h1>

                      {/* Gold rule */}
                      <div className="my-6 hidden lg:block" style={{ width: '40px', height: '1px', background: '#D1A261' }} />

                      <p
                        className={"text-white/85 text-center hidden lg:block"}
                        style={{
                          fontFamily: 'var(--font-raleway), sans-serif',
                          fontWeight: 300,
                          fontSize: hero?.body_text_size ? hero?.body_text_size : 'clamp(0.8rem, 1.2vw, 0.95rem)',
                          lineHeight: 1.85,
                          letterSpacing: '0.02em',
                        }}
                        {...hero?.$?.body}
                      >
                        {hero?.body}
                      </p>

                      {hero?.button_text !== "" && (
                        <div className={"mt-6 lg:mt-10 flex items-center gap-x-6 " + buttonClass}>
                          {hero?.page && (
                            <Link
                              href={(hero?.page?.length > 0 && hero?.page?.[0]?.url) ? hero?.page?.[0]?.url : "#"}
                              className="group inline-flex items-center gap-3 transition-all duration-300 md:px-5 md:py-2.5 lg:px-8 lg:py-[14px]"
                              style={{
                                fontFamily: 'var(--font-montserrat), sans-serif',
                                fontWeight: 500,
                                fontSize: '0.7rem',
                                letterSpacing: '0.22em',
                                textTransform: 'uppercase',
                                color: '#D1A261',
                                border: '1px solid #D1A261',
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#D1A261'; e.currentTarget.style.color = '#000'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#D1A261'; }}
                              {...hero?.$?.button_text}
                            >
                              {hero?.button_text}
                              <svg className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}
