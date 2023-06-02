import type { Log, MemberCounters, SlackHandle } from "./types"


/** Counts the times a _current_ member is present in the given log. */
export function countByMember(log: Log, members: Array<SlackHandle>): MemberCounters {
  const baseline = Object.fromEntries(members.map(member => [member, 0]))

  return log.reduce((acc, [_timestamp, member]) => {
    // No previous count means the given member is no longer part of
    // the team.
    if (acc[member] !== undefined) {
      acc[member] += 1
    }

    return acc
  }, baseline)
}

export function takeNWeeks(log: Log, today: Date, n: number): Log {
  const t2 = today.getTime()
  const numberOfWeeks = (t1: number, t2: number) =>
    Math.floor((t2 - t1) / (24 * 3600 * 1000 * 7))

  return log.filter(([timestamp, _member]) => {
    const t1 = new Date(timestamp).getTime()

    return numberOfWeeks(t1, t2) < n
  })
}

