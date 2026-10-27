import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import type { Request, Response } from 'express';
import { createAiRateLimiter } from '../src/server/aiRateLimiter.ts';

function call(limiter: ReturnType<typeof createAiRateLimiter>, ip: string) {
  const state: { allowed: boolean; status: number; retryAfter: string | null } = {
    allowed: false, status: 200, retryAfter: null,
  };
  const req = { ip, socket: { remoteAddress: ip } } as unknown as Request;
  const response = {
    setHeader(name: string, value: string) {
      if (name.toLowerCase() === 'retry-after') state.retryAfter = value;
      return response;
    },
    status(status: number) {
      state.status = status;
      return response;
    },
    json(_payload: unknown) {
      return response;
    },
  };
  limiter(req, response as unknown as Response, () => {
    state.allowed = true;
  });
  return state;
}

test('throttles an individual IP without blocking an unrelated IP', () => {
  const limiter = createAiRateLimiter({ perIpPerMinute: 2, totalPerMinute: 10, now: () => 1_000 });
  assert.equal(call(limiter, '10.0.0.1').allowed, true);
  assert.equal(call(limiter, '10.0.0.1').allowed, true);
  const denied = call(limiter, '10.0.0.1');
  assert.equal(denied.status, 429);
  assert.equal(denied.allowed, false);
  assert.equal(denied.retryAfter, '60');
  assert.equal(call(limiter, '10.0.0.2').allowed, true);
});

test('global cap still blocks IP rotation', () => {
  const limiter = createAiRateLimiter({ perIpPerMinute: 4, totalPerMinute: 2, now: () => 1_000 });
  assert.equal(call(limiter, '10.0.0.1').allowed, true);
  assert.equal(call(limiter, '10.0.0.2').allowed, true);
  assert.equal(call(limiter, '10.0.0.3').status, 429);
});

test('limits reset after the fixed window expires', () => {
  let time = 1_000;
  const limiter = createAiRateLimiter({ perIpPerMinute: 1, totalPerMinute: 1, now: () => time });
  assert.equal(call(limiter, '10.0.0.1').allowed, true);
  assert.equal(call(limiter, '10.0.0.1').status, 429);
  time += 60_001;
  assert.equal(call(limiter, '10.0.0.1').allowed, true);
});

test('compiled server security parity is maintained for Studio deployments', () => {
  const compiled = readFileSync(new URL('../server.js', import.meta.url), 'utf8');
  assert.match(compiled, /REMEMBER_RATE_LIMIT/);
  assert.match(compiled, /createAiRateLimiter/);
  assert.match(compiled, /app\.all\("\/api\/user-memory\/:userId"/);
  assert.doesNotMatch(compiled, /app\.use\(cors\(\)\)/);
  assert.doesNotMatch(compiled, /userMemoryStore/);
});
