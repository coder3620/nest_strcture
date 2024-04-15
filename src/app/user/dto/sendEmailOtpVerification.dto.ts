import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty } from "class-validator";

export class SendEmailOtpVerificationDto {
  @ApiProperty({ type: "string", format: "text", required: true })
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: "string", format: "text", required: true })
  @IsDefined()
  @IsNotEmpty()
  otp: string;
}
