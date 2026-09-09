// Classic edit-distance algorithm — no library needed, this is the whole thing.
export function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

// 0..1, where 1 is an exact match.
export function similarity(a: string, b: string): number {
  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;
  return 1 - levenshtein(a, b) / maxLen;
}

// Best match in `candidates` for `query`, or null if nothing clears `threshold`.
export function closestMatch<T>(
  query: string,
  candidates: T[],
  getText: (item: T) => string,
  threshold = 0.78
): { item: T; score: number } | null {
  let best: { item: T; score: number } | null = null;
  for (const item of candidates) {
    const score = similarity(query, getText(item));
    if (!best || score > best.score) best = { item, score };
  }
  return best && best.score >= threshold ? best : null;
}
