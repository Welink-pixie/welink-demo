import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WeLink",
  description: "Connect with opportunities through your network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const validThemes = ["classic", "sage", "forest", "graham", "graham-signature"];
  const appTheme = validThemes.includes(process.env.NEXT_PUBLIC_APP_THEME ?? "")
    ? (process.env.NEXT_PUBLIC_APP_THEME as string)
    : "classic";

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      data-theme={appTheme}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const storedTheme = localStorage.getItem('app-theme');
                if (storedTheme && ['classic', 'sage', 'forest', 'graham', 'graham-signature'].includes(storedTheme)) {
                  document.documentElement.setAttribute('data-theme', storedTheme);
                }
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
