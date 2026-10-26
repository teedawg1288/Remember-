/** Prevent deployment HTML fallback and gateway errors from surfacing as raw JSON parse noise. */
export async function readApiResponse(response: Response): Promise<Record<string, any>> {
  const contentType = response.headers.get('content-type') || '';
  if (!/\bapplication\/(?:[\w.-]+\+)?json\b/i.test(contentType)) {
    throw new Error(response.ok
      ? 'The app reached a web page instead of the analysis service. Reload the app and try again.'
      : 'The analysis service is unavailable right now. Please try again shortly.');
  }
  try {
    const value: unknown = await response.json();
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('NOT_OBJECT');
    return value as Record<string, any>;
  } catch {
    throw new Error('The analysis service returned an incomplete response. Please retry.');
  }
}
