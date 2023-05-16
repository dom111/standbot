import { countByMember, takeNWeeks } from "./log"
import type { Log } from "./types"


describe("count log by current member", () => {
  test("empty log", () => {
    const members = [
      "bart.simpson",
      "homer.simpson",
      "lisa.simpson",
      "montgomery.burns",
      "waylon.smithers"
    ]
    const log = []
    const expected = {
      "montgomery.burns": 0,
      "homer.simpson": 0,
      "lisa.simpson": 0,
      "bart.simpson": 0,
      "waylon.smithers": 0,
    }

    expect(countByMember(log, members)).toEqual(expected)
  })

  test("all current members", () => {
    const members = [
      "bart.simpson",
      "homer.simpson",
      "lisa.simpson",
      "montgomery.burns",
      "waylon.smithers"
    ]
    const log: Log = [
      ["2023-05-15T08:00:00.0Z", "montgomery.burns"],
      ["2023-05-16T08:00:00.0Z", "homer.simpson"],
      ["2023-05-17T08:00:00.0Z", "montgomery.burns"],
      ["2023-05-18T08:00:00.0Z", "lisa.simpson"],
      ["2023-05-19T08:00:00.0Z", "montgomery.burns"],
      ["2023-05-22T08:00:00.0Z", "lisa.simpson"],
      ["2023-05-23T08:00:00.0Z", "waylon.smithers"],
    ]
    const expected = {
      "bart.simpson": 0,
      "homer.simpson": 1,
      "lisa.simpson": 2,
      "montgomery.burns": 3,
      "waylon.smithers": 1,
    }

    expect(countByMember(log, members)).toEqual(expected)
  })

  test("log with old members", () => {
    const members = [
      "bart.simpson",
      "homer.simpson",
      "lisa.simpson",
      "montgomery.burns",
    ]
    const log: Log = [
      ["2023-05-15T08:00:00.0Z", "montgomery.burns"],
      ["2023-05-16T08:00:00.0Z", "homer.simpson"],
      ["2023-05-17T08:00:00.0Z", "montgomery.burns"],
      ["2023-05-18T08:00:00.0Z", "lisa.simpson"],
      ["2023-05-19T08:00:00.0Z", "montgomery.burns"],
      ["2023-05-22T08:00:00.0Z", "lisa.simpson"],
      ["2023-05-23T08:00:00.0Z", "waylon.smithers"],
    ]
    const expected = {
      "bart.simpson": 0,
      "homer.simpson": 1,
      "lisa.simpson": 2,
      "montgomery.burns": 3,
    }

    expect(countByMember(log, members)).toEqual(expected)
  })
})

describe("take n weeks", () => {
  test("empty log", () => {
    const nweeks = 3
    const date = new Date("2023-05-19")
    const log = []
    const expected = []

    expect(takeNWeeks(log, date, nweeks)).toEqual(expected)
  })

  test("empty log after filtering", () => {
    const nweeks = 3
    const date = new Date("2023-05-19")
    const log: Log = [
      ["2023-01-15T08:00:00.0Z", "montgomery.burns"],
      ["2023-01-16T08:00:00.0Z", "homer.simpson"],
      ["2023-01-17T08:00:00.0Z", "montgomery.burns"],
      ["2023-01-18T08:00:00.0Z", "lisa.simpson"],
      ["2023-01-19T08:00:00.0Z", "montgomery.burns"],
      ["2023-01-22T08:00:00.0Z", "lisa.simpson"],
      ["2023-01-23T08:00:00.0Z", "waylon.smithers"],
    ]
    const expected = []

    expect(takeNWeeks(log, date, nweeks)).toEqual(expected)
  })

  test("keep last week", () => {
    const nweeks = 1
    const date = new Date("2023-05-19")
    const log: Log = [
      ["2023-05-08T08:00:00.0Z", "waylon.smithers"],
      ["2023-05-09T08:00:00.0Z", "montgomery.burns"],
      ["2023-05-10T08:00:00.0Z", "lisa.simpson"],
      ["2023-05-11T08:00:00.0Z", "homer.simpson"],
      ["2023-05-12T08:00:00.0Z", "waylon.smithers"],
      ["2023-05-15T08:00:00.0Z", "montgomery.burns"],
      ["2023-05-16T08:00:00.0Z", "homer.simpson"],
      ["2023-05-17T08:00:00.0Z", "montgomery.burns"],
      ["2023-05-18T08:00:00.0Z", "lisa.simpson"],
      ["2023-05-19T08:00:00.0Z", "montgomery.burns"],
    ]
    const expected: Log = [
      ["2023-05-12T08:00:00.0Z", "waylon.smithers"],
      ["2023-05-15T08:00:00.0Z", "montgomery.burns"],
      ["2023-05-16T08:00:00.0Z", "homer.simpson"],
      ["2023-05-17T08:00:00.0Z", "montgomery.burns"],
      ["2023-05-18T08:00:00.0Z", "lisa.simpson"],
      ["2023-05-19T08:00:00.0Z", "montgomery.burns"],
    ]

    expect(takeNWeeks(log, date, nweeks)).toEqual(expected)
  })
})
