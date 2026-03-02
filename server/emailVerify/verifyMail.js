import nodemailer from "nodemailer"
import 'dotenv/config'
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import handlebars from "handlebars"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const verifyMail = async (token, email) => {
    try {
        // Read template
        const emailTemplateSource = fs.readFileSync(
            path.join(__dirname, "template.hbs"),
            "utf-8"
        )
        const template = handlebars.compile(emailTemplateSource)
        const htmlToSend = template({ token: encodeURIComponent(token) })

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS //gmail থেকে App password নিতে হবে
            }
        })

        // Optional: verify transporter
        await transporter.verify()

        // Mail options
        const mailConfigurations = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Email Verification',
            html: htmlToSend,
            text: `Please verify your email using this token: ${token}`
        }

        const info = await transporter.sendMail(mailConfigurations)
        console.log('Email sent successfully');
        console.log(info)
    } catch (error) {
        console.error('Error sending email:', error)
        throw new Error(error)
    }
}

