/* eslint-disable @typescript-eslint/no-var-requires */
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { EmailService } from "src/common/email.service";
import { UserAccount } from "src/entities/userAccount.entity";
import { Repository } from "typeorm";
import { UserDeviceRelation } from "src/entities/userDeviceRelation.entity";
import * as Crypto from "crypto";
import * as Bcrypt from "bcrypt";
import { LoginUserDto } from "./dto";
import { DecryptHelper } from "src/common/decryptHelper";
import { EditUserProfileDto } from "./dto/editUserProfile.dto";

const emailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
const passwordLengthRegex = /^.{8,}$/;
const resetTokens = {};

@Injectable()
export class UserService {
  constructor(
    private jwtService: JwtService,
    private emailService: EmailService,
    public decryptHelper: DecryptHelper,
    @InjectRepository(UserAccount)
    public userAccountRepository: Repository<UserAccount>,
    @InjectRepository(UserDeviceRelation)
    public userDeviceRelation: Repository<UserDeviceRelation>
  ) {}

  async signUp(body: any): Promise<any> {
    try {
      console.log("body++++ " + body);

      if (body.email) {
        body.email = body.email.toLowerCase().trim();
      }

      const emailValid = await this.isEmailAddressValid(body.email);
      if (emailValid == false) {
        throw new UnauthorizedException("EMAIL_NOT_VALID");
      }

      const passwordValid = await this.isPasswordLengthValid(body.password);
      if (passwordValid == false) {
        throw new UnauthorizedException("NOT_VALID_PASSWORD_LENGTH");
      }

      const emailFind: any = await this.userAccountRepository.findOne({
        where: { email: body.email, isDeleted: 0 },
      });

      if (emailFind && emailFind.email == body.email) {
        throw new UnauthorizedException("EMAIL_ALREADY_EXITS");
      }

      const hashPassword: string = await Bcrypt.hash(
        body.password.trim(),
        parseInt(process.env.SALT_ROUND)
      );

      const addUser: any = await this.userAccountRepository.save([
        {
          firstName: body.firstName.trim(),
          lastName: body.lastName.trim(),
          email: body.email.trim(),
          password: hashPassword,
          register_type: 1,
        },
      ]);

      const userId: any = addUser[0].userId;
      const userData: any = await this.userAccountRepository
        .createQueryBuilder("user_account")
        .select([
          `user_account.userId as "userId"`,
          `user_account.firstName as "firstName"`,
          `user_account.lastName as "lastName"`,
          `user_account.email as "email"`,
          `user_account.isVerify as "isVerify"`,
        ])
        .andWhere("user_account.userId = :userId", { userId: userId })
        .execute();
      if (userData) {
        await this.sendOtp(body.email);
      }
      return userData;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
  async isEmailAddressValid(email: string) {
    return emailPattern.test(email);
  }
  async isPasswordLengthValid(password: string) {
    return passwordLengthRegex.test(password);
  }

  async login(req: any, body: LoginUserDto): Promise<any> {
    try {
      if (body.email) {
        body.email = body.email.toLowerCase().trim();
      }
      const emailValid = await this.isEmailAddressValid(body.email);
      if (emailValid == false) {
        throw new UnauthorizedException("EMAIL_NOT_VALID");
      }
      const passwordValid = await this.isPasswordLengthValid(body.password);

      if (passwordValid == false) {
        throw new UnauthorizedException("NOT_VALID_PASSWORD_LENGTH");
      }

      const userEmailVerify: any = await this.userAccountRepository.findOne({
        where: { email: body.email, isDeleted: 0 },
      });

      if (userEmailVerify && userEmailVerify.isActive == 0) {
        throw new ForbiddenException("USER_BLOCKED");
      }

      if (!userEmailVerify) {
        const userEmailDeleted: any = await this.userAccountRepository.findOne({
          where: { email: body.email, isDeleted: 1 },
        });
        if (userEmailDeleted) {
          const deletedPasswordVerify: any = await Bcrypt.compare(
            body.password,
            userEmailDeleted.password
          );
          if (deletedPasswordVerify == true) {
            throw new UnauthorizedException("USER_IS_DELETED");
          } else {
            throw new UnauthorizedException("INVALID_PASSWORD");
          }
        } else {
          throw new UnauthorizedException("INVALID_EMAIL");
        }
      }

      const passwordVerify: any = await Bcrypt.compare(
        body.password,
        userEmailVerify.password
      );
      if (passwordVerify == true) {
        const token: string = await this.jwtService.sign(
          { userId: userEmailVerify.userId, isUser: true },
          {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: process.env.JWT_EXPIRE_TIME,
          }
        );
        if (userEmailVerify && userEmailVerify.isVerify == 0) {
          await this.sendOtp(userEmailVerify.email);
        }
        const refresh_token: string = await this.jwtService.sign(
          { userId: userEmailVerify.userId, isUser: true },
          {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: process.env.REFRESH_EXPIRE_TIME,
          }
        );

        await this.userAccountRepository.update(
          { userId: userEmailVerify.userId },
          { authToken: token, refresh_token }
        );

        const deviceRelation = await this.userDeviceRelation.findOne({
          where: {
            fk_user_id: userEmailVerify.userId,
            deviceId: req.headers.device_id,
          },
        });

        if (deviceRelation) {
          await this.updateDevicerelation(
            req.headers,
            deviceRelation,
            userEmailVerify.userId
          );
        } else {
          await this.saveDevicerelation(
            req.headers,
            deviceRelation,
            userEmailVerify.userId
          );
        }
        const userData: any = await this.userAccountRepository.findOne({
          where: { userId: userEmailVerify.userId },
        });
        return {
          userId: userData.userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          authToken: token,
          refreshToken: refresh_token,
          isVerify: userData.isVerify,
          isProfileSetup: userData.isProfileComplete,
          appleId:
            userData.appleId == null
              ? (userData.appleId = "")
              : userData.appleId,
          googleId:
            userData.googleId == null
              ? (userData.googleId = "")
              : userData.googleId,
          instagramId:
            userData.instagramId == null
              ? (userData.instagramId = "")
              : userData.instagramId,
        };
      } else {
        throw new UnauthorizedException("INVALID_PASSWORD");
      }
    } catch (error) {
      console.log("Error", error);
      throw error;
    }
  }

  async resendOtp(body: any): Promise<any> {
    try {
      if (body.email) {
        body.email = body.email.toLowerCase().trim();
      }

      const emailValid = await this.isEmailAddressValid(body.email);
      if (emailValid == false) {
        throw new UnauthorizedException("EMAIL_NOT_VALID");
      }
      const otp: any = Math.floor(1000 + Math.random() * 9000);
      const emailVerify: any = await this.userAccountRepository.findOne({
        where: { email: body.email, isDeleted: 0, isActive: 1 },
      });
      if (emailVerify && emailVerify.isActive == 0) {
        throw new UnauthorizedException("USER_BLOCKED");
      }
      if (!emailVerify) throw new UnauthorizedException("INVALID_EMAIL");
      await this.userAccountRepository.update(
        { email: emailVerify.email, isDeleted: 0, isActive: 1 },
        { otp: otp }
      );
      const sendData: any = {
        subject: "SEND_OTP",
        message: `${otp}`,
        firstName: emailVerify.firstName,
      };
      const sendMail: any = await this.emailService.sendMail(
        emailVerify.email,
        sendData
      );
      return sendMail;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
  async sendOtp(email: any) {
    try {
      if (email) {
        email = email.toLowerCase().trim();
      }
      const otp: any = Math.floor(1000 + Math.random() * 9000);
      const emailverify: any = await this.userAccountRepository.findOne({
        where: { email: email, isDeleted: 0, isActive: 1 },
      });
      if (!emailverify) throw new UnauthorizedException("INVALID_EMAIL");

      await this.userAccountRepository.update(
        { email: emailverify.email, isDeleted: 0, isActive: 1 },
        { otp: otp }
      );
      const senddata: any = {
        subject: "SEND_OTP",
        message: `${otp}`,
        firstName: emailverify.firstName,
      };

      await this.emailService.sendMail(emailverify.email, senddata);
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
  async otpVerficaction(req: any, body: any): Promise<any> {
    try {
      if (body.email) {
        body.email = body.email.toLowerCase().trim();
      }
      const emailValid = await this.isEmailAddressValid(body.email);
      if (emailValid == false) {
        throw new UnauthorizedException("EMAIL_NOT_VALID");
      }
      const userData: any = await this.userAccountRepository.findOne({
        where: { email: body.email, isDeleted: 0, isActive: 1 },
      });
      if (userData && userData.isActive == 0) {
        throw new UnauthorizedException("USER_BLOCKED");
      }
      if (!userData) {
        throw new UnauthorizedException("USER_NOT_FOUND");
      }
      if (body.otp == userData.otp) {
        await this.userAccountRepository.update(
          { email: userData.email, isDeleted: 0, isActive: 1 },
          { otp: null, isVerify: 1 }
        );

        const token: any = await this.jwtService.sign(
          { userId: userData.userId, isUser: true },
          {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: process.env.JWT_EXPIRE_TIME,
          }
        );
        const refresh_token: any = await this.jwtService.sign(
          { userId: userData.userId, isUser: true },
          {
            secret: process.env.JWT_SECRET_KEY,
            expiresIn: process.env.REFRESH_EXPIRE_TIME,
          }
        );

        await this.userAccountRepository.update(
          { userId: userData.userId },
          { authToken: token, refresh_token }
        );
        const userDeviceRelation: any = await this.userDeviceRelation.findOne({
          where: {
            fk_user_id: userData.userId,
            deviceId: req.headers.device_id,
          },
        });
        if (userDeviceRelation) {
          await this.updateDevicerelation(
            req.headers,
            userDeviceRelation,
            userData.userId
          );
        } else {
          await this.saveDevicerelation(
            req.headers,
            userDeviceRelation,
            userData.userId
          );
        }
        const userIsVerify: any = await this.userAccountRepository.findOne({
          where: { email: body.email, isDeleted: 0, isActive: 1 },
        });
        return {
          authToken: token,
          userId: userData.userId,
          firstName: userData.firstName,
          lastName: userData.lastName,
          isVerify: userIsVerify.isVerify,
          email: userData.email,
          isProfileSetup: userData.isProfileComplete,
          appleId:
            userData.appleId == null
              ? (userData.appleId = "")
              : userData.appleId,
          googleId:
            userData.googleId == null
              ? (userData.googleId = "")
              : userData.googleId,
          instagramId:
            userData.instagramId == null
              ? (userData.instagramId = "")
              : userData.instagramId,
        };
      } else {
        throw new UnauthorizedException("INVALID_OTP");
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
  async forgotPasswordLink(body: any): Promise<any> {
    try {
      if (body.email) {
        body.email = body.email.toLowerCase().trim();
      }
      const emailValid = await this.isEmailAddressValid(body.email);
      if (emailValid == false) {
        throw new UnauthorizedException("EMAIL_NOT_VALID");
      }

      const userData: any = await this.userAccountRepository.findOne({
        where: { email: body.email, isDeleted: 0, isActive: 1 },
      });

      if (!userData) {
        throw new UnauthorizedException("INVALID_EMAIL");
      }
      if (userData && userData.isActive == 0) {
        throw new UnauthorizedException("USER_BLOCKED");
      }
      const token = Crypto.randomBytes(32).toString("hex");
      resetTokens[token] = {
        userId: userData.userId,
        expiresAt: Date.now() + 2 * 60 * 60 * 1000,
        // expiresAt: Date.now() + 50 * 1000,
      };
      const resetLink = `${process.env.LIVE_FORGOT_LINK}/${token}`;
      console.log("resetLink", resetLink);
      const sendData: any = {
        link: resetLink,
        firstName: userData.firstName,
      };
      const sendMail: any = await this.emailService.sendMailForgot(
        userData.email,
        sendData
      );
      console.log("sendMail===", sendMail);
      return sendMail;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async forgotPassword(req: any, body: any): Promise<any> {
    try {
      const { token } = req.params;
      const tokendata: any = resetTokens[token];
      console.log("tokendata", tokendata);
      const passwordValid = await this.isPasswordLengthValid(body.password);
      if (passwordValid == false) {
        throw new UnauthorizedException("NOT_VALID_PASSWORD_LENGTH");
      }

      if (!tokendata || tokendata.expiresAt < Date.now()) {
        return "LINK EXPIRED";
      }
      const user: any = await this.userAccountRepository.findOne({
        where: { userId: tokendata.userId },
      });

      if (!user) throw new UnauthorizedException("USER_NOT_FOUND");

      const hashpassword: any = await Bcrypt.hash(
        body.password,
        parseInt(process.env.SALT_ROUND)
      );
      await this.userAccountRepository.update(
        { userId: user.userId },
        { password: hashpassword }
      );
      return "Password Update successfully";
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
  async resetPassword(userId: any, body: any): Promise<any> {
    try {
      const passwordValid = await this.isPasswordLengthValid(body.password);
      if (passwordValid == false) {
        throw new UnauthorizedException("NOT_VALID_PASSWORD_LENGTH");
      }
      const userPasswordVerify: any = await this.userAccountRepository.findOne({
        where: { userId: userId },
      });
      const passwordVerify: any = await Bcrypt.compare(
        body.old_password,
        userPasswordVerify.password
      );
      if (body.old_password == body.password) {
        throw new UnauthorizedException("NOT_MATCH_OLD_PASSWORD_AND_PASSWORD");
      }
      if (passwordVerify == false) {
        throw new UnauthorizedException("INVALID_OLD_PASSWORD");
      }
      const hashPassword: any = await Bcrypt.hash(
        body.password,
        parseInt(process.env.SALT_ROUND)
      );
      await this.userAccountRepository.update(
        { userId: userId },
        { password: hashPassword }
      );
      return "Password Update successfully";
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async deleteOwnAccount(userId) {
    try {
      const findUser: any = await this.userAccountRepository.findOne({
        where: {
          userId: userId,
        },
      });
      if (!findUser) throw new UnauthorizedException("USER_NOT_FOUND");

      await this.userAccountRepository.update(
        { userId: userId },
        {
          isDeleted: 1,
        }
      );

      return true;
    } catch (error) {
      throw error;
    }
  }

  async updateDevicerelation(headers, userDeviceRelation, userId) {
    try {
      await this.userDeviceRelation.update(
        {
          user_device_relation_id: userDeviceRelation.user_device_relation_id,
        },
        {
          fk_user_id: userId,
          deviceId: headers.device_id,
          deviceToken: headers.device_token,
          deviceType: headers.device_type,
          os: headers.os,
          appVersion: headers.app_version,
          current_version:
            headers.device_type == "1"
              ? process.env.ANDROID_APP_VERSION
              : process.env.IOS_APP_VERSION,
        }
      );
    } catch (error) {
      throw error;
    }
  }
  async saveDevicerelation(headers, userDeviceRelation, userId) {
    try {
      await this.userDeviceRelation.save([
        {
          fk_user_id: userId,
          deviceId: headers.device_id,
          deviceToken: headers.device_token,
          deviceType: headers.device_type,
          os: headers.os,
          appVersion: headers.app_version,
          current_version:
            headers.device_type == "1"
              ? process.env.ANDROID_APP_VERSION
              : process.env.IOS_APP_VERSION,
        },
      ]);
    } catch (error) {
      throw error;
    }
  }

  async editUserProfile(
    body: EditUserProfileDto,
    user_image: Express.Multer.File,
    userId: number
  ): Promise<any> {
    try {
      const userData: any = await this.userAccountRepository.findOne({
        where: { userId: userId },
      });

      const userAccount: UserAccount = new UserAccount();

      userAccount.firstName = body.firstName;
      userAccount.lastName = body.lastName;

      if (user_image) {
        userAccount.user_image = user_image.filename;
      }
      await this.userAccountRepository.update({ userId: userId }, userAccount);

      console.log("userData------ ", userData);

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
