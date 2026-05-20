export interface ToolResult {
  data: unknown;
  sourceUrls?: string[];
  /**
   * Top-level binding directives the agent loop must honour. When a tool
   * returns mandatoryInstructions, the agent will detect them as the
   * first key in the JSON envelope and the loop will refuse to exit
   * before they're acted upon. Use sparingly — reserve for genuine
   * "this work isn't done yet" signals (e.g. `office_edit create` that
   * leaves only a blank scaffold).
   *
   * The agent loop searches for the literal key `_required`, so this
   * field is serialised as `_required` to preserve that contract.
   */
  _required?: unknown;
}

export function formatToolResult(
  data: unknown,
  sourceUrlsOrOpts?: string[] | { sourceUrls?: string[]; mandatoryInstructions?: unknown },
): string {
  // Backwards compat: legacy callers pass a bare string[] for sourceUrls.
  const opts =
    Array.isArray(sourceUrlsOrOpts) || sourceUrlsOrOpts === undefined
      ? { sourceUrls: sourceUrlsOrOpts }
      : sourceUrlsOrOpts;
  const result: ToolResult = { data };
  if (opts.sourceUrls?.length) {
    result.sourceUrls = opts.sourceUrls;
  }
  if (opts.mandatoryInstructions !== undefined) {
    // Place _required FIRST so it's the most prominent key in the
    // stringified envelope the model sees.
    return JSON.stringify({ _required: opts.mandatoryInstructions, ...result });
  }
  return JSON.stringify(result);
}

/**
 * Parse search results from a search provider response.
 * Handles both string and object responses, extracting URLs from results.
 * Supports multiple response shapes from different providers.
 */
export function parseSearchResults(result: unknown): { parsed: unknown; urls: string[] } {
  // Safely parse JSON strings
  let parsed: unknown;
  if (typeof result === 'string') {
    try {
      parsed = JSON.parse(result);
    } catch {
      // If parsing fails, treat the string as the result itself
      parsed = result;
    }
  } else {
    parsed = result;
  }

  // Extract URLs from multiple possible response shapes
  let urls: string[] = [];

  // Shape 1: { results: [{ url: string }] } (Exa format)
  if (parsed && typeof parsed === 'object' && 'results' in parsed) {
    const results = (parsed as { results?: unknown[] }).results;
    if (Array.isArray(results)) {
      urls = results
        .map((r) => (r && typeof r === 'object' && 'url' in r ? (r as { url?: string }).url : null))
        .filter((url): url is string => Boolean(url));
    }
  }
  // Shape 2: [{ url: string }] (direct array, Tavily format)
  else if (Array.isArray(parsed)) {
    urls = parsed
      .map((r) => (r && typeof r === 'object' && 'url' in r ? (r as { url?: string }).url : null))
      .filter((url): url is string => Boolean(url));
  }

  return { parsed, urls };
}
