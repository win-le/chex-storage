import { standardizeCharacter } from "utils/function";

export function bitapFuzzyBitwiseSearch(
  text: string,
  pattern: string,
  k: number
) {
  if (pattern.length === 0) return text;
  if (pattern.length > 31) return null;

  const m = pattern.length;
  const patternMask = Array.from({ length: 256 }, () => ~0n); // 64-bit unsigned integer array
  const R = Array.from({ length: k + 1 }, () => ~0n);

  // Initialize the pattern bitmasks
  for (let i = 0; i < m; i++) {
    patternMask[pattern.charCodeAt(i)] &= ~(1n << BigInt(i));
  }

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    let oldRd1 = R[0];

    R[0] |= patternMask[charCode];
    R[0] <<= 1n;

    for (let d = 1; d <= k; d++) {
      const tmp = R[d];
      R[d] = (oldRd1 & (R[d] | patternMask[charCode])) << 1n;
      oldRd1 = tmp;
    }

    if ((R[k] & (1n << BigInt(m))) === 0n) {
      return text.slice(i - m + 1, i + 1);
    }
  }

  return null;
}

export default function bitapSearch(
  text: string,
  pattern: string,
  approximed: number = 0.5 // 0 -> 1
) {
  return bitapFuzzyBitwiseSearch(
    " " + standardizeCharacter(text),
    standardizeCharacter(pattern),
    pattern.length - Math.round(pattern.length * approximed)
  );
}
