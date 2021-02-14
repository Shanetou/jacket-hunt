function buildResultsData(results, searchTerms) {
  const categorizedResults = {
    prioritizedResults: [],
    otherResults: [],
  };

  const isPrioritized = (result) =>
    searchTerms.some((term) => result.title.toLowerCase().includes(term));

  return results.reduce((prev, curr) => {
    if (isPrioritized(curr)) {
      prev.prioritizedResults = [...prev.prioritizedResults, curr];
    } else {
      prev.otherResults = [...prev.otherResults, curr];
    }

    return prev;
  }, categorizedResults);
}

function getScrapeUrl(category) {
  return `https://wornwear.patagonia.com/shop/${category}-jackets-and-vests?category=Jackets&size=S`;
}

module.exports = {
  buildResultsData: buildResultsData,
  getScrapeUrl: getScrapeUrl,
};
