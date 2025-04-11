import nodemailer from 'nodemailer';
import User from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
export const sendEmail = async({email,emailType,userId}:any)=>{
  try {
    const uniqueString = uuidv4()

    await bcryptjs.hash(userId.toString(),10)
    if(emailType==="VERIFY"){
      await User.findByIdAndUpdate(userId, {$set:{verifyToken:uniqueString,verifyTokenExpiry: Date.now() + 24*60*60*1000}})
    }
    else if(emailType==="RESET"){
      await User.findByIdAndUpdate(userId, {$set:{forgotPasswordToken:uniqueString,forgotPasswordTokenExpiry: Date.now() + 24*60*60*1000}})
    }
     
   
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "69438a7e434a4b",
    pass: "2d4d2af36bc469"
  }
});
// var transporter = nodemailer.createTransport({
//   host:process.env.SMTP_HOST ,
//   port: process.env.SMTP_PORT,
//   auth: {
//     user:process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   }
// });

    const mailOptions = {
      from: 'Sagar@gmail.com', 
      to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${uniqueString}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${uniqueString}
            </p>`
    }

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    console.log("something went wrong in sending email",error);
    
  }
}