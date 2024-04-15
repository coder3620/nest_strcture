import { Injectable, Logger } from "@nestjs/common";
import * as Messages from "./messages.json";

@Injectable()
export class ResponseService {
  private readonly logger = new Logger(ResponseService.name);

  async error(req: any, res: any, msg: any, statusCode = 500, language = "en") {
    if (typeof msg === "string") {
      msg = this.getMessage(msg, language)
        ? this.getMessage(msg, language)
        : msg;
    }
    console.log("message", msg);
    if (msg == "User is blocked by admin") statusCode = 403;
    // if (msg == "TOKEN_EXPIRED") statusCode = 405;
    const response = {
      code: 0,
      status: "FAIL",
      message: msg,
    };

    const d = new Date();
    const formatted_date = `${d.getFullYear()}-${
      d.getMonth() + 1
    }-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
    msg = typeof msg == "object" ? JSON.stringify(msg) : msg;
    this.logger.error(
      `[${formatted_date}] ${req.method}:${req.originalUrl} ${msg}`
    );

    res.status(statusCode).json(response);
  }

  async success(
    res: any,
    msg: any,
    data: any,
    statusCode = 200,
    language = "en"
  ) {
    try {
      if (typeof msg === "string") {
        msg = await this.getMessage(msg, language);
      }
      const response = {
        code: 1,
        status: "SUCCESS",
        message: msg,
        data: data /* ? data : {} */,
      };

      res.status(statusCode).json(response);
    } catch (error) {
      console.log(`\nsuccess error ->> `, error);
      return;
    }
  }

  getMessage(msg: string, language: string) {
    const lang = language ? language : "en";
    return Messages[lang][msg];
    // return Messages[lang][msg] || Messages[lang]["SOMETHING_WENT_WRONG"];
  }
}
