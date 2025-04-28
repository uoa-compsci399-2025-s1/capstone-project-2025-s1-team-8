/**
 * Builds a URL with query parameters.
 * 
 * @param base The base URL to which the query parameters will be appended.
 * @param params An object representing the query parameters to be added to the URL.
 * @returns The constructed URL with the query parameters.
 */

export function buildNextResponseURL(
  base: string, 
  params: Record<string, string | number | undefined>
): string {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) query.append(key, value.toString());
  });
  return query.toString() ? `${base}?${query}` : base;
}

