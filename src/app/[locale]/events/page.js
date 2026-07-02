"use client";
import { useState, useEffect } from "react";
import { useDataContext } from "@/context/data.context";
import { useParams } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ContentstackClient } from "@/lib/contentstack-client";
import { useJstag } from "@/context/lyticsTracking";
import { motion, AnimatePresence } from "framer-motion";

export const resortEvents = [
  { title: "Sunrise Yoga on the Beach", description: "Start your day with a peaceful yoga session on our pristine white sand beach. Our certified instructor will guide you through gentle poses as the sun rises over the Indian Ocean. All levels welcome. Mats and towels provided.", dateTime: "Daily at 6:30 AM", location: "Beach Pavilion", image: "/images/events/sunrise-yoga.jpg" },
  { title: "Snorkeling Adventure to Coral Gardens", description: "Explore the vibrant underwater world of the Maldives with our guided snorkeling tour. Discover colorful coral reefs teeming with tropical fish, sea turtles, and marine life. Equipment included.", dateTime: "Daily at 9:00 AM and 2:00 PM", location: "Water Sports Center", image: "/images/events/snorkeling.jpg" },
  { title: "Maldivian Cooking Class", description: "Learn to prepare authentic Maldivian dishes with our executive chef. Discover the secrets of local spices and traditional cooking methods. Includes lunch featuring the dishes you prepare. Limited to 12 participants.", dateTime: "Tuesdays and Fridays at 11:00 AM", location: "Culinary Studio", image: "/images/events/cooking-class.jpg" },
  { title: "Sunset Dolphin Watching Cruise", description: "Embark on a magical journey to spot playful dolphins in their natural habitat. Enjoy complimentary champagne and canapés as you watch the sun set over the horizon.", dateTime: "Daily at 5:30 PM", location: "Main Jetty", image: "/images/events/dolphin-cruise.jpg" },
  { title: "Beachside BBQ Dinner", description: "Indulge in a sumptuous beachside barbecue featuring fresh seafood, grilled meats, and local specialties. Enjoy live music and traditional Maldivian entertainment under the stars.", dateTime: "Wednesdays and Saturdays at 7:00 PM", location: "Beach Restaurant", image: "/images/events/beach-bbq.jpg" },
  { title: "Spa Wellness Workshop", description: "Join our wellness expert for a workshop on mindfulness, meditation, and stress relief techniques. Learn practices you can take home with you. Includes a complimentary 30-minute spa treatment.", dateTime: "Mondays and Thursdays at 10:00 AM", location: "Spa & Wellness Center", image: "/images/events/spa-workshop.jpg" },
  { title: "Stargazing Experience", description: "Experience the breathtaking night sky of the Maldives with our astronomy expert. Learn about constellations, planets, and celestial phenomena while enjoying tropical cocktails.", dateTime: "Fridays at 8:00 PM (weather permitting)", location: "Observatory Deck", image: "/images/events/stargazing.jpg" },
  { title: "Stand-Up Paddleboard Yoga", description: "Combine the tranquility of yoga with the gentle movement of paddleboarding. This unique class takes place on calm lagoon waters, offering a peaceful and challenging workout.", dateTime: "Daily at 7:30 AM", location: "Lagoon", image: "/images/events/paddleboard-yoga.jpg" },
  { title: "Traditional Maldivian Bodu Beru Performance", description: "Experience the vibrant rhythms and energetic dance of traditional Maldivian Bodu Beru. This cultural performance showcases local music and dance traditions passed down through generations.", dateTime: "Sundays and Thursdays at 7:30 PM", location: "Main Restaurant", image: "/images/events/bodu-beru.jpg" },
  { title: "Private Island Picnic", description: "Escape to a secluded sandbank for a romantic private picnic. Includes gourmet lunch, champagne, and return boat transfer. Perfect for couples celebrating special occasions.", dateTime: "Available daily, booking required", location: "Private Sandbank", image: "/images/events/private-picnic.jpg" },
  { title: "Manta Ray Snorkeling Expedition", description: "Swim alongside majestic manta rays in their natural habitat. Our marine biologist guide will share insights about these gentle giants. Includes boat transfer and equipment.", dateTime: "Mondays, Wednesdays, and Saturdays at 8:00 AM", location: "Manta Point (30-minute boat ride)", image: "/images/events/manta-ray.jpg" },
  { title: "Wine Tasting Evening", description: "Join our sommelier for an exclusive wine tasting featuring selections from around the world, perfectly paired with artisanal cheeses and charcuterie.", dateTime: "Fridays at 6:30 PM", location: "Wine Cellar", image: "/images/events/wine-tasting.jpg" },
  { title: "Sunset Fishing Trip", description: "Experience traditional Maldivian fishing techniques on our sunset fishing excursion. Catch your dinner and have it prepared by our chefs. All equipment provided.", dateTime: "Daily at 4:30 PM", location: "Fishing Boat", image: "/images/events/fishing.jpg" },
  { title: "Beach Volleyball Tournament", description: "Join fellow guests for a friendly beach volleyball tournament. Teams are formed on-site, and all skill levels are welcome. Prizes for winners. Refreshments provided.", dateTime: "Sundays at 3:00 PM", location: "Beach Volleyball Court", image: "/images/events/volleyball.jpg" },
  { title: "Underwater Photography Workshop", description: "Learn to capture stunning underwater images with our professional photographer. Covers equipment, techniques, and composition. Includes a guided snorkeling session to practice your skills.", dateTime: "Tuesdays at 10:00 AM", location: "Water Sports Center", image: "/images/events/underwater-photography.jpg" },
  { title: "Live Acoustic Music Night", description: "Relax with live acoustic music performed by talented local and international artists. Enjoy your favorite cocktails while listening to soothing melodies in our beachfront bar.", dateTime: "Daily at 8:00 PM", location: "Beach Bar", image: "/images/events/live-music.jpg" },
  { title: "Kids' Marine Discovery Program", description: "Educational and fun activities for children to learn about marine life, coral reefs, and ocean conservation. Includes interactive games, crafts, and supervised snorkeling.", dateTime: "Daily at 10:00 AM", location: "Kids' Club", image: "/images/events/kids-marine.jpg" },
  { title: "Sunrise Kayaking Tour", description: "Paddle through calm waters as the sun rises, exploring hidden coves and pristine beaches. Includes light breakfast and refreshments. Single and double kayaks available.", dateTime: "Daily at 6:00 AM", location: "Water Sports Center", image: "/images/events/kayaking.jpg" },
  { title: "Cocktail Making Class", description: "Learn to craft tropical cocktails with our expert mixologist. Discover the art of mixology using local ingredients and traditional techniques. Includes tastings and recipe cards.", dateTime: "Wednesdays and Saturdays at 5:00 PM", location: "Beach Bar", image: "/images/events/cocktail-class.jpg" },
  { title: "Full Moon Beach Party", description: "Celebrate the full moon with a special beach party featuring live DJ, fire dancers, and a themed buffet. Dance under the stars on our pristine beach. Open to all guests.", dateTime: "Monthly on full moon (check calendar)", location: "Main Beach", image: "/images/events/full-moon-party.jpg" },
  { title: "Reef Conservation Workshop", description: "Learn about coral reef ecosystems and participate in our conservation efforts. Includes a presentation by our marine biologist and an opportunity to help with reef restoration.", dateTime: "Thursdays at 2:00 PM", location: "Marine Center", image: "/images/events/reef-conservation.jpg" },
];

