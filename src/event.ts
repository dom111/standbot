import { countByMember, takeNWeeks } from "./log"
import { weightedRandom } from "./random"
import type { Log, SlackHandle } from "./types"
import { WeightedBag } from "./types"
import { MemberCounters } from "./types"

/**
  * Number of weeks to consider from the log of events.
  */
const NUMBER_OF_WEEKS = 3

export function isWorkingDay(date: Date): boolean {
  return ![0, 6].includes(date.getDay())
}

/**
  * Computes the expected probability for each member based on the given
  * counters.
  *
  * When all counters are 0, all probabilities are equal and set to 1.
  */
export function computeProbabilities(memberCounters: MemberCounters): WeightedBag {
  const entries = Object.entries(memberCounters)
  const totalWeight = entries.reduce((acc, [_, weight]) => acc + weight, 0)

  const zeroMapper = ([name, _weight]) => [name, 1]
  const mainMapper = ([name, weight]) =>
    [name, 1 - (weight / totalWeight)]
  const mapper = totalWeight === 0 ? zeroMapper : mainMapper

  return Object.fromEntries(entries.map(mapper))
}

/**
  * Picks a facilitator out of the given members.
  *
  * A facilitator should never be the same twice in a row and be picked
  * based on the previus few weeks of activity.
  */
export function pickFacilitator(members: Array<SlackHandle>, log: Log, date: Date): SlackHandle {
  const [, lastFacilitator] = log.pop()
  const candidates = members.filter(member => member != lastFacilitator)
  const threeWeekLog = takeNWeeks(log, date, NUMBER_OF_WEEKS)
  const membersWithTimes = countByMember(threeWeekLog, candidates);

  const membersWithProbabilities = computeProbabilities(membersWithTimes)

  const facilitator = weightedRandom(membersWithProbabilities)

  return facilitator
}


/**
  * Creates a standup event.
  */
export function createEvent(members: Array<SlackHandle>, log: Log, date: Date) {
  const facilitator = pickFacilitator(members, log, date)
  const message = `TEST @${facilitator} will be running today's standup`;

  return ({
    message,
    facilitator,
    timestamp: date.toISOString()
  })
}
