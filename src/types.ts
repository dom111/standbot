export type SlackId = `U${string}`;
export type Timestamp = string;
export type LogRecord = [Timestamp, SlackId];
export type Log = LogRecord[];

/** Values are expected to be between 0 and 1. */
export type Probability = number;

/** For example:
 *
 * ```
 * {
 *  "homer.simpson": 0.7,
 *  "montgomery.burns": 0.8,
 *  "lisa.simpson": 0.6,
 * }
 * ```
 * `
 */
export type WeightedBag<K extends string = string, V = any> = {
  [key in K]: V;
};

export type InferredWeightedBagKey<Type extends WeightedBag> =
  Type extends WeightedBag<infer K> ? K : never;
export type InferredWeightedBagValue<Type extends WeightedBag> =
  Type extends WeightedBag<any, infer V> ? V : never;

export type WeightedSlackIdBag = WeightedBag<SlackId, Probability>;

export interface MemberCounters {
  [memberHandle: SlackId]: number;
}

// TODO: use the actual interface from GoogleAppsScript
export type Spreadsheet = any;
export type SpreadsheetRow = any[];

export type FetchOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
