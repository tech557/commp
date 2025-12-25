import type { Metadata } from "next";
// Fix: Replaced Plus_Jakarta_Sans with Inter to resolve module export error
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// Fix: Initializing Inter font as a robust alternative
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "DOTMENT | Enterprise Portal",
  description: "Communication OS for the modern workforce.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark h-full ${inter.variable}`}>
      <body className="h-full font-sans antialiased bg-black text-white selection:bg-[#75E2FF] selection:text-black">
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}