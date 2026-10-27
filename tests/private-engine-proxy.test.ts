import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import type { Request, Response } from 'express';
import { PRIVATE_ENGINE_ROUTES, createPrivateEngineProxy } from '../src/server/privateEngineProxy.ts';

function request(path = '/api/discovery/analyze', body: unknown = { userInput: 'What changes?' }) {
  return {
    method: 'POST',
    path,
    originalUrl: path + '?client-tracking=never-forward',
    body,
    headers: {
      cookie: 'private-user-session=do-not-forward',
      authorization: 'Bearer browser-token-do-not-forward',
    },
  } as unknown as Request;
}

function response() {
  const result: { status: number; body: unknown; headers: Record<string, string>; next: boolean } = {
    status: 200,
    body: null,
    headers: {},
    next: false,
  };
  const res = {
    status(code: number) { result.status = code; return res; },
    json(value: unknown) { result.body = value; return res; },
    setHeader(name: string, value: string) { result.headers[name] = value; return res; },
  } as unknown as Response;
  return { res, result };
}

test('public route contract contains only the six known AI operations', () => {
  assert.equal(PRIVATE_ENGINE_ROUTES.length, 6);
  assert.ok(PRIVATE_ENGINE_ROUTES.includes('/api/discovery/analyze'));
  assert.ok(PRIVATE_ENGINE_ROUTES.includes('/api/same-story/cross-examine'));
});

test('local mode preserves existing server routes and never calls the private backend', async () => {
  let contacted = false;
  const proxy = createPrivateEngineProxy({
    mode: undefined,
    baseUrl: 'https://engine.example/',
    token: 'secret',
    fetchImpl: async () => { contacted = true; return Response.json({}); },
  });
  const { res, result } = response();
  await proxy(request(), res, () => { result.next = true; });
  assert.equal(result.next, true);
  assert.equal(contacted, false);
});

test('proxy mode forwards only JSON and a server-only bearer token to a fixed HTTPS host', async () => {
  let outboundUrl = '';
  let outboundInit: RequestInit | undefined;
  const proxy = createPrivateEngineProxy({
    mode: 'proxy',
    baseUrl: 'https://engine.example/',
    token: 'server-secret-only',
    fetchImpl: async (input, init) => {
      outboundUrl = String(input);
      outboundInit = init;
      return Response.json({ success: true, bridge: 'ready' }, { status: 201 });
    },
  });
  const { res, result } = response();
  await proxy(request('/api/discovery/analyze', { userInput: 'Explain this' }), res, () => { result.next = true; });
  assert.equal(outboundUrl, 'https://engine.example/api/discovery/analyze');
  assert.equal(outboundInit?.method, 'POST');
  assert.equal(outboundInit?.redirect, 'error');
  assert.equal(new Headers(outboundInit?.headers).get('authorization'), 'Bearer server-secret-only');
  assert.equal(new Headers(outboundInit?.headers).get('cookie'), null);
  assert.deepEqual(JSON.parse(String(outboundInit?.body)), { userInput: 'Explain this' });
  assert.equal(result.status, 201);
  assert.deepEqual(result.body, { success: true, bridge: 'ready' });
  assert.equal(result.next, false);
});

test('proxy mode fails closed when its token or HTTPS URL is missing or invalid', async () => {
  for (const invalid of [
    { baseUrl: 'https://engine.example/', token: '' },
    { baseUrl: 'http://engine.example/', token: 'secret' },
    { baseUrl: 'https://engine.example/other', token: 'secret' },
    { baseUrl: 'https://user:pass@engine.example/', token: 'secret' },

  ]) {
    let contacted = false;
    const proxy = createPrivateEngineProxy({
      mode: 'proxy',
      ...invalid,
      fetchImpl: async () => { contacted = true; return Response.json({}); },
    });
    const { res, result } = response();
    await proxy(request(), res, () => { result.next = true; });
    assert.equal(result.status, 503);
    assert.equal(result.next, false);
    assert.equal(contacted, false);
    assert.doesNotMatch(JSON.stringify(result.body), /secret/i);
  }
});

test('an unrecognized engine mode fails closed instead of exposing the local engine', async () => {
  const proxy = createPrivateEngineProxy({ mode: 'prxoy', baseUrl: 'https://engine.example/', token: 'token' });
  const { res, result } = response();
  await proxy(request(), res, () => { result.next = true; });
  assert.equal(result.status, 503);
  assert.equal(result.next, false);
});

test('upstream outage returns a generic failure and never exposes credentials', async () => {
  const proxy = createPrivateEngineProxy({
    mode: 'proxy',
    baseUrl: 'https://engine.example/',
    token: 'top-secret',
    fetchImpl: async () => { throw new Error('top-secret provider trace'); },
  });
  const { res, result } = response();
  await proxy(request(), res, () => { result.next = true; });
  assert.equal(result.status, 502);
  assert.doesNotMatch(JSON.stringify(result.body), /top-secret/);
});

test('non-JSON backend responses are rejected', async () => {
  const proxy = createPrivateEngineProxy({
    mode: 'proxy',
    baseUrl: 'https://engine.example/',
    token: 'token',
    fetchImpl: async () => new Response('<html>error</html>', { status: 502, headers: { 'content-type': 'text/html' } }),
  });
  const { res, result } = response();
  await proxy(request(), res, () => { result.next = true; });
  assert.equal(result.status, 502);
  assert.equal((result.body as { code: string }).code, 'REMEMBER_PRIVATE_ENGINE_RESPONSE');
});

test('bundled Studio runtime includes the same optional private-engine boundary', () => {
  const compiled = readFileSync(new URL('../server.js', import.meta.url), 'utf8');
  for (const route of PRIVATE_ENGINE_ROUTES) assert.ok(compiled.includes(route));
  assert.match(compiled, /createPrivateEngineProxy/);
  assert.match(compiled, /REMEMBER_PRIVATE_ENGINE_MODE/);
  assert.match(compiled, /REMEMBER_PRIVATE_ENGINE_TOKEN/);
});
