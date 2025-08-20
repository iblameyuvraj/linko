import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    display: "swap",
    axes: ["opsz"],
});

// Your Supabase-hosted OG image
const ogImage =
  "https://xeodowtedkqsiedqnbax.supabase.co/storage/v1/object/public/og-image/Charcoal%20Abstract%20Liquid%20Illustration%20Desktop%20Wallpaper.png";

export const metadata: Metadata = {
    title: "Linko",
    description: "we make links simple.",
    openGraph: {
        title: "Linko",
        description: "we make links simple.",
        url: "https://linko.zentha.in", // replace with your deployed URL
        siteName: "Linko",
        images: [
            {
                url: ogImage,
                width: 1200,
                height: 630,
                alt: "Linko - we make links simple.",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Linko",
        description: "we make links simple.",
        images: [ogImage],
    },
    icons: {
        icon: "/loading.svg",
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
                className={`${inter.variable} font-sans antialiased bg-neutral-950 text-white`}
            >
                <Script
                    src="https://cdn.lordicon.com/lordicon.js"
                    strategy="afterInteractive"
                />
                {children}
            </body>
        </html>
    );
}
