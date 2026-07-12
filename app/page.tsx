import type { Metadata } from "next";
import { RegistryExplorer } from "./registry-explorer";

export const metadata: Metadata = {
  title: "RWE MCP Registry | Black Swan Causal Labs",
  description: "An indexed catalogue of MCP servers, agent skills, libraries, and agents for real-world evidence workflows.",
};

export default function Home() {
  return <RegistryExplorer />;
}
