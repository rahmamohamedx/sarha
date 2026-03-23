
import nodemailer from "nodemailer"
import { env } from "../../config/env.service.js";


const transporter = nodemailer.createTransport({
 service: "gmail",
  auth: {
    user: env.app_email,
    pass: env.app_pass
  },
});


export const sendEmail=async({to, subject, html})=>{
  const info = await transporter.sendMail({
    from: `"Rahma Mohamed" <${env.app_email}>`,
    to, 
    subject,
    html}) 
}