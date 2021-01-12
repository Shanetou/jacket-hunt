require("dotenv").config();
const puppeteer = require("puppeteer");
const Jackets = require("./scrapers/jackets");
const Email = require("./mailer/email");

(async () => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    const jackets = await new Jackets(browser, page).scrape();
    console.log("jackets:", jackets.length);

    await new Email(jackets).send();
  } catch (error) {
    console.log("error:", error);
    await new Email(error.stack, true).send();
  }

  await browser.close();
})();
