require("dotenv/config");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const configSendMail = async (email, confirmationCode, condition) => {
  let mailOptions = {};

  if (condition == "activate") {
    mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Activation Account",
      text: `Open this link for account verification : http://localhost:3000/verification/${confirmationCode} `,
    };
  }

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("email sent", info.response);
        resolve(info);
      }
    });
  });
};

module.exports = configSendMail;
