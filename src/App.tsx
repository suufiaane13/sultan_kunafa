import { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { LocaleProvider } from "@/context/LocaleContext";
import { CartProvider } from "@/context/CartContext";
import { useMoroccoTheme } from "@/hooks/useMoroccoTheme";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SplashScreen } from "@/components/SplashScreen";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingSocial } from "@/components/FloatingSocial";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LanguagePicker } from "@/components/LanguagePicker";
import { RouteSkeleton } from "@/components/RouteSkeleton";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";

const Menu = lazy(() => import("@/pages/Menu").then((m) => ({ default: m.Menu })));
const About = lazy(() => import("@/pages/About").then((m) => ({ default: m.About })));

function App() {
  const [showSplash, setShowSplash] = useState(true);
  useMoroccoTheme();

  return (
    <>
      {showSplash && (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      )}
      <div
        className="min-h-screen bg-[var(--color-cream)]"
        style={{
          opacity: showSplash ? 0 : 1,
          visibility: showSplash ? "hidden" : "visible",
          transition: "opacity 0.25s ease-out",
        }}
        aria-hidden={showSplash}
      >
        <LocaleProvider>
          <CartProvider>
            <ScrollToTop />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <Suspense fallback={<RouteSkeleton />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/about" element={<About />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </main>
              <Footer />
            </div>
            <CartDrawer />
            <FloatingSocial />
            <LanguagePicker />
          </CartProvider>
        </LocaleProvider>
      </div>
    </>
  );
}

export default App;
