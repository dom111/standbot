function getProperty(propertyName) {
  return PropertiesService.getScriptProperties().getProperty(propertyName);
}

function selectAtRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

/**
 * Takes an object where values are probabilities between 0 and 1 and returns
 * a random key accounting for the probablity.
 */
function weightedRandom(bag) {
  const values = Object.keys(bag)
  const probabilities = Object.values(bag)
  const rand = Math.random()
  let sum = 0

  for (const [i, v] of probabilities.entries()) {
    sum += v

    if (rand <= sum) {
      return values[i]
    }
  }
}

function pickFacilitator(candidates) {
  return selectAtRandom(candidates);
}


function countTimesFacilitating(log, today, candidates) {
  return log.reduce((acc, [timestamp, member]) => {
    if (candidates.every(x => x != member)) { return acc }

    const t1 = new Date(timestamp).getTime()
    const t2 = today.getTime()
    const numberOfWeeks = (t1, t2) => parseInt((t2 - t1) / (24 * 3600 * 1000 * 7))

    // skip logs older than 3 weeks.
    if (numberOfWeeks(t1, t2) <= 3) {
      const prevCount = acc[member]
      const count = prevCount === undefined ? 1 : prevCount + 1

      acc[member] = count
    }

    return acc
  }, {});
}

function test() {
  const today = new Date()
  const source = getSource()
  const members = getMembers(source)
  const log = getLog(source)
  const [, lastFacilitator] = log.pop()
  const candidates = members.filter(member => member != lastFacilitator)
  const membersWithTimes = countTimesFacilitating(log, today, candidates);
  // TODO: Add members that are not in the log with probability 1.
  const totalWeight = Object.entries(membersWithTimes).reduce((acc, [_, weight]) => acc + weight, 0)
  const memberProb = Object.entries(membersWithTimes).map(([name, weight]) => [name, (1 - (weight / totalWeight).toFixed(1))])


  Logger.log(memberProb);

  Logger.log(weightedRandom(Object.fromEntries(memberProb)))

  // registerEvent(source, facilitator, today.toISOString());
}

function isWorkingDay(date) {
  return ![0, 6].includes(date.getDay());
}

function sendMessage(message) {
  const payload = {
    "channel": getProperty("SLACK_CHANNEL"),
    "username": "CSO Bot",
    "icon_emoji": ":bird:",
    "link_names": 1,
    "message": message
  };
  const url = getProperty("SLACK_HOOK");

  const options = {
    "method": "post",
    "payload": JSON.stringify(payload),
  };

  UrlFetchApp.fetch(url, options);
}

function main() {
  const today = new Date();
  if (!isWorkingDay(today)) {
    return;
  }

  const source = getSource();
  const members = getMembers(source);
  const facilitator = pickFacilitator(members);
  const message = `TEST @${facilitator} will be running today's standup`;

  sendMessage(message);
  registerEvent(source, facilitator, today.toISOString());
}
