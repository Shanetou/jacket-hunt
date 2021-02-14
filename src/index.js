const puppeteer = require("puppeteer");
const JacketScraper = require("./scrapers/jacketScraper");
const Emailer = require("./mailers/emailer");
const { buildResultsData, getScrapeUrl } = require("./utils");
require("dotenv").config();

const scrapeMensJackets = async (scraper) => {
  const url = getScrapeUrl("mens");
  // const searchTerms = ["hood", "down", "nano", "micro", "macro"];
  const searchTerms = ["down sweater hoody"];

  const scrapedData = await scraper.scrape(url);
  const categorizedData = buildResultsData(scrapedData, searchTerms);

  // return await new Emailer().send(categorizedData);
  if (categorizedData.prioritizedResults.length > 0) {
    await new Emailer().send(categorizedData);
  }
};

const scrapeWomensJackets = async (scraper) => {
  const url = getScrapeUrl("womens");
  const searchTerms = ["nano-air"];

  const scrapedData = await scraper.scrape(url);
  const categorizedData = buildResultsData(scrapedData, searchTerms);

  if (categorizedData.prioritizedResults.length > 0) {
    return await new Emailer(process.env.WOMENS_RESULTS_EMAIL).send(
      categorizedData
    );
  }
};

(async () => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    const scraper = new JacketScraper(page);

    await scrapeMensJackets(scraper);
    await scrapeWomensJackets(scraper);
  } catch (error) {
    console.log("error:", error);
    await new Emailer().send(error.stack, false);
  }

  if (browser !== undefined) {
    await browser.close();
  }
})();
