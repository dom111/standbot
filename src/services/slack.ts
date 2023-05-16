import { BOT_EMOJI, BOT_NAME, SLACK_CHANNEL, SLACK_HOOK } from "./settings"
import type { FetchOptions } from "../types"

/**
  * Composes and sends a message to Slack.
  */
export function sendMessage(message: string) {
  const payload = {
    channel: SLACK_CHANNEL,
    username: BOT_NAME,
    icon_emoji: BOT_EMOJI,
    link_names: 1,
    message: message
  }

  const options: FetchOptions = {
    method: "post",
    payload: JSON.stringify(payload),
  }

  UrlFetchApp.fetch(SLACK_HOOK, options)
}
