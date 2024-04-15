/* eslint-disable @typescript-eslint/no-unused-vars */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as Semver from "semver";
import { ResponseService } from "src/common/response.service";
import * as Dotenv from "dotenv";
Dotenv.config();

@Injectable()
export class NonAuthHeader implements CanActivate {
  constructor(
    private jwtService: JwtService,
    public responseService: ResponseService
  ) {}

  async canActivate(context: ExecutionContext): Promise<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      const error: any = await this.validateHeaders(request);

      if (error) {
        throw this.responseService.error(request, response, error, 501, "en");
      } else if (
        request.headers.authorizations !== process.env.DEFAULT_AUTH_TOKEN
      ) {
        const error: string = "INVALID_DEFAULT_TOKEN";
        throw this.responseService.error(request, response, error, 501);
      } else {
        return true;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async validateHeaders(request: any) {
    try {
      let error: any;
      console.log("req======>", request.headers);
      if (!request.headers.language) {
        return (error = "LANGUAGE_IS_REQUIRED");
      } else if (!request.headers.authorizations) {
        return (error = "AUTHORIZATION_TOKEN_REQUIRED");
      } else if (!request.headers.device_id) {
        return (error = "DEVICE_ID_IS_REQUIRED");
      } else if (!request.headers.device_type) {
        return (error = "DEVICE_TYPE_IS_REQUIRED");
      } else if (!request.headers.app_version) {
        return (error = "APP_VERSION_MISSING");
      } else if (!request.headers.os) {
        return (error = "OS_REQUIRED");
      } else if (!request.headers.device_token) {
        return (error = "DEVICE_TOKEN_REQUIRED");
      } else {
        let version: any, currentAppVersion: any;
        if (request.headers.device_type == "0") {
          version = request.headers.app_version;
          currentAppVersion = process.env.IOS_APP_VERSION;
        }
        if (request.headers.device_type == "1") {
          version = request.headers.app_version;
          currentAppVersion = process.env.ANDROID_APP_VERSION;
        }
        let tmpVersion = version;
        tmpVersion = version.split(".");
        tmpVersion =
          tmpVersion.length < 3
            ? tmpVersion.concat(["0", "0", "0"])
            : tmpVersion;
        tmpVersion.splice(3);
        version = tmpVersion.join(".");

        if (Semver.valid(version) === null) {
          return (error = "INVALID_APP_VERSION");
        } else {
          if (Semver.gte(version, currentAppVersion)) {
          } else {
            return (error = "UPGRADE_APP");
          }
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
