const WIB_OFFSET = 7 * 60 * 60 * 1000

/** Awal hari (00:00 WIB) sebagai Date UTC, mundur `daysAgo` hari. */
export function startOfDayWIB(daysAgo = 0, now = new Date()): Date {
  const local = new Date(now.getTime() + WIB_OFFSET)
  local.setUTCHours(0, 0, 0, 0)
  local.setUTCDate(local.getUTCDate() - daysAgo)
  return new Date(local.getTime() - WIB_OFFSET)
}