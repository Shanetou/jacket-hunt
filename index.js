require("dotenv").config();
const puppeteer = require("puppeteer");
const Jackets = require("./scrapers/jackets");
const Email = require("./mailer/email");
const { buildResultsData } = require("./utils");

(async () => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    const scrapedData = await new Jackets(browser, page).scrape();
    const categorizedData = buildResultsData(scrapedData);
    console.log("categorizedData:", categorizedData);

    await new Email(categorizedData).send();
  } catch (error) {
    console.log("error:", error);
    await new Email(error.stack, true).send();
  }

  await browser.close();
})();
