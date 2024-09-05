import { standardizeCharacter } from "utils/function";

function search(text: string, pattern: string, maxErrors: number) {
  const patternLength = pattern.length;
  const textLength = text.length;

  // Edge cases
  if (patternLength === 0) return 0;
  if (textLength === 0 || patternLength > textLength) return -1;

  // Initialize the bit masks
  const bitMasks = new Array(256).fill(0);
  for (let i = 0; i < patternLength; i++) {
    bitMasks[pattern.charCodeAt(i)] |= 1 << i;
  }

  // Initialize the current and previous masks for error tracking
  let currentMask = 0;
  const previousMasks = new Array(maxErrors + 1).fill(0);

  for (let i = 0; i <= maxErrors; i++) {
    previousMasks[i] = (1 << i) - 1;
  }

  for (let i = 0; i < textLength; i++) {
    const charCode = text.charCodeAt(i);
    currentMask = previousMasks[0] | bitMasks[charCode];
    previousMasks[0] = currentMask << 1;

    for (let j = 1; j <= maxErrors; j++) {
      const insertOrDelete = previousMasks[j - 1] | (currentMask << 1);
      const substitute = previousMasks[j] << 1;
      currentMask = insertOrDelete & substitute;
      previousMasks[j] = currentMask | bitMasks[charCode];
    }

    if ((currentMask & (1 << (patternLength - 1))) === 0) {
      return i - patternLength + 1;
    }
  }

  return -1; // No match found
}

export function bitapFuzzyBitwiseSearch(
  text: string,
  pattern: string,
  k: number
) {
  if (pattern.length === 0) return text;
  if (pattern.length > 31) return "The pattern is too long!";

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
