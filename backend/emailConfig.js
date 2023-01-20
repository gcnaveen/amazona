import nodemailer from 'nodemailer'

import dotenv from 'dotenv';


dotenv.config();
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HODT,
  port: process.env.MAIL_PROT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.verify().then(console.log).catch(console.error);

export const passwordResetMail = ({TO,OTP}) => {

  transporter.sendMail({
    to:TO,

    from: process.env.From_EMAIL,

    subject: "Password Reset",

      html: `Hello, We heard that you lost your password. your one time password is <strong>${OTP}</strong>
    
  
  `,
  });
};


// module.exports = { passwordReset };
