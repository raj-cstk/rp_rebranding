"use client";
import Header from "./header";

export default function PageHero({ content, locale, withHeader }) {
  const imageUrl = content?.image?.url?.trim();
  const hasValidImageUrl = imageUrl && imageUrl.length > 0;

  const videoUrl = content?.video_options?.video?.url?.trim();
  const hasValidVideoUrl = videoUrl && videoUrl.length > 0;
  const videoControls = content?.video_options?.video_controls;
  const videoLoop = content?.video_options?.in_loop;
  const overlayOpacity = 1 - parseInt(content?.overlay ?? "75%") / 100;

  const layout = content?.layout || "Text Left";
  const textAlign = layout === "Center" ? "center" : layout === "Text Right" ? "right" : "left";
  const flexAlign = layout === "Center" ? "center" : layout === "Text Right" ? "flex-end" : "flex-start";

  return (
    <div className="relative w-full overflow-hidden" style={{ maxHeight: '100vh' }}>
      {/* Media — drives the container height */}
      {hasValidVideoUrl ? (
        <video
          className="w-full block"
          autoPlay={videoControls === "Autoplay"}
          controls={videoControls === "Show Controls"}
          muted={videoControls === "Autoplay"}
          loop={videoControls === "Autoplay" ? true : videoControls === "Show Controls" ? videoLoop : false}
        >
          <source src={videoUrl} />
        </video>
      ) : hasValidImageUrl ? (
        <img
          src={imageUrl}
          className="w-full block"
          {...content?.$?.image}
        />
      ) : (
        <div style={{ height: '60vh', background: '#1a1a1a' }} />
      )}

      {/* Overlay + text sit on top */}
      <div className="absolute inset-0" style={{ background: '#000', opacity: overlayOpacity }} />

      {withHeader && (
        <div className="absolute top-0 left-0 right-0 z-20">
          <Header color="white" locale={locale} />
        </div>
      )}

      <div
        className="absolute inset-0 flex flex-col px-8 lg:px-20 py-16 justify-center"
        style={{ alignItems: flexAlign, textAlign }}
      >
        <div style={{ maxWidth: '520px', marginTop: 'clamp(40px, 8vh, 100px)' }}>
          <div className="flex items-center gap-3 mb-5" style={{ justifyContent: flexAlign }}>
            <span style={{ width: '28px', height: '1px', background: '#D1A261', display: 'block', flexShrink: 0 }} />
            <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 600, fontSize: '0.58rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261' }}>
              Red Panda Resort
            </span>
          </div>

          <h2
            style={{
              fontFamily: '"Cormorant Garamond", Georgia, serif',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              lineHeight: 1.1,
              color: '#fff',
              marginBottom: '1.25rem',
              textShadow: '0 2px 30px rgba(0,0,0,0.35)',
            }}
            {...content?.$?.headline}
          >
            {content?.headline}
          </h2>

          <div style={{
            width: '32px', height: '1px', background: '#D1A261', marginBottom: '1.25rem',
            marginLeft: layout === "Center" ? 'auto' : '0',
            marginRight: layout === "Text Right" || layout === "Center" ? 'auto' : '0',
          }} />

          {content?.details && (
            <p
              style={{
                fontFamily: 'var(--font-raleway), sans-serif',
                fontWeight: 300,
                fontSize: 'clamp(0.85rem, 1.1vw, 0.98rem)',
                lineHeight: 1.9,
                letterSpacing: '0.02em',
                color: 'rgba(255,255,255,0.65)',
                whiteSpace: 'pre-wrap',
              }}
              {...content?.$?.details}
            >
              {content?.details}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
