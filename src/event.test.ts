import { computeProbabilities, isWorkingDay, pickFacilitator } from "./event";
import { countByMember } from "./log";
import { Log, SlackId } from "./types";

describe("compute probabilities", () => {
  test("no members", () => {
    const members: SlackId[] = ["U12345678", "U12345679", "U12345680"];
    const log = [];
    const expected = {
      U12345679: 1,
      U12345678: 1,
      U12345680: 1,
    };

    const memberCounters = countByMember(log, members);

    expect(computeProbabilities(memberCounters)).toEqual(expected);
  });

  test("one member", () => {
    const members: SlackId[] = ["U12345678", "U12345679", "U12345680"];
    const log: Log = [["2023-05-15T08:00:00.0Z", "U12345679"]];
    const expected = {
      U12345678: 1,
      U12345679: 0,
      U12345680: 1,
    };
    const memberCounters = countByMember(log, members);

    expect(computeProbabilities(memberCounters)).toEqual(expected);
  });

  test("even distribution", () => {
    const members: SlackId[] = ["U12345679", "U12345680"];
    const log: Log = [
      ["2023-05-15T08:00:00.0Z", "U12345679"],
      ["2023-05-23T08:00:00.0Z", "U12345680"],
    ];
    const expected = {
      U12345679: 0.5,
      U12345680: 0.5,
    };

    const memberCounters = countByMember(log, members);

    expect(computeProbabilities(memberCounters)).toEqual(expected);
  });
});

describe("is working day", () => {
  test("monday", () => {
    expect(isWorkingDay(new Date("2023-05-15"))).toEqual(true);
  });

  test("friday", () => {
    expect(isWorkingDay(new Date("2023-05-19"))).toEqual(true);
  });

  test("saturday", () => {
    expect(isWorkingDay(new Date("2023-05-20"))).toEqual(false);
  });

  test("sunday", () => {
    expect(isWorkingDay(new Date("2023-05-21"))).toEqual(false);
  });
});

describe("pick facilitator", () => {
  test("anyone but the last facilitator", () => {
    const members: SlackId[] = ["U12345678", "U12345679", "U12345680"];
    const log: Log = [
      ["2023-05-16T08:00:00.0Z", "U12345678"],
      ["2023-05-16T08:00:00.0Z", "U12345680"],
      ["2023-05-17T08:00:00.0Z", "U12345679"],
      ["2023-05-18T08:00:00.0Z", "U12345680"],
    ];

    const expected = "U12345680";
    const actual = pickFacilitator(members, log, new Date("2023-05-19"));

    expect(actual).not.toEqual(expected);
  });
});
