import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Gary Johnson | Developer, Musician, Operations Leader",
    template: "%s | Gary Johnson",
  },
  description:
    "Full stack developer, jazz bassist, and functional operations leader. Building software, making music, and leading sustainable fashion operations.",
  keywords: [
    "Gary Johnson",
    "Full Stack Developer",
    "Jazz Bassist",
    "Software Engineer",
    "Mira Blackman",
    "San Francisco",
    "Bay Area",
  ],
  authors: [{ name: "Gary Johnson" }],
  creator: "Gary Johnson",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jazzbassjohnson.com",
    siteName: "Gary Johnson",
    title: "Gary Johnson | Developer, Musician, Operations Leader",
    description:
      "Full stack developer, jazz bassist, and functional operations leader.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gary Johnson | Developer, Musician, Operations Leader",
    description:
      "Full stack developer, jazz bassist, and functional operations leader.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
