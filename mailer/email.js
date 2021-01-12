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

    return (
      this.buildSectionHTML("Freshly Added", this.data.newlyAdded) +
      this.buildSectionHTML("Best Matches", this.data.prioritizedResults) +
      this.buildSectionHTML("Other Matches", this.data.otherResults)
    );
  }

  buildSectionHTML(headerTitle, data) {
    return `
      <h3 style="margin-bottom: 20px">${headerTitle}</h3>
        <ul style="list-style:none; margin-bottom: 20px;">
          ${data.map(
            ({ title, href, price }) =>
              `<li style="margin-bottom: 20px">
                <div>${title}</div>
                <div>${price}</div>
                <div>${href}</div>
              </li>`
          )}
        </ul>
      `.replace(/\,/g, "");
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
