import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Remonte en haut de la page à chaque changement de route, ou scroll vers #featured si présent. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash === "#featured") {
      const el = document.getElementById("featured");
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}
