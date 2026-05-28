import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "PersonaVault AI",
    template: "%s | PersonaVault AI",
  },
  description:
    "A personal identity, document vault, proof-pack sharing, and AI authenticity checker for the AI era.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
