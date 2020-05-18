const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'codewebtraffic@gmail.com',
    pass: '5338iI015'
  }
});

const common = {

    sendMail: async (to,subject,text)=>{

        var mailOptions = {
            from: 'shan.rohitkumar12@gmail.com',
            to: to,
            subject:subject,
            text: text
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          }); 
    }



}

module.exports = common;