const fs = require("fs");

function buildResultsData(results) {
  const categorizedResults = {
    newlyAdded: [],
    prioritizedResults: [],
    otherResults: [],
  };

  return results.reduce((prev, curr) => {
    if (isNewlyAdded(curr)) {
      prev.newlyAdded = [...prev.newlyAdded, curr];
    } else if (isPrioritized(curr)) {
      prev.prioritizedResults = [...prev.prioritizedResults, curr];
    } else {
      prev.otherResults = [...prev.otherResults, curr];
    }

    return prev;
  }, categorizedResults);
}

function isNewlyAdded(result) {
  const historicalDataHrefs = readFromFile().map((result) => result.href);

  return historicalDataHrefs.every((href) => href !== result.href);
}

function isPrioritized(result) {
  const PRIORITIZED_TERMS = ["hoody", "down"];

  return PRIORITIZED_TERMS.some((term) =>
    result.title.toLowerCase().includes(term)
  );
}

function readFromFile() {
  const rawJSON = fs.readFileSync("./data/jackets.json");

  return JSON.parse(rawJSON);
}

module.exports = { buildResultsData: buildResultsData };
