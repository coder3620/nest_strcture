import { ApiProperty } from "@nestjs/swagger";
import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from "class-validator";

export class SendEmailVerificationDto {
  @ApiProperty({ type: "string", format: "text", required: true })
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(4)
  otp: number;
}
