import type { RequestHandler } from 'express';

/**
 * Public API paths that may be handled by the private REMEMBER engine.
 * These names are part of the public client contract, not the reasoning logic.
 */
export const PRIVATE_ENGINE_ROUTES = [
  '/api/discovery/analyze',
  '/api/same-story/analyze',
  '/api/same-story/cross-examine',
  '/api/same-story/predict',
  '/api/same-story/era-translate',
  '/api/same-story/simulate-what-if',
] as const;

const allowed = new Set<string>(PRIVATE_ENGINE_ROUTES);
const MAX_RESPONSE_BYTES = 1_000_000;

type PrivateEngineConfig = {
  mode: string | undefined;
  baseUrl: string | undefined;
  token: string | undefined;
  fetchImpl?: typeof fetch;
};

function secureOrigin(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password ||
        url.pathname !== '/' || url.search || url.hash) return null;
    return url.origin;
  } catch {
    return null;
  }
}

/**
 * A non-breaking staging seam: local is the default and existing handlers remain
 * untouched. Setting mode=proxy enables private execution. Partial/invalid
 * config fails closed; the public server never falls back to local reasoning.
 *
 * Only the server sends the bearer secret. Cookies, client authorization
 * headers, request query strings, and arbitrary target URLs are not forwarded.
 */
export function createPrivateEngineProxy(config: PrivateEngineConfig): RequestHandler {
  const mode = config.mode?.trim() || 'local';
  const origin = secureOrigin(config.baseUrl);
  const token = config.token?.trim() || '';
  const upstreamFetch = config.fetchImpl || fetch;

  return async (req, res, next) => {
    if (!allowed.has(req.path)) {
      next();
      return;
    }
    if (mode === 'local') {
      next();
      return;
    }
    if (mode !== 'proxy' || !origin || !token) {
      res.status(503).json({
        success: false,
        code: 'REMEMBER_PRIVATE_ENGINE_NOT_CONFIGURED',
        error: 'REMEMBER is temporarily unavailable.',
      });
      return;
    }

    try {
      const upstream = await upstreamFetch(origin + req.path, {
        method: 'POST',
        redirect: 'error',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify(req.body ?? {}),
        signal: AbortSignal.timeout(25_000),
      });
      const contentType = upstream.headers.get('content-type') || '';
      const declaredSize = Number(upstream.headers.get('content-length') || '0');
      if (!contentType.toLowerCase().includes('application/json') ||
          (Number.isFinite(declaredSize) && declaredSize > MAX_RESPONSE_BYTES)) {
        res.status(502).json({
          success: false,
          code: 'REMEMBER_PRIVATE_ENGINE_RESPONSE',
          error: 'REMEMBER could not complete that request.',
        });
        return;
      }
      const raw = await upstream.text();
      if (Buffer.byteLength(raw, 'utf8') > MAX_RESPONSE_BYTES) {
        res.status(502).json({
          success: false,
          code: 'REMEMBER_PRIVATE_ENGINE_RESPONSE',
          error: 'REMEMBER could not complete that request.',
        });
        return;
      }
      const data = JSON.parse(raw);
      res.setHeader('Cache-Control', 'no-store');
      res.status(upstream.status).json(data);
    } catch {
      res.status(502).json({
        success: false,
        code: 'REMEMBER_PRIVATE_ENGINE_UNAVAILABLE',
        error: 'REMEMBER could not reach its analysis service. Please try again.',
      });
    }
  };
}
