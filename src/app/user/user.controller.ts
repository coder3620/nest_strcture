import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { ResponseService } from "src/common/response.service";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ApiAuthHeaders } from "src/common/swagger.decorator";
import { NonAuthHeader } from "src/guard/nonAuth.guard";
import { SignUpUserDto } from "./dto/signUpUser.dto";
import { LoginUserDto } from "./dto";
import { DecryptHelper } from "src/common/decryptHelper";
import * as Jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { AuthGuard } from "src/guard/auth.guard";
import { SendEmailVerificationDto } from "./dto/emailVerification.dto";
import { SendEmailOtpVerificationDto } from "./dto/sendEmailOtpVerification.dto";
import { ForgotPasswordLinkDto } from "./dto/forgotPasswordLink.dto";
import { ResetPasswordDto } from "./dto/resetPassword.dto";
import { ApiExcludeEndpoint } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { EditUserProfileDto } from "./dto/editUserProfile.dto";
@Controller("/users")
@ApiTags("users")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService,
    public decryptHelper: DecryptHelper
  ) {}

  @Post("/signUp")
  @ApiAuthHeaders()
  @UseGuards(NonAuthHeader)
  async signupUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: SignUpUserDto
  ) {
    try {
      // const bodyData: any = await this.decryptHelper.signupDecrypter(body);
      const data = await this.userService.signUp(body);
      return this.responseService.success(res, "SEND_EMAIL", data);
    } catch (error) {
      console.log(error);
      return this.responseService.error(req, res, error.message);
    }
  }

  @Post("/login")
  @ApiAuthHeaders()
  @ApiConsumes("application/x-www-form-urlencoded")
  @ApiBody({ type: LoginUserDto })
  @UseGuards(NonAuthHeader)
  async loginUser(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: LoginUserDto
  ) {
    try {
      // const bodyData: any = await this.decryptHelper.loginDecrypter(body);
      const data = await this.userService.login(req, body);
      if (data.isVerify == 0) {
        return this.responseService.success(res, "SEND_EMAIL", data);
      } else {
        return this.responseService.success(res, "LOGIN_SUCCESS", data);
      }
    } catch (error) {
      console.log(error);
      return this.responseService.error(req, res, error.message);
    }
  }
  @Post("/resendOtp")
  @ApiAuthHeaders()
  @ApiConsumes("application/x-www-form-urlencoded")
  @ApiBody({ type: SendEmailVerificationDto })
  @UseGuards(NonAuthHeader)
  async emailVerification(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: SendEmailVerificationDto
  ) {
    try {
      // const bodyData: any = await this.decryptHelper.emailVerificationDecrypter(
      //   body
      // );
      const data = await this.userService.resendOtp(body);
      return this.responseService.success(res, "SEND_EMAIL", data);
    } catch (error) {
      console.log(error);
      return this.responseService.error(req, res, error.message);
    }
  }
  @Post("/otpVerification")
  @ApiAuthHeaders()
  @ApiConsumes("application/x-www-form-urlencoded")
  @ApiBody({ type: SendEmailOtpVerificationDto })
  @UseGuards(NonAuthHeader)
  async otpVerification(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: SendEmailOtpVerificationDto
  ) {
    try {
      // const bodyData: any = await this.decryptHelper.otpVerificationDecrypter(
      //   body
      // );
      const data = await this.userService.otpVerficaction(req, body);
      return this.responseService.success(res, "OTP_VERIFICATION", data);
    } catch (error) {
      console.log(error);
      return this.responseService.error(req, res, error.message);
    }
  }
  @Post("/forgotPasswordLink")
  @ApiAuthHeaders()
  @ApiConsumes("application/x-www-form-urlencoded")
  @ApiBody({ type: ForgotPasswordLinkDto })
  @UseGuards(NonAuthHeader)
  async forgotPasswordLink(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ForgotPasswordLinkDto
  ) {
    try {
      // const bodyData: any =
      //   await this.decryptHelper.forgotPasswordLinkDecrypter(body);
      const data = await this.userService.forgotPasswordLink(body);
      return this.responseService.success(res, "FORGOT_PASSWORD_LINK", data);
    } catch (error) {
      console.log(error);
      return this.responseService.error(req, res, error.message);
    }
  }
  @Get("/forgotPassword/:token")
  @ApiExcludeEndpoint()
  async getforgotPassword(
    @Param("token") token: string,
    @Req() req,
    @Res() res: Response
  ) {
    try {
      return res.render("layout.ejs", { token: token });
    } catch (error) {
      return this.responseService.error(req, res, error.message);
    }
  }

  @Post("/resetpassword/:token")
  @ApiExcludeEndpoint()
  async forgotPassword(@Req() req: Request, @Res() res: Response) {
    try {
      console.log("req.body", req.body);

      const data = await this.userService.forgotPassword(req, req.body);
      const status = true;
      const msg = data;

      return res.render("layout.ejs", {
        token: req.params,
        status: status,
        msg: msg,
      });
    } catch (error) {
      console.log(error);
      return this.responseService.error(req, res, error.message);
    }
  }

  async getUserId(@Req() req: Request) {
    try {
      const token: any = await req.headers.authorizations;
      const userData: any = await Jwt.decode(token);
      const userId: any = userData.userId;
      return userId;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  @Post("/resetPassword")
  @ApiAuthHeaders()
  @UseGuards(AuthGuard)
  async resetPassword(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: ResetPasswordDto
  ) {
    try {
      const userId: any = await this.getUserId(req);
      const data = await this.userService.resetPassword(userId, body);
      return this.responseService.success(res, "RESET_PASSWORD_SUCCESS", data);
    } catch (error) {
      return this.responseService.error(req, res, error.message);
    }
  }

  @Delete("/deleteOwnAccount")
  @UseGuards(AuthGuard)
  async deleteOwnAccount(@Req() req: Request, @Res() res: Response) {
    try {
      const userId = await this.getUserId(req);
      const data: any = await this.userService.deleteOwnAccount(userId);
      return this.responseService.success(res, "USER_DELETE", data);
    } catch (error) {
      return this.responseService.error(req, res, error.message);
    }
  }

  @Put("/editUserProfile")
  @ApiAuthHeaders()
  @ApiConsumes("multipart/form-data")
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor("user_image"))
  async editUserProfile(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: EditUserProfileDto,
    @UploadedFile() user_image: Express.Multer.File
  ) {
    try {
      console.log("user_image *****", user_image);

      const userId: any = await this.getUserId(req);
      const data = await this.userService.editUserProfile(
        body,
        user_image,
        userId
      );
      return this.responseService.success(res, "UPDATE_PROFILE_SETUP", data);
    } catch (error) {
      return this.responseService.error(req, res, error.message);
    }
  }
}
