import { SPREADSHEET_ID } from "./settings"
import type { Log, SlackHandle, Spreadsheet, SpreadsheetRow, Timestamp } from "../types"

/** Opens the default spreadsheet. */
export function getSource(): Spreadsheet {
  return SpreadsheetApp.openById(SPREADSHEET_ID)
}

/** Gets the list of member names. */
export function getMembers(source: Spreadsheet): Array<SlackHandle> {
  const data = source
    .getSheetByName("members")
    .getDataRange()
    .getValues()
    .map((row: SpreadsheetRow) => row[0].toString())

  return data
}

/** Gets the log from the spreadsheet excluding the header. */
export function getLog(source: Spreadsheet): Log {
  const data = source
    .getSheetByName("log")
    .getDataRange()
    .getValues()
    .slice(1)

  return data
}

/** Adds a record to the spreadsheet log. */
export function registerEvent(source: Spreadsheet, handle: SlackHandle, timestamp: Timestamp) {
  source
    .getSheetByName("log")
    .appendRow([timestamp, handle])
}
