import {
  getSource,
  getMembers,
  getLog,
  registerEvent,
  Member,
} from "./services/sheet";
import { sendMessage } from "./services/slack";
import { createEvent, getWorkingDay, isWorkingDay } from "./event";
import { bisect, dayOfWeek, joinList } from "./util";
import { getCalendarById, isUserOutOfOffice } from "./services/calendar";
import { HOLIDAY_CALENDAR_ID } from "./services/settings";

function main() {
  const today = new Date();

  if (!isWorkingDay(today)) {
    return;
  }

  const source = getSource();
  const members = getMembers(source);

  const calendar = getCalendarById(HOLIDAY_CALENDAR_ID);
  const [membersInOfficeToday, membersOutOfOfficeToday] = bisect<Member>(
    members,
    ({ name }) => isUserOutOfOffice(calendar, name, today),
  );

  const previousWorkingDay = getWorkingDay(today, -1);
  const [, membersOutOfOfficePreviousWorkingDay] = bisect<Member>(
    members,
    ({ name }) => isUserOutOfOffice(calendar, name, previousWorkingDay),
  );
  const membersOutPreviousWorkingDayButNotToday =
    membersOutOfOfficePreviousWorkingDay.filter(
      ({ id }) =>
        !membersOutOfOfficeToday.some(({ id: memberId }) => id === memberId),
    );

  const nextWorkingDay = getWorkingDay(today);
  const [, membersOutOfOfficeNextWorkingDay] = bisect<Member>(
    members,
    ({ name }) => isUserOutOfOffice(calendar, name, nextWorkingDay),
  );
  const membersOutNextWorkingDayButNotToday =
    membersOutOfOfficeNextWorkingDay.filter(
      ({ id }) =>
        !membersOutOfOfficeToday.some(({ id: memberId }) => id === memberId),
    );

  const log = getLog(source);
  const event = createEvent(
    membersInOfficeToday.map(({ id }) => id),
    log,
    today,
  );

  const messageParts = [event.message];

  // I don't think this should live here, and it should probably be configurable...
  if (membersOutPreviousWorkingDayButNotToday.length > 0) {
    messageParts.push(
      `Welcome back ${joinList(membersOutOfOfficeToday.map(({ id }) => `<@${id}>`))}! :froge-wave:`,
    );
  }

  if (membersOutOfOfficeToday.length > 0) {
    messageParts.push(
      `${joinList(membersOutOfOfficeToday.map(({ id }) => `<@${id}>`))} ${membersOutOfOfficeToday.length === 1 ? "is" : "are"} out today. :palm_tree:`,
    );
  }

  if (membersOutNextWorkingDayButNotToday.length > 0) {
    messageParts.push(
      `${joinList(membersOutNextWorkingDayButNotToday.map(({ id }) => `<@${id}>`))}, you are out on ${dayOfWeek(nextWorkingDay)}, remember to hand over anything outstanding! :cake-throw:`,
    );
  }

  sendMessage(messageParts.join("\n\n"));
  registerEvent(source, event.facilitator, event.timestamp);
}
