/**
 * Thème clair/sombre automatique selon l'heure au Maroc (Africa/Casablanca).
 * Clair : 6h–20h | Sombre : 20h–6h
 */

import { useEffect } from "react";

const TIMEZONE = "Africa/Casablanca";
const LIGHT_START_HOUR = 6;
const LIGHT_END_HOUR = 20;

function getHourInMorocco(): number {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    hour: "numeric",
    hour12: false,
  });
  return parseInt(formatter.format(new Date()), 10);
}

function isLightTheme(): boolean {
  const hour = getHourInMorocco();
  return hour >= LIGHT_START_HOUR && hour < LIGHT_END_HOUR;
}

export function useMoroccoTheme() {
  useEffect(() => {
    const apply = () => {
      const light = isLightTheme();
      if (light) {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    };

    apply();
    const interval = setInterval(apply, 60_000);
    return () => clearInterval(interval);
  }, []);
}
