import { countByMember, takeNWeeks } from "./log";
import type { Log, SlackId } from "./types";

describe("count log by current member", () => {
  test("empty log", () => {
    const members: SlackId[] = [
      "U12345676",
      "U12345677",
      "U12345678",
      "U12345679",
      "U12345680",
    ];
    const log = [];
    const expected = {
      U12345679: 0,
      U12345677: 0,
      U12345678: 0,
      U12345676: 0,
      U12345680: 0,
    };

    expect(countByMember(log, members)).toEqual(expected);
  });

  test("all current members", () => {
    const members: SlackId[] = [
      "U12345676",
      "U12345677",
      "U12345678",
      "U12345679",
      "U12345680",
    ];
    const log: Log = [
      ["2023-05-15T08:00:00.0Z", "U12345679"],
      ["2023-05-16T08:00:00.0Z", "U12345677"],
      ["2023-05-17T08:00:00.0Z", "U12345679"],
      ["2023-05-18T08:00:00.0Z", "U12345678"],
      ["2023-05-19T08:00:00.0Z", "U12345679"],
      ["2023-05-22T08:00:00.0Z", "U12345678"],
      ["2023-05-23T08:00:00.0Z", "U12345680"],
    ];
    const expected = {
      U12345676: 0,
      U12345677: 1,
      U12345678: 2,
      U12345679: 3,
      U12345680: 1,
    };

    expect(countByMember(log, members)).toEqual(expected);
  });

  test("log with old members", () => {
    const members: SlackId[] = [
      "U12345676",
      "U12345677",
      "U12345678",
      "U12345679",
    ];
    const log: Log = [
      ["2023-05-15T08:00:00.0Z", "U12345679"],
      ["2023-05-16T08:00:00.0Z", "U12345677"],
      ["2023-05-17T08:00:00.0Z", "U12345679"],
      ["2023-05-18T08:00:00.0Z", "U12345678"],
      ["2023-05-19T08:00:00.0Z", "U12345679"],
      ["2023-05-22T08:00:00.0Z", "U12345678"],
      ["2023-05-23T08:00:00.0Z", "U12345680"],
    ];
    const expected = {
      U12345676: 0,
      U12345677: 1,
      U12345678: 2,
      U12345679: 3,
    };

    expect(countByMember(log, members)).toEqual(expected);
  });
});

describe("take n weeks", () => {
  test("empty log", () => {
    const nweeks = 3;
    const date = new Date("2023-05-19");
    const log = [];
    const expected = [];

    expect(takeNWeeks(log, date, nweeks)).toEqual(expected);
  });

  test("empty log after filtering", () => {
    const nweeks = 3;
    const date = new Date("2023-05-19");
    const log: Log = [
      ["2023-01-15T08:00:00.0Z", "U12345679"],
      ["2023-01-16T08:00:00.0Z", "U12345677"],
      ["2023-01-17T08:00:00.0Z", "U12345679"],
      ["2023-01-18T08:00:00.0Z", "U12345678"],
      ["2023-01-19T08:00:00.0Z", "U12345679"],
      ["2023-01-22T08:00:00.0Z", "U12345678"],
      ["2023-01-23T08:00:00.0Z", "U12345680"],
    ];
    const expected = [];

    expect(takeNWeeks(log, date, nweeks)).toEqual(expected);
  });

  test("keep last week", () => {
    const nweeks = 1;
    const date = new Date("2023-05-19");
    const log: Log = [
      ["2023-05-08T08:00:00.0Z", "U12345680"],
      ["2023-05-09T08:00:00.0Z", "U12345679"],
      ["2023-05-10T08:00:00.0Z", "U12345678"],
      ["2023-05-11T08:00:00.0Z", "U12345677"],
      ["2023-05-12T08:00:00.0Z", "U12345680"],
      ["2023-05-15T08:00:00.0Z", "U12345679"],
      ["2023-05-16T08:00:00.0Z", "U12345677"],
      ["2023-05-17T08:00:00.0Z", "U12345679"],
      ["2023-05-18T08:00:00.0Z", "U12345678"],
      ["2023-05-19T08:00:00.0Z", "U12345679"],
    ];
    const expected: Log = [
      ["2023-05-12T08:00:00.0Z", "U12345680"],
      ["2023-05-15T08:00:00.0Z", "U12345679"],
      ["2023-05-16T08:00:00.0Z", "U12345677"],
      ["2023-05-17T08:00:00.0Z", "U12345679"],
      ["2023-05-18T08:00:00.0Z", "U12345678"],
      ["2023-05-19T08:00:00.0Z", "U12345679"],
    ];

    expect(takeNWeeks(log, date, nweeks)).toEqual(expected);
  });
});
