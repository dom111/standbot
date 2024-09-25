import { createEvent } from "./event";
import { getLog, getMembers, getSource, registerEvent } from "./services/sheet";

function testGetMembers() {
  const source = getSource();
  const members = getMembers(source);

  Logger.log(members);
}

function testGetLog() {
  const source = getSource();
  const log = getLog(source);

  Logger.log(log);
}

function testRegisterEvent() {
  const source = getSource();

  registerEvent(source, "U12345678", new Date().toISOString());
}

function testEvent() {
  const today = new Date();
  const source = getSource();
  const members = getMembers(source);
  const log = getLog(source);
  const event = createEvent(
    members.map(({ id }) => id),
    log,
    today,
  );

  Logger.log(event);
}
