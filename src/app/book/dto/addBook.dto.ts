import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional } from "class-validator";

export class AddBookDto {
  @ApiProperty({ type: "string", format: "text", required: true })
  @IsDefined()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: "string", format: "text", required: true })
  @IsDefined()
  @IsNotEmpty()
  author: string;

  @ApiProperty({ type: "number", format: "binary", required: true })
  @IsDefined()
  @IsNotEmpty()
  publicationYear: number;

  @ApiProperty({ type: "string", format: "text", required: false })
  @IsOptional()
  publisher: string;

  @ApiProperty({ type: "number", format: "binary", required: true })
  @IsDefined()
  @IsNotEmpty()
  pageCount: number;

  @ApiProperty({ type: "string", format: "text", required: false })
  @IsOptional()
  format: string;

  @ApiProperty({ type: "string", format: "text", required: true })
  @IsDefined()
  @IsNotEmpty()
  language: string;

  @ApiProperty({ type: "string", format: "text", required: true })
  @IsOptional()
  description: string;

  @ApiProperty({ type: "string", format: "binary", required: true })
  @IsDefined()
  @IsNotEmpty()
  book_image: Express.Multer.File;
}
