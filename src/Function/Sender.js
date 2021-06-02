const nodemailer = require("nodemailer");

async function sendMessage(userName,verificationLink){
  const transporter = nodemailer.createTransport({
      host: 'smtp.mail.yahoo.com',
      port: 465,
      service:'yahoo',
      secure: false,
      auth: {
          user: process.env.ADMIN_USERNAME,
          pass: process.env.ADMIN_PASSWORD
        },
      debug: false,
      logger: true
  });

   const mailOptions = {
     from: 'shamsiadnan950@yahoo.com',
     to: userName,
     subject: 'Account Verification Link',
     text: `Hello  ${userName} ,\n\n Welcome to CodeNCollab
           Community \n \n Please verify your account
           by clicking on the link: ${verificationLink} \n\nThank You!\n`
   };

   transporter.sendMail(mailOptions, function (err) {
       if (err) {
          console.log(err)
         return;
       }
       return ;
   });

}

module.exports = sendMessage;
