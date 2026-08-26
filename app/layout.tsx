import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.GITHUB_PAGES === "true"
  ? "https://black-swan-causal-labs.github.io/RWE-MCP-Registry/"
  : "https://blackswancausallabs.com";
const socialImageUrl = new URL("og.png", siteUrl).toString();

export const metadata: Metadata = {
  title: "RWE MCP Registry | Black Swan Causal Labs",
  description: "A practitioner-curated index of MCP servers and agent skills for real-world evidence workflows.",
  metadataBase: new URL(siteUrl),
  openGraph: { title: "The RWE MCP Registry", description: "Research infrastructure for real-world evidence workflows.", type: "website", images: [{ url: socialImageUrl, width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", title: "The RWE MCP Registry", description: "Research infrastructure for real-world evidence workflows.", images: [socialImageUrl] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
