import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RWE MCP Registry | Black Swan Causal Labs",
  description: "A practitioner-curated index of MCP servers and agent skills for real-world evidence workflows.",
  metadataBase: new URL("https://blackswancausallabs.com"),
  openGraph: { title: "The RWE MCP Registry", description: "Research infrastructure for real-world evidence workflows.", type: "website", images: [{ url: "/og.png", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "The RWE MCP Registry", description: "Research infrastructure for real-world evidence workflows.", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
