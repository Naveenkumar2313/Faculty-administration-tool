import React, { useEffect, useRef } from "react";
import { Box, Typography, Card } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { T, fontHead, fontBody, fontMono, Fonts } from "./studentShared";

const MOCK_ROUTE_STOPS = [
    { id: 1, name: "HSR Layout Sec 2", lat: 12.9116, lng: 77.6389 },
    { id: 2, name: "HSR BDA Complex", lat: 12.9121, lng: 77.6446 },
    { id: 3, name: "Agara Junction", lat: 12.9234, lng: 77.6404 },
    { id: 4, name: "Koramangala Block 3", lat: 12.9279, lng: 77.6271 },
    { id: 5, name: "Campus Main Gate", lat: 12.9716, lng: 77.5946 },
];

export default function LiveBusTracking() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    // Current bus location simulation
    const busLoc = [12.9180, 77.6420];

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, { zoomControl: false }).setView([12.9234, 77.6350], 13);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png").addTo(map);

        mapInstanceRef.current = map;

        const latLngs = [];

        MOCK_ROUTE_STOPS.forEach((stop, i) => {
            latLngs.push([stop.lat, stop.lng]);
            const isEndpoint = i === 0 || i === MOCK_ROUTE_STOPS.length - 1;
            const color = isEndpoint ? T.accent : T.textSub;

            const marker = L.marker([stop.lat, stop.lng], {
                icon: L.divIcon({
                    className: '',
                    html: `<div style="background:${color}; width:16px; height:16px; border-radius:50%; border:3px solid white; box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
                    iconSize: [16, 16]
                })
            }).addTo(map);

            marker.bindPopup(`<strong style="font-family:${fontHead}">${stop.name}</strong>`);
        });

        // Bus marker
        const busMarker = L.marker(busLoc, {
            icon: L.divIcon({
                className: '',
                html: `<div style="background:${T.info}; color:white; padding:4px; border-radius:8px; border:2px solid white; display:flex; justify-content:center; align-items:center;"><svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg></div>`,
                iconSize: [32, 32]
            })
        }).addTo(map);

        busMarker.bindPopup(`
            <strong style="font-family:${fontHead}">KA-01-HG-1024</strong><br />
            Speed: 32 km/h
        `);

        if (latLngs.length > 1) {
            L.polyline(latLngs, { color: T.accent, weight: 4, opacity: 0.6, dashArray: "8, 8" }).addTo(map);
        }

        return () => { map.remove(); mapInstanceRef.current = null; };
    }, []);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody, display: "flex", flexDirection: "column" }}>
            <style>{Fonts()}</style>

            <Box display="flex" justifyContent="space-between" alignItems="flex-end" mb={3} className="fade-up">
                <Box>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>Bus & Travel</Typography>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Live Bus Tracking</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.85rem", color: T.textSub, mt: 0.4 }}>Route 4 - HSR Layout</Typography>
                </Box>
                <Box sx={{ textAlign: "right" }}>
                    <Typography sx={{ fontFamily: fontMono, fontSize: "0.85rem", fontWeight: 700, color: T.info }}>Expected Arrival: 12 Mins</Typography>
                    <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>Agara Junction</Typography>
                </Box>
            </Box>

            <Card className="fade-up" sx={{ height: "calc(100vh - 180px)", borderRadius: "16px", overflow: "hidden", border: `1px solid ${T.border}`, boxShadow: "0 4px 20px rgba(0,0,0,0.05)", position: "relative", zIndex: 0 }}>
                <div ref={mapRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />
            </Card>
        </Box>
    );
}

