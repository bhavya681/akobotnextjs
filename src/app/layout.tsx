import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "AKOBOT.ai — Custom AI Agent Builder, AI Image & Video Generator",
  description: "Build custom AI agents for support, sales & automation. Generate AI images and videos using 20+ top models. Free plan available. Start today — no code needed.",
  icons: {
    icon: "./icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  verification: {
    google: "JFlYKlzAFreMog8XM4303NiqF3vHpMzV0UpHSVoGKmg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var s=localStorage.getItem("theme");var r=document.documentElement;if(s==="dark")r.classList.add("dark");else{r.classList.remove("dark");if(!s)localStorage.setItem("theme","light")}})();`,
          }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
