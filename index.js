require("dotenv").config();
const puppeteer = require("puppeteer");
const JacketScraper = require("./scrapers/jacketScraper");
const Emailer = require("./mailer/emailer");
const { buildResultsData, getScrapeUrl } = require("./utils");

const scrapeMensJackets = async (scraper) => {
  const url = getScrapeUrl("mens");
  const searchTerms = ["hood", "down", "nano", "micro", "macro"];

  const scrapedData = await scraper.scrape(url);
  const categorizedData = buildResultsData(scrapedData, searchTerms);

  return await new Emailer().send(categorizedData);
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

    // await scrapeMensJackets(scraper);
    await scrapeWomensJackets(scraper);
  } catch (error) {
    console.log("error:", error);
    await new Email().send(error.stack, false);
  }

  if (browser !== undefined) {
    await browser.close();
  }
})();
