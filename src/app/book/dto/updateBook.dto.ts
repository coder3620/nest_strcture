import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdateBookDto {
  @ApiProperty({ type: "number", format: "binary", required: false })
  @IsOptional()
  bookId: number;

  @ApiProperty({ type: "string", format: "text", required: false })
  @IsOptional()
  title: string;

  @ApiProperty({ type: "string", format: "text", required: false })
  @IsOptional()
  author: string;

  @ApiProperty({ type: "number", format: "binary", required: false })
  @IsOptional()
  publicationYear: number;

  @ApiProperty({ type: "string", format: "text", required: false })
  @IsOptional()
  publisher: string;

  @ApiProperty({ type: "number", format: "binary", required: false })
  @IsOptional()
  pageCount: number;

  @ApiProperty({ type: "string", format: "text", required: false })
  @IsOptional()
  format: string;

  @ApiProperty({ type: "string", format: "text", required: false })
  @IsOptional()
  language: string;

  @ApiProperty({ type: "string", format: "text", required: false })
  @IsOptional()
  description: string;

  @ApiProperty({ type: "string", format: "binary", required: false })
  @IsOptional()
  book_image: Express.Multer.File;
}
