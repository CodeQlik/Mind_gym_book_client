import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: {
    default: "Mind Gym Book | Premium Bookstore & Intellectual Growth",
    template: "%s | Mind Gym Book"
  },
  description: "Discover a curated collection of books at Mind Gym Book. Sharpen your intellect, find inspiration, and elevate your mindset with our premium selection of titles.",
  keywords: ["bookstore", "mind gym", "intellectual growth", "mindset", "premium books", "online library"],
  authors: [{ name: "Mind Gym Book Team" }],
  creator: "Mind Gym Book",
  publisher: "Mind Gym Book",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Mind Gym Book | Premium Bookstore",
    description: "Discover the strength of knowledge and elevate your mindset.",
    url: "https://mindgymbook.com",
    siteName: "Mind Gym Book",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mind Gym Book Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mind Gym Book | Premium Bookstore",
    description: "Discover the strength of knowledge and elevate your mindset.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import ReduxProvider from "@/redux/ReduxProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MainLayout from "@/component/MainLayout";

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        <ReduxProvider>
          <MainLayout>
            {children}
          </MainLayout>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </ReduxProvider>
      </body>
    </html>
  );
}



