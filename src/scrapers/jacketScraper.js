const fs = require("fs");

class JacketScraper {
  constructor(page) {
    this.page = page;
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

  async scrape(url) {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
    await this.page.waitFor(2000);
    await this.exhaustInfiniteScroll();

    const jackets = await this.page.evaluate(() => {
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

    // this.writeToFile(jackets);

    return jackets;
  }

  // writeToFile(jackets) {
  //   fs.writeFileSync("../data/jackets.json", JSON.stringify(jackets, null, 2));
  // }
}

module.exports = JacketScraper;
