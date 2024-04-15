import { UnauthorizedException } from "@nestjs/common";
import * as CryptoJS from "crypto-js";
import * as Dotenv from "dotenv";
Dotenv.config();

export class DecryptHelper {
  async adminLoginDecrypt(body: any) {
    try {
      if (body.email) {
        const email = CryptoJS.AES.decrypt(
          body.email,
          process.env.CRYPTO_SECRET_KEY
        );
        body.email = JSON.parse(email.toString(CryptoJS.enc.Utf8));
      }
      if (body.password) {
        const password = CryptoJS.AES.decrypt(
          body.password,
          process.env.CRYPTO_SECRET_KEY
        );
        body.password = JSON.parse(password.toString(CryptoJS.enc.Utf8));
      }
      console.log("body::::", body);
      return body;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }
  async signupDecrypter(body: any) {
    try {
      if (body.firstName) {
        body.firstName = await this.decryptHelper(body.firstName);
      }
      if (body.lastName) {
        body.lastName = await this.decryptHelper(body.lastName);
      }
      if (body.email) {
        body.email = await this.decryptHelper(body.email);
      }
      if (body.password) {
        body.password = await this.decryptHelper(body.password);
      }
      if (body.userId) {
        body.userId = await this.decryptHelper(body.userId);
      }
      return body;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }

  async loginDecrypter(body: any) {
    try {
      if (body.email) {
        body.email = await this.decryptHelper(body.email);
      }
      if (body.password) {
        body.password = await this.decryptHelper(body.password);
      }
      return body;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }

  async forgotPasswordDecrypter(body: any) {
    try {
      if (body.password) {
        body.password = await this.decryptHelper(body.password);
      }
      if (body.confirm_password) {
        body.confirm_password = await this.decryptHelper(body.confirm_password);
      }
      return body;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }

  async forgotPasswordLinkDecrypter(body: any) {
    try {
      if (body.email) {
        body.email = await this.decryptHelper(body.email);
      }
      return body;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }
  async emailVerificationDecrypter(body: any) {
    try {
      if (body.email) {
        body.email = await this.decryptHelper(body.email);
      }
      return body;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }

  async otpVerificationDecrypter(body: any) {
    try {
      if (body.email) {
        body.email = await this.decryptHelper(body.email);
      }

      if (body.otp) {
        body.otp = await this.decryptHelper(body.otp);
      }
      return body;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }

  async socialLoginDecrypter(body: any) {
    try {
      if (body.type) {
        body.type = await this.decryptHelper(body.type);
      }
      if (body.id) {
        body.id = await this.decryptHelper(body.id);
      }
      if (body.email) {
        body.email = await this.decryptHelper(body.email);
      }
      if (body.userId) {
        body.userId = await this.decryptHelper(body.userId);
      }
      return body;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }

  async userIdDecrypter(userId: any) {
    try {
      if (userId) {
        userId = await this.encryptHelper(userId);
      }
      return userId;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }

  async decryptHelper(data: any) {
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(
        data,
        CryptoJS.enc.Utf8.parse(process.env.CRYPTO_SECRET_KEY),
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
      const decryptedData = decryptedBytes.toString(CryptoJS.enc.Utf8);
      console.log("decreptedDataaaa", decryptedData);
      return decryptedData;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }

  async encryptHelper(data: any) {
    try {
      const encryptedBytes = CryptoJS.AES.encrypt(
        data,
        CryptoJS.enc.Utf8.parse(process.env.CRYPTO_SECRET_KEY),
        {
          mode: CryptoJS.mode.ECB,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
      const encryptedData = encryptedBytes.toString();
      console.log("encryptedData", encryptedData);
      return encryptedData;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException(error);
    }
  }
}
