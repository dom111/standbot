/**
  * Project Settings defined in Script Properties.
  */

export const SPREADSHEET_ID = getProperty("SPREADSHEET_ID")
export const SLACK_CHANNEL = getProperty("SLACK_CHANNEL")
export const SLACK_HOOK = getProperty("SLACK_HOOK")
export const BOT_NAME = getProperty("BOT_NAME")
export const BOT_EMOJI = getProperty("BOT_EMOJI")


/**
  * Shorthand for accessing Google Script's settings service.
  */
export function getProperty(propertyName: string) {
  return PropertiesService.getScriptProperties().getProperty(propertyName)
}
