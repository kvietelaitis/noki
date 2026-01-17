import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import { shadcn } from '@clerk/themes'
import { ThemeProvider } from "./context/ThemeContext";

export const metadata: Metadata = {
  title: "noki",
  description: "simple habit tracker",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider appearance={{ theme: shadcn, }}>
      <html lang="en" className={geist.variable}>
        <head>
          <meta
            name="viewport"
            content="width=device-width initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, minimum-scale=1.0"
          />
        </head>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
