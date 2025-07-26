import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/provider/language-provider";
import { LayoutMetadata } from "@/components/layout-metadata";
import { AnalyticsProvider } from "@/components/analytics-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PageStructuredData } from "@/components/page-structured-data";
import { generatePageMetadata } from "@/lib/metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = generatePageMetadata({
  title: "Professional Business Solutions",
  description: "Transform your business with our expert consulting, technology solutions, and 24/7 support. Contact us for tailored business solutions.",
  keywords: ['business solutions', 'consulting', 'technology', '24/7 support', 'business growth', 'professional services'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <AnalyticsProvider>
              <LayoutMetadata />
              <PageStructuredData />
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </AnalyticsProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
