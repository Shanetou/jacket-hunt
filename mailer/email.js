const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

class Email {
  constructor(data, isError = false) {
    this.data = data;
    this.isError = isError;

    this.message = "";
  }

  buildMessage() {
    if (this.isError) {
      return data;
    }

    const { prioritizedResults, otherResults } = this.data;

    return `
            <h3 style="margin-bottom: 20px">Best Matches</h3>
            <ul style="list-style:none; margin-bottom: 20px;">
              ${prioritizedResults.map(
                ({ title, href, price }) =>
                  `<li style="margin-bottom: 20px">
                    <div>${title}</div>
                    <div>${price}</div>
                    <div>${href}</div>
                  </li>`
              )}
            </ul>
            <h3 style="margin-bottom: 20px">Other Matches</h3>
            <ul style="list-style:none; margin-bottom: 20px;">
              ${otherResults.map(
                ({ title, href, price }) =>
                  `<li style="margin-bottom: 20px">
                    <div>${title}</div>
                    <div>${price}</div>
                    <div>${href}</div>
                  </li>`
              )}
            </ul>`.replace(/\,/g, "");
  }

  async send() {
    console.log(`Sending email ${this.isError ? "error alert" : "alert"}...`);

    transporter.sendMail({
      to: process.env.EMAIL,
      from: process.env.EMAIL,
      subject: this.isError ? "Scraper Error" : "Scraper Results",
      html: this.buildMessage(),
    });

    console.log(`Alert sent successfully.`);
  }
}

module.exports = Email;
