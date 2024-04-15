/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createTransport, Transporter } from "nodemailer";

import * as Dotenv from "dotenv";
import { Injectable } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import * as fs from "fs";
import { join, dirname } from "path";
import * as handlebars from "handlebars";
import * as path from "path";
Dotenv.config();

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      secure: true,
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  async sendMail(toMail: string, data: any) {
    try {
      const getPath = path.join(__dirname, "./../../public");
      console.log("----", getPath);
      const templatePath = path.join(getPath, "sendotp.html");
      const otp = data.message;
      const  firstName = data.firstName;
      const html = await this.renderHbsTemplate(templatePath, {
        firstName,
        otp,
        toMail,
      });

      this.transporter.sendMail({
        from: "tristate.mteam@gmail.com",
        to: toMail,
        subject: "OTP VERIFICATION",
        html: html,
      });
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }

  async sendMailForgot(toMail: string, data: any) {
    try {
      const getPath = path.join(__dirname, "./../../public");
      console.log("----", getPath);
      const templatePath = path.join(getPath, "forgotpasswordlink.html");
      const link = data.link;
      const firstName = data.firstName;
      const html = await this.renderHbsTemplate(templatePath, {
        link,
        firstName,
      });

     this.transporter.sendMail({
        from: "tristate.mteam@gmail.com",
        to: toMail,
        subject: "FORGOT PASSWORD",
        html: html,
      });

    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }
  }

  async renderHbsTemplate(templatePath: string, data: any): Promise<string> {
    const template = handlebars.compile(fs.readFileSync(templatePath, "utf-8"));
    return template(data);
  }

  private prepareMessage(template: string, data): string {
    const compiledTemplate = handlebars.compile(template);
    return compiledTemplate(data);
  }
}
