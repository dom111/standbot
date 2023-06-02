export type SlackHandle = string
export type Timestamp = string
export type LogRecord = [Timestamp, SlackHandle]
export type Log = Array<LogRecord>

/** Values are expected to be between 0 and 1. */
export type Probability = number

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
export interface WeightedBag {
  [memberHandle: SlackHandle]: Probability
}


export interface MemberCounters {
  [memberHandle: SlackHandle]: number
}




// TODO: use the actual interface from GoogleAppsScript
export type Spreadsheet = any
export type SpreadsheetRow = Array<any>

export type FetchOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions
