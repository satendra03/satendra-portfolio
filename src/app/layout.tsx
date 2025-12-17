import type { Metadata } from "next";
import "./globals.css";
import HeaderWrapper from "@/components/layout/header-wrapper";
import { Toaster } from "@/components/ui/sonner";

import { AuthProvider } from "@/context/auth-context";

export const metadata: Metadata = {
  title: "Satendra Kumar Parteti | Portfolio",
  description: "Portfolio of Satendra Kumar Parteti - Software Developer, Designer, and Creator.",
};

import { Poppins } from "next/font/google";
import { Anton } from "next/font/google";

const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const anton = Anton({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-anton",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased ${poppins.variable} ${anton.variable} font-sans`}
      >
        <AuthProvider>
          <HeaderWrapper />
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
