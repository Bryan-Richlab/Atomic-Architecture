import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Audit Binary | Bryan Richmaker",
  description: "Découvrez quelle étape de votre business vous coûte le plus de temps et d'argent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="antialiased min-h-screen bg-background">
        {children}
      </body>
    </html>
  );
}
