import AuthProvider from "@/providers/AuthProvider";
// import Navbar from "@/src/components/NavBar";
import { Geist, Geist_Mono } from "next/font/google";
import "../../../app/globals.css";


import { SidebarDemoDonor } from "@/src/components/DonorSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <SidebarDemoDonor></SidebarDemoDonor>
            
            {/* Main content area */}
            <div className="flex-1 p-4">{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
