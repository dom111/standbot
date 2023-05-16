import { computeProbabilities, isWorkingDay, pickFacilitator } from "./event"
import { countByMember } from "./log"
import { Log } from "./types"

describe("compute probabilities", () => {
  test("no members", () => {
    const members = [
      "lisa.simpson",
      "montgomery.burns",
      "waylon.smithers"
    ]
    const log = []
    const expected = {
      "montgomery.burns": 1,
      "lisa.simpson": 1,
      "waylon.smithers": 1,
    }

    const memberCounters = countByMember(log, members)

    expect(computeProbabilities(memberCounters)).toEqual(expected)
  })

  test("one member", () => {
    const members = [
      "lisa.simpson",
      "montgomery.burns",
      "waylon.smithers"
    ]
    const log: Log = [
      ["2023-05-15T08:00:00.0Z", "montgomery.burns"],
    ]
    const expected = {
      "lisa.simpson": 1,
      "montgomery.burns": 0,
      "waylon.smithers": 1,
    }
    const memberCounters = countByMember(log, members)

    expect(computeProbabilities(memberCounters)).toEqual(expected)
  })

  test("even distribution", () => {
    const members = [
      "montgomery.burns",
      "waylon.smithers"
    ]
    const log: Log = [
      ["2023-05-15T08:00:00.0Z", "montgomery.burns"],
      ["2023-05-23T08:00:00.0Z", "waylon.smithers"],
    ]
    const expected = {
      "montgomery.burns": 0.5,
      "waylon.smithers": 0.5,
    }

    const memberCounters = countByMember(log, members)

    expect(computeProbabilities(memberCounters)).toEqual(expected)

  })
})

describe("is working day", () => {
  test("monday", () => {
    expect(isWorkingDay(new Date("2023-05-15"))).toEqual(true)
  })

  test("friday", () => {
    expect(isWorkingDay(new Date("2023-05-19"))).toEqual(true)
  })

  test("saturday", () => {
    expect(isWorkingDay(new Date("2023-05-20"))).toEqual(false)
  })

  test("sunday", () => {
    expect(isWorkingDay(new Date("2023-05-21"))).toEqual(false)
  })
})

describe("pick facilitator", () => {
  test("anyone but the last facilitator", () => {
    const members = [
      "lisa.simpson",
      "montgomery.burns",
      "waylon.smithers"
    ]
    const log: Log = [
      ["2023-05-16T08:00:00.0Z", "lisa.simpson"],
      ["2023-05-16T08:00:00.0Z", "waylon.smithers"],
      ["2023-05-17T08:00:00.0Z", "montgomery.burns"],
      ["2023-05-18T08:00:00.0Z", "waylon.smithers"],
    ]

    const expected = "waylon.smithers"
    const actual = pickFacilitator(members, log, new Date("2023-05-19"))

    expect(actual).not.toEqual(expected)

  })
})
