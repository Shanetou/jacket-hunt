const fs = require("fs");

const URL =
  "https://wornwear.patagonia.com/shop/mens-jackets-and-vests?category=Jackets&size=S";

class Jackets {
  constructor(browser, page) {
    this.browser = browser;
    this.page = page;

    this.jackets = [];
  }

  // handle auto-scroll
  async scrape() {
    await this.page.goto(URL, { waitUntil: "domcontentloaded" });
    await this.page.waitFor(2000);

    this.jackets = await this.page.evaluate(() => {
      return Array.from(
        document.querySelectorAll("article.Results > div > ol > li")
      ).map((listItem) => {
        const name = listItem.querySelector("a > footer > span");
        const href = listItem.querySelector("a");
        const price = listItem.querySelector("a > footer > div > div > span");

        return [
          {
            title: name && name.innerText,
            href: href && href.href,
            price: price && price.innerText,
          },
        ];
      });
    });

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
