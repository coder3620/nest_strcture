import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString, MinLength } from "class-validator";

export class ResetPasswordDto {
  @ApiProperty({ type: "string", format: "text", required: true })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ type: "string", format: "text", required: true })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  old_password: string;
}
