import { InferredWeightedBagKey, WeightedBag } from "./types";

/** Takes an object where values are probabilities between 0 and 1
 * and returns a random key accounting for the probability.
 */
export function weightedRandom<BagType extends WeightedBag = WeightedBag>(
  bag: BagType,
): InferredWeightedBagKey<BagType> {
  const values = Object.keys(bag) as InferredWeightedBagKey<BagType>[],
    probabilities = Object.values(bag),
    rand = Math.random();

  let sum = 0;

  for (const [i, v] of probabilities.entries()) {
    sum += v;

    if (rand <= sum) {
      return values[i];
    }
  }
}
