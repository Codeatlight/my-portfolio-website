/**
 * Keyframes shared by the DOM sky and the canvas effects, as functions of
 * page scroll progress (0 = sunset at the top, 1 = sunrise at the bottom).
 */

// Sun path, in % of the viewport
export const SUN_X_T = [0, 0.22, 0.5, 0.78, 1];
export const SUN_X = [70, 76, 50, 24, 31];
export const SUN_Y_T = [0, 0.08, 0.22, 0.5, 0.78, 0.9, 1];
export const SUN_Y = [60, 68, 96, 130, 96, 70, 56];

/** Piecewise-linear interpolation, clamped at both ends. */
export function interp(p: number, input: number[], output: number[]) {
  if (p <= input[0]) return output[0];
  for (let i = 1; i < input.length; i++) {
    if (p <= input[i]) {
      const k = (p - input[i - 1]) / (input[i] - input[i - 1]);
      return output[i - 1] + (output[i] - output[i - 1]) * k;
    }
  }
  return output[output.length - 1];
}

/** 0 → 1 → 1 → 0 envelope: fades in over [a, b], holds, fades out over [c, d]. */
export function envelope(p: number, a: number, b: number, c: number, d: number) {
  if (p <= a || p >= d) return 0;
  if (p < b) return (p - a) / (b - a);
  if (p <= c) return 1;
  return (d - p) / (d - c);
}
