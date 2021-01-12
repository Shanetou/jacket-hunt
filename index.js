const puppeteer = require("puppeteer");
const Jackets = require("./scrapers/jackets");

(async () => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    const jackets = await new Jackets(browser, page).scrape();
    console.log("jackets:", jackets);
  } catch (error) {
    console.error("error: ", error);
  }

  await browser.close();
})();
