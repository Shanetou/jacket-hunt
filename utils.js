function buildResultsData(results) {
  const PRIORITIZED_TERMS = ["hoody", "down"];
  const categorizedResults = {
    prioritizedResults: [],
    otherResults: [],
  };

  return results.reduce((prev, curr) => {
    const isPrioritizedResult = PRIORITIZED_TERMS.some((term) =>
      curr.title.toLowerCase().includes(term)
    );

    if (isPrioritizedResult) {
      prev.prioritizedResults = [...prev.prioritizedResults, curr];
    } else {
      prev.otherResults = [...prev.otherResults, curr];
    }

    return prev;
  }, categorizedResults);
}

exports.buildResultsData = buildResultsData;
