import { weightedRandom } from "./random";

describe("weighted random", () => {
  test("certain probability", () => {
    const bag = {
      "montgomery.burns": 1,
      "homer.simpson": 0,
    };

    expect(weightedRandom(bag)).toBe("montgomery.burns");
  });
});
