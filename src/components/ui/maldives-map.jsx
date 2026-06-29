'use client';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const goldPulse = `
  @keyframes mapPulse {
    0%   { transform: scale(1);   opacity: 1; }
    70%  { transform: scale(2.8); opacity: 0; }
    100% { transform: scale(1);   opacity: 0; }
  }
`;

const goldMarkerIcon = new L.DivIcon({
    className: '',
    html: `
        <style>${goldPulse}</style>
        <div style="position:relative;width:20px;height:20px;">
            <div style="position:absolute;inset:0;background:rgba(209,162,97,0.25);border-radius:50%;animation:mapPulse 2.2s ease-out infinite;"></div>
            <div style="position:absolute;inset:4px;background:#D1A261;border-radius:50%;border:2px solid rgba(255,255,255,0.6);box-shadow:0 0 0 3px rgba(209,162,97,0.35);"></div>
        </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

function MapControls() {
    const map = useMap();
    return (
        <div style={{ position: 'absolute', bottom: 12, right: 12, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {['+', '−'].map((label, i) => (
                <button
                    key={label}
                    onClick={() => i === 0 ? map.zoomIn() : map.zoomOut()}
                    style={{ width: 28, height: 28, background: 'rgba(10,10,10,0.85)', border: '1px solid rgba(209,162,97,0.3)', color: '#D1A261', fontSize: '1rem', lineHeight: 1, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(209,162,97,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(10,10,10,0.85)'}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

export default function MaldivesMap({ lat, lng }) {
    const position = [lat ?? 3.2028, lng ?? 73.2207];
    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <MapContainer
                center={position}
                zoom={1}
                style={{ height: '100%', width: '100%', background: '#0a0a0a' }}
                zoomControl={false}
                attributionControl={false}
                scrollWheelZoom={false}
                dragging={true}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    subdomains="abcd"
                    maxZoom={19}
                />
                <Marker position={position} icon={goldMarkerIcon} />
                <MapControls />
            </MapContainer>
            <div style={{ position: 'absolute', bottom: 8, left: 10, zIndex: 1000, fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '0.42rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', pointerEvents: 'none' }}>
                © CARTO · OpenStreetMap
            </div>
        </div>
    );
}
