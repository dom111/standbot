import { getSource, getMembers, getLog, registerEvent } from "./sheet"
import { SLACK_CHANNEL, SLACK_HOOK } from "./settings"
import { selectAtRandom, weightedRandom } from "./random";
import type { FetchOptions, Log, MemberCounters, SlackHandle } from "./types";


function pickFacilitator(candidates: Array<SlackHandle>): SlackHandle {
  return selectAtRandom(candidates)
}


function countTimesFacilitating(log: Log, today: Date, candidates: Array<SlackHandle>): MemberCounters {
  return log.reduce((acc, [timestamp, member]) => {
    if (candidates.every(x => x != member)) { return acc }

    const t1 = new Date(timestamp).getTime()
    const t2 = today.getTime()
    const numberOfWeeks =
      (t1: number, t2: number) => Math.floor((t2 - t1) / (24 * 3600 * 1000 * 7))

    // skip logs older than 3 weeks.
    if (numberOfWeeks(t1, t2) <= 3) {
      const prevCount = acc[member]
      const count = prevCount === undefined ? 1 : prevCount + 1

      acc[member] = count
    }

    return acc
  }, {})
}

function test() {
  const today = new Date()
  const source = getSource()
  const members = getMembers(source)
  const log = getLog(source)
  const [, lastFacilitator] = log.pop()
  const candidates = members.filter(member => member != lastFacilitator)
  const membersWithTimes = countTimesFacilitating(log, today, candidates);
  // TODO: Add members that are not in the log with probability 1.
  const totalWeight: number = Object.entries(membersWithTimes).reduce((acc, [_, weight]) => acc + weight, 0)
  const memberProb = Object.entries(membersWithTimes).map(([name, weight]) => [name, (1 - (weight / totalWeight)).toFixed(1)])


  Logger.log(memberProb);

  Logger.log(weightedRandom(Object.fromEntries(memberProb)))

  // registerEvent(source, facilitator, today.toISOString());
}

function isWorkingDay(date: Date): boolean {
  return ![0, 6].includes(date.getDay())
}

function sendMessage(message: string) {
  const payload = {
    channel: SLACK_CHANNEL,
    username: "CSO Bot",
    icon_emoji: ":bird:",
    link_names: 1,
    message: message
  }

  const options: FetchOptions = {
    method: "post",
    payload: JSON.stringify(payload),
  }

  UrlFetchApp.fetch(SLACK_HOOK, options)
}

function main() {
  const today = new Date();
  if (!isWorkingDay(today)) {
    return;
  }

  const source = getSource();
  const members = getMembers(source);
  const facilitator = pickFacilitator(members);
  const message = `TEST @${facilitator} will be running today's standup`;

  sendMessage(message);
  registerEvent(source, facilitator, today.toISOString());
}
