/**
 * Strictly parses a wire-format time string (`HH:mm` or `HH:mm:ss`, both
 * zero-padded) into a number of seconds since `00:00:00`. Returns `null` for
 * anything that does not match the contract — including leading or trailing
 * whitespace, out-of-range hours like `24:00`, missing zero-padding, or a
 * `Date` / number being passed through. Used by the validators so a
 * comparison never silently happens on a malformed string.
 *
 * Internal — not exported from the package barrel.
 */
export function parseTimeToSeconds(t: string): number | null {
  const m = /^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/.exec(t)
  if (!m) {
    return null
  }
  const hours = Number(m[1])
  const minutes = Number(m[2])
  const seconds = m[3] === undefined ? 0 : Number(m[3])
  return hours * 3600 + minutes * 60 + seconds
}
