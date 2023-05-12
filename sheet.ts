/**
 * Opens the default spreadsheet.
 */
function getSource() {
  return SpreadsheetApp.openById(getProperty("SPREADSHEET_ID"));
}

/**
 * Gets the list of member names.
 */
function getMembers(source) {
  const data = source
    .getSheetByName("members")
    .getDataRange()
    .getValues()
    .map(p => p[0].toString());

  return data;
}

/**
 * Gets the log from the spreadsheet excluding the header.
 */
function getLog(source) {
  const data = source
    .getSheetByName("log")
    .getDataRange()
    .getValues()
    .slice(1);

  return data;
}

/**
 * Adds a record to the spreadsheet log.
 */
function registerEvent(source, username, timestamp) {
   source.getSheetByName("log").appendRow([timestamp, username]);
}
