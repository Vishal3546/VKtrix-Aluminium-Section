import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aluminium Section Application",
  description: "Monorepo application built with Next.js and Spring Boot",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AluDesign",
  },
};

import { Poppins } from 'next/font/google';
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} flex min-h-screen bg-background font-sans antialiased`}>
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 overflow-auto bg-slate-50/50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
