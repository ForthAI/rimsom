import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rimsom Global | Advisory Services",
  description:
    "Trusted relationships that shape global outcomes. Rimsom Global provides strategic advisory services across emerging markets — bridging capital, leadership, and legacy.",
  icons: {
    icon: "/globe-64x64.png",
    apple: "/globe-64x64.png",
  },
  openGraph: {
    title: "Rimsom Global | Advisory Services",
    description:
      "Trusted relationships that shape global outcomes. Capital. Leadership. Legacy.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
