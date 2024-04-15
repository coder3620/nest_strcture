import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class SignUpUserDto {
  @ApiProperty({ type: "string", format: "text", required: true })
  @IsDefined({ message: "firstname is required" })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ type: "string", format: "text", required: true })
  @IsDefined({ message: "lastname is required" })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ type: "string", format: "text", required: true })
  @IsDefined({ message: "email is required" })
  @IsNotEmpty({ message: "email is required" })
  email: string;

  @ApiProperty({ type: "string", format: "text", required: true })
  @IsDefined({ message: "password is required" })
  @IsNotEmpty()
  @MinLength(8, {
    message: "password length must be greater than equal to 8 character",
  })
  password: string;

  @IsNotEmpty()
  @IsOptional()
  userId: string;
}
