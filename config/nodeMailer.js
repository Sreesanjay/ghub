var nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sreesanjay7592sachu@gmail.com',
    pass: 'muujjvhhtmpekcqe'
  }
});
const sendMail = (mailOptions) => {
  transporter.sendMail(mailOptions).then((info) => {
    console.log('Email sent successfully. Message ID:');

  }).catch((error) => {
    console.error('Error sending email:', error);
    throw new Error('Error sending email')
  });
}
module.exports = { sendMail }

