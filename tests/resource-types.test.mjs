import test from 'node:test';
import assert from 'node:assert/strict';
import { resourceTypeBuckets } from '../data/resource-types.mjs';

test('mixed resources appear under each applicable type without hiding their components', () => {
  assert.deepEqual(resourceTypeBuckets('MCP server + skill collection'), ['MCP servers & components', 'Skills & collections']);
  assert.deepEqual(resourceTypeBuckets('WebMCP + remote MCP bridge'), ['MCP servers & components']);
  assert.deepEqual(resourceTypeBuckets('R package + agent integration'), ['Agents & workflows', 'Research tools & libraries']);
  assert.deepEqual(resourceTypeBuckets('Research benchmark'), ['Benchmarks']);
  assert.deepEqual(resourceTypeBuckets('Hosted research interface'), ['Other interfaces']);
});
