const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

class Email {
  static async send(msg, error = false) {
    console.log(`Sending email ${error ? "error alert" : "alert"}...`);

    transporter.sendMail({
      to: process.env.EMAIL,
      from: process.env.EMAIL,
      subject: error ? "Scraper Error" : "Scraper Results",
      html: msg,
    });

    console.log(`Alert sent successfully.`);
  }
}

module.exports = Email;
