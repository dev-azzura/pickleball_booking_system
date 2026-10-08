import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PickleCourt | Pickleball Court Booking",
  description: "Discover indoor and outdoor pickleball courts, explore available schedules, and plan your next game with PickleCourt.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-screen flex-col">
        {children}
      </body>
    </html>
  );
}
