/**
 * Mode sombre 24h/24 — le site reste toujours en thème sombre.
 */

import { useEffect } from "react";

export function useMoroccoTheme() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);
}
