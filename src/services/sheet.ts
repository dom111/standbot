import { SPREADSHEET_ID } from "./settings";
import type {
  Log,
  SlackId,
  Spreadsheet,
  SpreadsheetRow,
  Timestamp,
} from "../types";

/** Opens the default spreadsheet. */
export function getSource(): Spreadsheet {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

export interface Member {
  id: SlackId;
  name: string;
}

/**
 * Gets the list of member names.
 *
 * Assumes a spreadsheet that has a user's full name (as it appears in Bob) in cell 1 and their Slack user ID in cell 2.
 */
export function getMembers(source: Spreadsheet): Member[] {
  const data = source
    .getSheetByName("members")
    .getDataRange()
    .getValues()
    .map(
      (row: SpreadsheetRow): Member => ({
        id: row[1].toString(),
        name: row[0].toString(),
      }),
    );

  return data;
}

/** Gets the log from the spreadsheet excluding the header. */
export function getLog(source: Spreadsheet): Log {
  const data = source.getSheetByName("log").getDataRange().getValues().slice(1);

  return data;
}

/** Adds a record to the spreadsheet log. */
export function registerEvent(
  source: Spreadsheet,
  handle: SlackId,
  timestamp: Timestamp,
) {
  source.getSheetByName("log").appendRow([timestamp, handle]);
}
