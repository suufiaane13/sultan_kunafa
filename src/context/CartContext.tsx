import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { getWhatsAppUrl } from "@/content/site";
import { buildOrderMessage, type OrderLine } from "@/content/translations";
import { useLocale } from "@/context/LocaleContext";
import { Toast } from "@/components/Toast";

const CART_STORAGE_KEY = "sultan-kunafa-cart";

export interface CartItem {
  id: string;
  name: string;
  priceDisplay: string;
  priceAmount: number;
  quantity: number;
}

function isValidCartItem(x: unknown): x is CartItem {
  return (
    typeof x === "object" &&
    x !== null &&
    "id" in x &&
    "name" in x &&
    "priceDisplay" in x &&
    "priceAmount" in x &&
    "quantity" in x &&
    typeof (x as CartItem).quantity === "number" &&
    (x as CartItem).quantity >= 0
  );
}

function getCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidCartItem);
  } catch {
    return [];
  }
}

function saveCartToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // ignore quota / private mode
  }
}

interface CartContextValue {
  items: CartItem[];
  totalCount: number;
  totalAmount: number;
  orderLines: OrderLine[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  getWhatsAppOrderUrl: () => string;
  /** true juste après un addItem, pour animation icône panier (reset après ~500ms) */
  cartBump: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const { locale, t } = useLocale();

  // Charger le panier depuis localStorage au montage (côté client)
  useEffect(() => {
    setItems(getCartFromStorage());
    setHydrated(true);
  }, []);

  // Sauvegarder le panier à chaque modification
  useEffect(() => {
    if (!hydrated) return;
    saveCartToStorage(items);
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, "quantity">, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setToastMessage(t("cart.addedToCart"));
    setCartBump(true);
  }, [t]);

  useEffect(() => {
    if (!cartBump) return;
    const t = setTimeout(() => setCartBump(false), 500);
    return () => clearTimeout(t);
  }, [cartBump]);

  const updateQuantity = useCallback((id: string, delta: number) => {
    setItems((prev) => {
      const next = prev.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
      );
      return next.filter((i) => i.quantity > 0);
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setIsOpen(false);
  }, []);

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = items.reduce((sum, i) => sum + i.quantity * i.priceAmount, 0);

  const orderLines: OrderLine[] = items.map((i) => ({
    name: t(`products.${i.id}.name`) || i.name,
    quantity: i.quantity,
    priceDisplay: `${i.priceAmount} ${t("currency")}`,
    priceAmount: i.priceAmount,
  }));

  const getWhatsAppOrderUrl = useCallback(() => {
    const message = buildOrderMessage(locale ?? "fr", orderLines);
    return getWhatsAppUrl(message);
  }, [items, locale, orderLines]);

  const value: CartContextValue = {
    items,
    totalCount,
    totalAmount,
    orderLines,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    getWhatsAppOrderUrl,
    cartBump,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <Toast
        message={toastMessage ?? ""}
        visible={!!toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
