import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class ForgotPasswordLinkDto {
  @ApiProperty({ type: "string", format: "text", required: true })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  email: string;
}
