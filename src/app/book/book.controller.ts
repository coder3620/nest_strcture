import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ResponseService } from "src/common/response.service";
import { ApiBody, ApiConsumes, ApiTags } from "@nestjs/swagger";
import { ApiAuthHeaders } from "src/common/swagger.decorator";
import { Request, Response } from "express";
import { AuthGuard } from "src/guard/auth.guard";
// import { FileInterceptor } from "@nestjs/platform-express";
import { BookService } from "./book.service";
import * as Jwt from "jsonwebtoken";
import { AddBookDto } from "./dto/addBook.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { UpdateBookDto } from "./dto/updateBook.dto";

@Controller("/books")
@ApiTags("books")
export class BookController {
  constructor(
    private readonly bookService: BookService,
    private readonly responseService: ResponseService
  ) {}

  @Post("/addBook")
  @ApiAuthHeaders()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: AddBookDto })
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "book_image", maxCount: 20 }])
  )
  async addBook(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: AddBookDto,
    @UploadedFiles() files: { book_image: Express.Multer.File[] }
  ) {
    try {
      const userId: any = await this.getUserId(req);
      const bookImages = files.book_image.map((file) => file.filename);
      const data = await this.bookService.addBook(userId, body, bookImages);
      return this.responseService.success(res, "SUCCESS", data);
    } catch (error) {
      console.log(error);
      return this.responseService.error(req, res, error.message);
    }
  }

  @Put("/updateBookById")
  @ApiAuthHeaders()
  @ApiConsumes("multipart/form-data")
  @ApiBody({ type: UpdateBookDto })
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: "book_image", maxCount: 20 }])
  )
  async updateBook(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: UpdateBookDto,
    @UploadedFiles() files: { book_image: Express.Multer.File[] }
  ) {
    try {
      const bookImages = files.book_image.map((file) => file.filename);
      const data = await this.bookService.updateBook(body, bookImages);
      return this.responseService.success(res, "SUCCESS", data);
    } catch (error) {
      console.log(error);
      return this.responseService.error(req, res, error.message);
    }
  }

  @Get("/getOwnBooks")
  @ApiAuthHeaders()
  @UseGuards(AuthGuard)
  async getOtherUserProfile(@Req() req: Request, @Res() res: Response) {
    try {
      const userId: any = await this.getUserId(req);
      const data = await this.bookService.getOwnBooks(userId);
      return this.responseService.success(res, "SUCCESS", data);
    } catch (error) {
      console.log("error ---", error);
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
}
