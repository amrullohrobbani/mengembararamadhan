import { Inter } from "next/font/google";
import "./globals.css";
import { AuthContextProvider } from '@/context/AuthContext'
import { Toaster } from "@/components/ui/toaster"
import AboutDev from "@/components/dashboard/about-devs"

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ramadhan Mengembara",
  description: "Amalan Yaumi Mengembara ke Surga",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
        <Toaster />
        <AboutDev />
      </body>
    </html>
  );
}
