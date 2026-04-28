import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Montserrat_Alternates, Share_Tech_Mono } from "next/font/google";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
});

const montserratAlternates = Montserrat_Alternates({
  variable: "--font-montserrat-alt",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
});

// Substitute for the proprietary "Digital Numbers" Figma font.
// To use the real font, drop DigitalNumbers.woff2 (non-empty) at public/fonts/
// and re-add the @font-face block in globals.css; --font-display will pick it up.
const digitalNumbers = Share_Tech_Mono({
  variable: "--font-digital-numbers",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "SSA 2025",
  description: "Sun* Annual Awards & Sun* Kudos 2025",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${montserratAlternates.variable} ${digitalNumbers.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.cdnfonts.com" />
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/ds-digital"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
