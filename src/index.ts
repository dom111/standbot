import { getSource, getMembers, getLog, registerEvent } from "./services/sheet"
import { sendMessage } from "./services/slack";
import { createEvent, isWorkingDay } from "./event";

function main() {
  const today = new Date()

  if (!isWorkingDay(today)) {
    return
  }

  const source = getSource()
  const members = getMembers(source)
  const log = getLog(source)
  const event = createEvent(members, log, today)

  sendMessage(event.message)
  registerEvent(source, event.facilitator, event.timestamp)
}
