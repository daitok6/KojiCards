import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: {
    default: "KojiCards — Trading Card Vendor",
    template: "%s | KojiCards",
  },
  description:
    "Browse rare and premium trading cards from KojiCards — Pokémon, Magic: The Gathering, Yu-Gi-Oh!, and more.",
  openGraph: {
    siteName: "KojiCards",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Navbar />
        <main>{children}</main>
        <footer className="border-t border-white/5 mt-24 py-10 text-center text-sm text-white/30">
          <p>© {new Date().getFullYear()} KojiCards. All rights reserved.</p>
          <p className="mt-1">
            Interested in a card?{" "}
            <a href="/contact" className="text-purple-400 hover:text-purple-300 underline">
              Contact us
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