function getEventDays(recur) {
  if (!recur || !Array.isArray(recur)) return [];
  return recur;
}

function getEventTime(date) {
  if (!date) return '';
  return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Indian/Maldives' });
}

function getEventDateTimeString(event) {
  const time = getEventTime(event.date);
  const days = event.recur || [];
  if (days.length === 7) return `Daily at ${time}`;
  if (days.length === 1) return `${days[0]}s at ${time}`;
  if (days.length > 1) return `${days.map(d => d + 's').join(', ')} at ${time}`;
  return time;
}

const DEFAULT_EVENT_IMAGE = "https://images.contentstack.io/v3/assets/bltc991c0dda4197336/bltd14b8a03a4e57aad/6719553776705e041bfbd297/villas.jpeg";

const CalendarIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
);

const PinIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
);

export default function Page() {
  const params = useParams();
  const [viewMode, setViewMode] = useState('list');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entry, setEntry] = useState({});
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const initialData = useDataContext();
  const jstag = useJstag();

  useEffect(() => {
    const fetchData = async () => {
      const data = await ContentstackClient.getElementByType("events_page", params.locale, null);
      setEntry(data?.[0] ?? null);
      const eventsData = await ContentstackClient.getElementByType("event", params.locale, null);
      setEvents(eventsData || []);
      setIsLoading(false);
    };
    ContentstackClient.onEntryChange(fetchData);
  }, [params.locale, initialData]);

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    if (jstag && event?.taxonomies?.length > 0) {
      event.taxonomies.forEach((t) => {
        jstag.send({ topic_browsed: t.term_uid });
      });
    }
  };
  const closeModal = () => { setIsModalOpen(false); setSelectedEvent(null); };

  useEffect(() => {
    document.body.style.overflow = isModalOpen ? 'hidden' : 'unset';
    const handleEsc = (e) => { if (e.key === 'Escape' && isModalOpen) closeModal(); };
    document.addEventListener('keydown', handleEsc);
    return () => { document.removeEventListener('keydown', handleEsc); document.body.style.overflow = 'unset'; };
  }, [isModalOpen]);

  const getAudiences = (event) => {
    if (!event.taxonomies || !Array.isArray(event.taxonomies)) return [];
    return event.taxonomies.filter(t => t.taxonomy_uid === 'event_audiences').map(t => t.term_uid);
  };

  const transformedEvents = events.map(event => ({
    title: event.title,
    description: event.description,
    location: event.location,
    dateTime: getEventDateTimeString(event),
    date: event.date,
    recur: event.recur || [],
    image: event.image?.url || null,
    uid: event.uid,
    audiences: getAudiences(event),
    taxonomies: event.taxonomies || [],
  }));

  const displayEvents = transformedEvents.length > 0 ? transformedEvents : resortEvents;

  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const eventsByDay = {};
  weekDays.forEach(day => { eventsByDay[day] = []; });
  displayEvents.forEach(event => {
    const days = event.recur?.length > 0 ? event.recur : getEventDays(event.dateTime);
    days.forEach(day => { if (eventsByDay[day]) eventsByDay[day].push(event); });
  });
  Object.keys(eventsByDay).forEach(day => {
    eventsByDay[day].sort((a, b) => {
      if (a.date && b.date) return new Date(a.date) - new Date(b.date);
      return getEventTime(a.date || a.dateTime).localeCompare(getEventTime(b.date || b.dateTime));
    });
  });

  if (isLoading) return null;

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header locale={params.locale} />

      {/* Page header */}
      <div className="w-full px-8 md:px-16 pt-28 pb-16" style={{ borderBottom: '1px solid #e8e4de' }}>
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4 mb-6">
            <span className="w-12 h-px bg-[#D1A261]" />
            <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.58rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 500 }}>
              Red Panda Resort
            </span>
          </div>
          <h1
            style={{ fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', lineHeight: 1.1, color: '#1a1410' }}
            {...entry?.$?.headline}
          >
            {entry?.headline || 'Events & Activities'}
          </h1>
          {entry?.details && (
            <p
              style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '1rem', lineHeight: 1.8, color: '#6b6560', marginTop: '1rem', maxWidth: '540px' }}
              {...entry?.$?.details}
            >
              {entry.details}
            </p>
          )}

          {/* View toggle */}
          <div className="mt-10" style={{ border: '1px solid #e0dbd3', display: 'inline-flex', padding: '4px' }}>
            {['list', 'calendar'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontSize: '0.58rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  padding: '8px 20px',
                  background: viewMode === mode ? '#1a1410' : 'transparent',
                  color: viewMode === mode ? '#D1A261' : '#9a9590',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                }}
              >
                {mode === 'list' ? 'Grid' : 'Calendar'}
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* List View */}
      {viewMode === 'list' && (
        <div className="w-full px-8 md:px-16 py-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {displayEvents.map((event, index) => (
              <EventGridCard key={event.uid || index} event={event} index={index} onOpen={openModal} />
            ))}
          </div>
        </div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <div style={{ background: '#0f0e0c' }} className="w-full px-8 md:px-12 py-20">
          <div className="max-w-full mx-auto overflow-x-auto">
            <div className="grid grid-cols-7 gap-3 mb-4" style={{ minWidth: '900px' }}>
              {weekDays.map(day => (
                <div key={day}>
                  <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#D1A261', fontWeight: 500 }}>
                    {day.slice(0, 3)}
                  </span>
                  <div style={{ height: '1px', background: 'rgba(209,162,97,0.3)', marginTop: '6px' }} />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-3" style={{ minWidth: '900px', alignItems: 'start' }}>
              {weekDays.map(day => (
                <div key={day} className="flex flex-col gap-3">
                  {eventsByDay[day].length > 0 ? (
                    eventsByDay[day].map((event, i) => (
                      <motion.button
                        key={`${day}-${i}`}
                        onClick={() => openModal(event)}
                        className="text-left w-full"
                        style={{ background: '#1a1814', border: '1px solid rgba(255,255,255,0.06)', padding: '14px', cursor: 'pointer' }}
                        whileHover={{ borderColor: 'rgba(209,162,97,0.4)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.5rem', letterSpacing: '0.15em', color: '#D1A261', marginBottom: '6px' }}>
                          {event.date ? getEventTime(event.date) : ''}
                        </p>
                        <p style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: '0.9rem', lineHeight: 1.3, color: '#e8e4de', marginBottom: '6px' }}>
                          {event.title}
                        </p>
                        {event.location && (
                          <p style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.48rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>
                            {event.location}
                          </p>
                        )}
                      </motion.button>
                    ))
                  ) : (
                    <div style={{ background: '#141210', border: '1px solid rgba(255,255,255,0.04)', padding: '14px', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.48rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.15)' }}>—</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedEvent && (
          <>
            <motion.div
              className="fixed inset-0 z-40"
              style={{ background: 'rgba(10,8,6,0.75)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                className="relative w-full overflow-hidden"
                style={{ maxWidth: '760px', maxHeight: '90vh', overflowY: 'auto', background: '#faf9f7' }}
                onClick={e => e.stopPropagation()}
              >
                {/* Hero image */}
                <div className="relative w-full" style={{ height: '320px' }}>
                  <div
                    style={{
                      position: 'absolute', inset: 0,
                      backgroundImage: `url(${selectedEvent.image || DEFAULT_EVENT_IMAGE})`,
                      backgroundSize: 'cover', backgroundPosition: 'center',
                    }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0) 100%)' }} />

                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 flex items-center justify-center"
                    style={{ width: '32px', height: '32px', background: 'rgba(0,0,0,0.4)', color: '#fff' }}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="absolute bottom-5 left-6 right-6">
                    {selectedEvent.audiences?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedEvent.audiences.map((a, i) => (
                          <span key={i} style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.5rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#D1A261', border: '1px solid rgba(209,162,97,0.5)', padding: '2px 8px' }}>
                            {a}
                          </span>
                        ))}
                      </div>
                    )}
                    <h2 style={{ fontFamily: '"Cormorant Garamond", Georgia, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(1.4rem, 3vw, 2rem)', lineHeight: 1.2, color: '#fff' }}>
                      {selectedEvent.title}
                    </h2>
                  </div>
                </div>

                {/* Content */}
                <div className="px-8 py-8">
                  <div className="flex flex-wrap gap-x-8 gap-y-3 mb-6 pb-6" style={{ borderBottom: '1px solid #e8e4de' }}>
                    {selectedEvent.dateTime && (
                      <div className="flex items-center gap-2">
                        <CalendarIcon />
                        <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#4a4540' }}>
                          {selectedEvent.dateTime}
                        </span>
                      </div>
                    )}
                    {selectedEvent.location && (
                      <div className="flex items-center gap-2">
                        <PinIcon />
                        <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.6rem', letterSpacing: '0.12em', color: '#4a4540' }}>
                          {selectedEvent.location}
                        </span>
                      </div>
                    )}
                  </div>
                  <p style={{ fontFamily: 'var(--font-raleway), sans-serif', fontWeight: 300, fontSize: '0.95rem', lineHeight: 1.9, color: '#4a4540' }}>
                    {selectedEvent.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

// A different display font AND a different position per cell (both keyed off
// index, not re-randomized on every render, so it's stable across hovers)
// so the grid reads like an editorial mood board rather than a uniform card
// list. Meta text (date/location) intentionally stays off this list and uses
// one consistent font everywhere instead — see META_FONT below. Each layout
// also relocates the meta corners so they never collide with wherever the
// title lands that cell.
//
// Ordering matters here: this is a 3-column grid, so every group of 3
// consecutive entries lands in one row. With 9 layouts total, a naive
// bottom/bottom/bottom.../top/top/top.../middle/middle/middle ordering means
// one whole row always gets the same vertical position (and it did — every
// 3rd row was all "middle"). Each consecutive triplet below is deliberately
// built from one bottom + one top + one middle layout, using three different
// fonts, so no row ever repeats a position or a font across its own cells.
const TITLE_LAYOUTS = [
  { font: { fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 400, fontStyle: 'italic' }, title: 'bottom-6 left-6 right-6 text-left', meta: 'top' },
  { font: { fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 600, fontStyle: 'normal' }, title: 'top-6 left-6 right-6 text-left', meta: 'bottom' },
  { font: { fontFamily: 'var(--font-poppins), sans-serif', fontWeight: 700, fontStyle: 'normal' }, title: 'top-1/2 left-6 right-6 -translate-y-1/2 text-right', meta: 'top' },

  { font: { fontFamily: 'var(--font-spectral), Georgia, serif', fontWeight: 500, fontStyle: 'italic' }, title: 'bottom-6 left-6 right-6 text-right', meta: 'top' },
  { font: { fontFamily: '"Cormorant Garamond", var(--font-cormorant-garamond), Georgia, serif', fontWeight: 400, fontStyle: 'italic' }, title: 'top-6 left-6 right-6 text-right', meta: 'bottom' },
  { font: { fontFamily: 'var(--font-rokkitt), serif', fontWeight: 600, fontStyle: 'normal' }, title: 'top-1/2 left-6 right-6 -translate-y-1/2 text-left', meta: 'top' },

  { font: { fontFamily: 'var(--font-spectral), Georgia, serif', fontWeight: 500, fontStyle: 'italic' }, title: 'bottom-6 left-6 right-6 text-left', meta: 'top' },
  { font: { fontFamily: 'var(--font-cinzel), Georgia, serif', fontWeight: 600, fontStyle: 'normal' }, title: 'top-6 left-6 right-6 text-right', meta: 'bottom' },
  { font: { fontFamily: 'var(--font-playfair), Georgia, serif', fontWeight: 600, fontStyle: 'normal' }, title: 'top-1/2 left-6 right-6 -translate-y-1/2 text-center', meta: 'top' },
];

const META_FONT = { fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.55rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' };

function EventGridCard({ event, index, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const layout = TITLE_LAYOUTS[index % TITLE_LAYOUTS.length];
  const swapCorners = index % 2 === 1;
  const metaSide = layout.meta === 'top' ? 'top-5' : 'bottom-5';

  return (
    <motion.div
      className="relative overflow-hidden cursor-pointer"
      style={{ aspectRatio: '3 / 4' }}
      initial={{ opacity: 0, scale: 0.94, y: 24 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: (index % 6) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen(event)}
    >
      {/* Background image */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${event.image || DEFAULT_EVENT_IMAGE})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          transform: hovered ? 'scale(1.08)' : 'scale(1)',
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 45%, rgba(0,0,0,0.1) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.18)', opacity: hovered ? 1 : 0, transition: 'opacity 0.4s' }} />

      {/* Meta — same font everywhere, corners relocate so they never sit under the title */}
      {event.dateTime && (
        <div className={`absolute flex items-center gap-1.5 ${metaSide} ${swapCorners ? 'right-5 flex-row-reverse' : 'left-5'}`}>
          <CalendarIcon />
          <span style={META_FONT}>{event.dateTime}</span>
        </div>
      )}
      {event.location && (
        <div className={`absolute flex items-center gap-1.5 ${metaSide} ${swapCorners ? 'left-5' : 'right-5 flex-row-reverse'}`}>
          <PinIcon />
          <span style={META_FONT}>{event.location}</span>
        </div>
      )}

      {/* Title — randomized font and position per cell */}
      <div className={`absolute ${layout.title}`}>
        <h3 style={{ ...layout.font, textTransform: 'none', fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)', lineHeight: 1.15, color: '#fff', marginBottom: '10px' }}>
          {event.title}
        </h3>
        <div className="inline-flex items-center gap-2" style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateX(0)' : 'translateX(-6px)', transition: 'opacity 0.3s, transform 0.3s' }}>
          <span style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.55rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#D1A261' }}>View Details</span>
          <svg className="w-3 h-3" style={{ color: '#D1A261' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}
