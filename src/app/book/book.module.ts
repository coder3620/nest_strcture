import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import * as Dotenv from "dotenv";
import { ResponseService } from "src/common/response.service";
import { MulterConfig } from "src/config/multer.config";
import { MulterModule } from "@nestjs/platform-express";
import { EmailService } from "src/common/email.service";
import { NonAuthHeader } from "src/guard/nonAuth.guard";
import { UserAccount } from "src/entities/userAccount.entity";
import { UserDeviceRelation } from "src/entities/userDeviceRelation.entity";
import { DecryptHelper } from "src/common/decryptHelper";
import { AdminNonAuthHeader } from "src/guard/adminNonAuth.guard";
import { S3Service } from "src/common/S3Helper";
import { BookService } from "./book.service";
import { BookController } from "./book.controller";
import { Book } from "src/entities/book.entity";
Dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([UserAccount, UserDeviceRelation, Book]),
    MulterModule.register(MulterConfig),
  ],
  controllers: [BookController],
  providers: [
    BookService,
    JwtService,
    ResponseService,
    EmailService,
    NonAuthHeader,
    DecryptHelper,
    AdminNonAuthHeader,
    S3Service,
  ],
  exports: [TypeOrmModule],
})
export class BookModule {}
