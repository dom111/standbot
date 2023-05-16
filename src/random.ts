import type { WeightedBag } from "./types";

/**
 * Takes an object where values are probabilities between 0 and 1 and returns
 * a random key accounting for the probablity.
 */
export function weightedRandom(bag: WeightedBag) {
  const values = Object.keys(bag)
  const probabilities = Object.values(bag)
  const rand = Math.random()
  let sum = 0

  for (const [i, v] of probabilities.entries()) {
    sum += v

    if (rand <= sum) {
      return values[i]
    }
  }
}
