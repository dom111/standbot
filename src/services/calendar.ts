import { HOLIDAY_CALENDAR_ID } from "./settings";

const eventsCache: {
  [key: string]: GoogleAppsScript.Calendar.CalendarEvent[];
} = {};

/** Opens the default calendar. */
export const getCalendarById = (
  id: string,
): GoogleAppsScript.Calendar.Calendar => {
  return CalendarApp.getCalendarById(id);
};

const getEventsForDate = (
  calendar: GoogleAppsScript.Calendar.Calendar,
  date: Date,
): GoogleAppsScript.Calendar.CalendarEvent[] => {
  const startDate = new Date(date),
    endDate = new Date(date),
    key = `${startDate.getTime()}-${endDate.getTime()}`;

  if (key in eventsCache) {
    return eventsCache[key];
  }

  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);

  return calendar.getEvents(startDate, endDate);
};

const getEventTitlesForDate = (
  calendar: GoogleAppsScript.Calendar.Calendar,
  date: Date,
): string[] =>
  getEventsForDate(calendar, date).map((event) => event.getTitle());

const UK_HOLIDAYS = (name: string) => [
  `New Year's Day - ${name}`,
  `Good Friday - ${name}`,
  `Easter Monday - ${name}`,
  `Early May Bank Holiday - ${name}`,
  `Spring Bank Holiday - ${name}`,
  `Summer Bank Holiday - ${name}`,
  `Christmas Day - ${name}`,
  `Boxing Day - ${name}`,
];

const OUT_OF_OFFICE = (name: string) => `${name} - Out of Office`;

/** This could accept a region parameter and we could define holiday strings for other regions too. */
const outOfOfficeStringsForUser = (name: string) => [
  ...UK_HOLIDAYS(name),
  OUT_OF_OFFICE(name),
];

export const isUserOutOfOffice = (
  calendar: GoogleAppsScript.Calendar.Calendar,
  name: string,
  date: Date,
) => {
  const eventTitles = getEventTitlesForDate(calendar, date),
    userEvents = outOfOfficeStringsForUser(name);

  return eventTitles.some((title) => userEvents.includes(title));
};
