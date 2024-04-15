/* eslint-disable prettier/prettier */
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NonAuthHeader } from "./nonAuth.guard";
import { ResponseService } from "src/common/response.service";
import { UserDeviceRelation } from "src/entities/userDeviceRelation.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as Dotenv from "dotenv";
import { AdminNonAuthHeader } from "./adminNonAuth.guard";
import { UserAccount } from "src/entities/userAccount.entity";
Dotenv.config();
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    public nonAuth: NonAuthHeader,
    public adminNonAuth: AdminNonAuthHeader,
    public responseService: ResponseService,
    @InjectRepository(UserDeviceRelation)
    public userDeviceRelation: Repository<UserDeviceRelation>,
    @InjectRepository(UserAccount)
    public userAccount: Repository<UserAccount>
  ) {}
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = request.headers.authorizations;
    if (!token) {
      throw new UnauthorizedException("AUTH_TOKEN_REQUIRED");
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET_KEY,
      });
      if (payload) {
        if (payload.isUser == true) {
          const error = await this.nonAuth.validateHeaders(request);
          if (error) {
            throw this.responseService.error(
              request,
              response,
              error,
              501,
              "en"
            );
          }
          request.body.userId = payload.userId;
          const userData: any = await this.userAccount.findOne({
            where: { userId: payload.userId },
          });
          if (userData.isActive == 0) {
            throw new ForbiddenException("User is blocked by admin");
          }
          if (userData.isDeleted == 1) {
            throw new ForbiddenException("User is deleted");
          }
          const userDeviceRelation = await this.userDeviceRelation.findOne({
            where: {
              fk_user_id: payload.userId,
              deviceId: request.headers.device_id,
            },
          });
          if (!userDeviceRelation) {
            throw new UnauthorizedException("PLEASE_LOGIN");
          }
          if (request.url.includes("/admin")) {
            throw new UnauthorizedException("TOKEN_MALFORMED");
          }
        } else if (payload.isAdmin == true) {
          request.body.adminId = payload.adminId;
          const adminNonAuthError = await this.adminNonAuth.validateHeaders(
            request
          );
          if (adminNonAuthError) {
            throw new UnauthorizedException(adminNonAuthError);
          }
          if (request.url.includes("/users")) {
            throw new UnauthorizedException("TOKEN_MALFORMED");
          }
        } else throw new UnauthorizedException("TOKEN_MALFORMED");
      } else {
        throw new UnauthorizedException("TOKEN_MALFORMED");
      }
    } catch (error) {
      if(error.message == 'User is blocked by admin'){
        throw error;
      }
      if(error.message == 'User is deleted'){
        throw error;
      }
      throw new UnauthorizedException(error);
  }
    return true;
  }
}
