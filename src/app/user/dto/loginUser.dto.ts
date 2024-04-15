import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
  @ApiProperty({ type: "string", format: "text", required: true })
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: "string", format: "text", required: true })
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  password: string;
}
