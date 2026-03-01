import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import ScrollToTop from "@/components/shared/ScrollToTop";

export const metadata: Metadata = {
  title: "EzyRelife — Reset from Within. ReLife for Real.",
  description: "生物节律重整系统。通过 Vitalic D 3 天校准方案，找回身体的掌控感。The Bio-Rhythmic Reset System that reboots your gut, energy, and clarity.",
  keywords: ["EzyRelife", "Vitalic D", "Reset", "Bio-Rhythmic", "Gut Health", "3-Day Reset", "节律校准"],
  openGraph: {
    title: "EzyRelife — Reset from Within. ReLife for Real.",
    description: "3 Days. 1 Reset. A Lifetime of Flow.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <CartProvider>
          {children}
          <ScrollToTop />
        </CartProvider>
      </body>
    </html>
  );
}
