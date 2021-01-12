const fs = require("fs");
const { buildResultsData } = require("../utils");

const URL =
  "https://wornwear.patagonia.com/shop/mens-jackets-and-vests?category=Jackets&size=S";

class Jackets {
  constructor(browser, page) {
    this.browser = browser;
    this.page = page;

    this.jackets = [];
  }

  async exhaustInfiniteScroll() {
    await this.page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        const distance = 100;

        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  }

  async scrape() {
    await this.page.goto(URL, { waitUntil: "domcontentloaded" });
    await this.page.waitFor(2000);
    await this.exhaustInfiniteScroll();

    const scrappedJackets = await this.page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("article.Results > div > ol > li")
      ).map((listItem) => {
        const name = listItem.querySelector("a > footer > span");
        const href = listItem.querySelector("a");
        const price = listItem.querySelector("a > footer > div > div > span");

        return {
          title: name && name.innerText,
          href: href && href.href,
          price: price && price.innerText,
        };
      });
    });

    this.jackets = buildResultsData(scrappedJackets);

    this.writeToFile();

    return this.jackets;
  }

  writeToFile() {
    fs.writeFileSync(
      "./data/jackets.json",
      JSON.stringify(this.jackets, null, 2)
    );
  }
}

module.exports = Jackets;
