import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.PASSWORD,
  },
});

class EmailController {
  static testMail(req, res) {
    const mailOptions = {
      from: 'noreply@precioustosin.github.io', // sender address
      to: 'precioustosin@hotmail.com', // list of receivers
      subject: 'Testing email functtionality with Nodemailer', // Subject line
      html: '<strong>and easy to do anywhere, even with Node.js</strong>', // plain text body
    };

    transporter.sendMail(mailOptions)
      .then((info) => {
        res.status(200).json({ status: 200, data: { msg: 'email sent', data: info } });
      })
      .catch((error) => {
        res.status(400).json({ status: 400, error });
      });
  }

  static sendMail(mailOptions) {
    return new Promise((resolve, reject) => transporter.sendMail(mailOptions)
      .then(info => resolve(info))
      .catch(error => reject(error)));
  }
}

export default EmailController;
