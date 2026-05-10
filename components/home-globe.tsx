"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const World = dynamic(() => import("@/components/ui/globe").then((m) => m.World), {
  ssr: false,
});

export function HomeGlobe() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const globeConfig = {
    pointSize: 4,
    globeColor: isDark ? "#1c1917" : "#ffffff",
    showAtmosphere: true,
    atmosphereColor: isDark ? "#e7e5e4" : "#e5e5e5",
    atmosphereAltitude: 0.1,
    emissive: isDark ? "#0c0a09" : "#f5f5f5",
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
    ambientLight: isDark ? "#d6d3d1" : "#ffffff",
    directionalLeftLight: isDark ? "#ffffff" : "#a8a29e",
    directionalTopLight: isDark ? "#ffffff" : "#a8a29e",
    pointLight: isDark ? "#ffffff" : "#a8a29e",
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  };

  const pointColor = isDark ? "#ffffff" : "#000000";

  const sampleArcs = [
    { order: 1, startLat: -19.8855, startLng: -43.9511, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.1, color: pointColor },
    { order: 1, startLat: 28.6139, startLng: 77.209, endLat: 3.139, endLng: 101.6869, arcAlt: 0.2, color: pointColor },
    { order: 1, startLat: -19.8855, startLng: -43.9511, endLat: -1.3033, endLng: 36.8265, arcAlt: 0.5, color: pointColor },
    { order: 2, startLat: 1.3521, startLng: 103.8198, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.2, color: pointColor },
    { order: 2, startLat: 51.5072, startLng: -0.1276, endLat: 3.139, endLng: 101.6869, arcAlt: 0.3, color: pointColor },
    { order: 2, startLat: -15.7938, startLng: -47.8827, endLat: -14.2350, endLng: -51.9252, arcAlt: 0.1, color: pointColor },
    { order: 3, startLat: -33.8688, startLng: 151.2093, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: pointColor },
    { order: 3, startLat: 21.3069, startLng: -157.8583, endLat: 40.7128, endLng: -74.006, arcAlt: 0.3, color: pointColor },
    { order: 3, startLat: -22.9068, startLng: -43.1729, endLat: 28.6139, endLng: 77.209, arcAlt: 0.7, color: pointColor },
    { order: 4, startLat: 34.0522, startLng: -118.2437, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.5, color: pointColor },
    { order: 4, startLat: -39.08, startLng: -62.13, endLat: 40.7128, endLng: -74.006, arcAlt: 0.3, color: pointColor },
    { order: 4, startLat: 35.6762, startLng: 139.6503, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: pointColor },
  ];

  if (!mounted) return null;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <World globeConfig={globeConfig} data={sampleArcs} />
    </div>
  );
}
