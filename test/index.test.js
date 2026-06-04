import test from "node:test";
import assert from "node:assert/strict";
import { GatewayPolicy } from "../src/index.js";
test("rate limits requests", () => {
  const g = new GatewayPolicy([{ path: "/api", rate: 1 }]);
  assert.equal(g.decide({ path: "/api", ip: "1" }).allow, true);
  assert.equal(g.decide({ path: "/api", ip: "1" }).status, 429);
});
