const nodemailer = require('nodemailer');
const user = require('../models/modelUsers')
const jwt = require('jsonwebtoken')
require('dotenv').config();



    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        }
    })

    const token = jwt.sign({
        data: 'Token Data'
    }, 'ourSecretKey', { expiresIn: '10m' }  
    );


    const emailDb = (req) => { user.getByUser(req.body.email)}

    const mailConfigurations = {
  
        // It should be a string of sender/server email
        from: process.env.EMAIL,
      
        to: emailDb,
      
        // Subject of Email
        subject: 'Email Verification',
          
        // This would be the text of email body
        text: `Hi! There, You have recently visited 
               our website and entered your email.
               Please follow the given link to verify your email
               http://localhost:3000/verify/${token} 
               Thanks`
          
    };

    transporter.sendMail(mailConfigurations, function(error, info){
        if (error) console.error(error);
        console.log('Email Sent Successfully');
        console.log(info);
    });

module.exports = {
    transporter,
    mailConfigurations
}
