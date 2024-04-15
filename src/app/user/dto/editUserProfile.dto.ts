import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class EditUserProfileDto {
  @ApiProperty({ type: "string", format: "text", required: false })
  @IsOptional()
  firstName: string;

  @ApiProperty({ type: "string", format: "text", required: false })
  @IsOptional()
  lastName: string;

  @ApiProperty({ type: "string", format: "binary", required: false })
  @IsOptional()
  user_image: Express.Multer.File;
}
