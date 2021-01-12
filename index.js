require("dotenv").config();
const puppeteer = require("puppeteer");
const Jackets = require("./scrapers/jackets");
const Email = require("./mailer/email");

(async () => {
  let browser;

  console.log("process.env:", process.env);

  try {
    browser = await puppeteer.launch({
      headless: false,
    });

    const page = await browser.newPage();

    const jackets = await new Jackets(browser, page).scrape();

    await Email.send(
      `<ul style="list-style:none;">
        ${jackets.map(
          ({ title, href, price }, i) =>
            `<li style="margin-bottom: 20px">
            <div>${title}</div>
            <div>${price}</div>
            <div>${href}</div>
          </li>
        `
        )}
      </ul>`.replace(/\,/g, "")
    );
  } catch (error) {
    console.error("error: ", error);
  }

  await browser.close();
})();
