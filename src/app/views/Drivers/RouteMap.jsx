import React, { useEffect, useRef } from "react";
import { Box, Card, Typography } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { T, fontHead, fontBody, fontMono, Fonts, routeStops } from "./driverShared";

export default function RouteMap() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!mapRef.current || mapInstanceRef.current) return;

        const map = L.map(mapRef.current, { zoomControl: true }).setView([12.9216, 77.6246], 13);

        L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        mapInstanceRef.current = map;

        const latLngs = [];

        routeStops.forEach((stop, index) => {
            latLngs.push([stop.lat, stop.lng]);
            const marker = L.marker([stop.lat, stop.lng], {
                icon: L.divIcon({
                    className: '',
                    html: `<div style="background:${T.accent}; color:white; font-family:${fontMono}; font-weight:700; font-size:12px; width:24px; height:24px; display:flex; align-items:center; justify-content:center; border-radius:50%; border:2px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.2);">${index + 1}</div>`,
                    iconSize: [24, 24]
                })
            }).addTo(map);

            marker.bindPopup(`
                <div style="font-family:${fontBody}">
                    <strong>${stop.name}</strong><br/>
                    Time: ${stop.time}<br/>
                    Expected Pax: ${stop.boarded}
                </div>
            `);
        });

        if (latLngs.length > 1) {
            L.polyline(latLngs, { color: T.accent, weight: 4, opacity: 0.7 }).addTo(map);
            map.fitBounds(L.latLngBounds(latLngs));
        }

        return () => { map.remove(); mapInstanceRef.current = null; };
    }, []);

    return (
        <Box sx={{ p: 3, background: T.bg, minHeight: "100vh", fontFamily: fontBody }}>
            <style>{Fonts()}</style>

            <Box mb={3} className="fade-up">
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMute, mb: 0.3 }}>My Routes & Schedule</Typography>
                <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "1.5rem", color: T.text, lineHeight: 1.1 }}>Route Map</Typography>
                <Typography sx={{ fontFamily: fontBody, fontSize: "0.82rem", color: T.textSub, mt: 0.4 }}>Interactive map of your assigned route with stop details.</Typography>
            </Box>

            <Card className="fade-up" sx={{ borderRadius: "14px", border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden", position: "relative", height: "calc(100vh - 180px)" }}>
                <div ref={mapRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />
                <Box sx={{ position: "absolute", top: 16, right: 16, bgcolor: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)", px: 2, py: 1.5, borderRadius: "10px", border: `1px solid ${T.border}`, zIndex: 1000, minWidth: 200 }}>
                    <Typography sx={{ fontFamily: fontHead, fontWeight: 700, fontSize: "0.9rem", color: T.text, mb: 1 }}>Route 4 Overview</Typography>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>Total Stops:</Typography>
                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", fontWeight: 700, color: T.text }}>{routeStops.length}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography sx={{ fontFamily: fontBody, fontSize: "0.75rem", color: T.textSub }}>Estimated Length:</Typography>
                        <Typography sx={{ fontFamily: fontMono, fontSize: "0.75rem", fontWeight: 700, color: T.text }}>14.2 km</Typography>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
}
