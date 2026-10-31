import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpeakLevel — English Speaking Assessment",
  description: "AI-powered English speaking assessment platform for language schools. Placement tests and speaking evaluation based on Speakout 3rd Edition.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
