const nodemailer = require("nodemailer");

class Emailer {
  constructor(destinationEmail = process.env.MENS_RESULTS_EMAIL) {
    this.destinationEmail = destinationEmail;
  }

  buildMessage(data, isError) {
    if (isError) {
      return data;
    }

    return (
      this.buildSectionHTML("Best Matches", data.prioritizedResults) +
      this.buildSectionHTML("Other Matches", data.otherResults)
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

  async send(data, isError = false) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAILER_USER,
        pass: process.env.EMAILER_PASSWORD,
      },
    });

    console.log(`Sending email ${isError ? "error alert" : "alert"}...`);

    transporter.sendMail({
      to: this.destinationEmail,
      from: process.env.EMAILER_USER,
      subject: isError ? "Scraper Error" : "Scraper Results",
      html: this.buildMessage(data, isError),
    });

    console.log(`Alert sent successfully.`);
  }
}

module.exports = Emailer;
