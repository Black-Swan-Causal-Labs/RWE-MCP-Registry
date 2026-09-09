export const resourceTypes = [
  "MCP servers & components", "Skills & collections", "Agents & workflows",
  "Research tools & libraries", "Benchmarks", "Other interfaces",
];

/** An entry may expose more than one resource type. @param {string} kind */
export function resourceTypeBuckets(kind) {
  const buckets = [];
  if (/\b(?:mcp|webmcp)\b/i.test(kind)) buckets.push(resourceTypes[0]);
  if (/\bskills?\b/i.test(kind)) buckets.push(resourceTypes[1]);
  if (/\bagent\b|\bworkflow\b|research assistant/i.test(kind)) buckets.push(resourceTypes[2]);
  if (/research tool|\blibrary\b|\blibraries\b|\bpackage\b/i.test(kind)) buckets.push(resourceTypes[3]);
  if (/benchmark/i.test(kind)) buckets.push(resourceTypes[4]);
  return buckets.length ? buckets : [resourceTypes[5]];
}
