import {
  IsDefined,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";

export class ForgotPasswordDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(8)
  confirm_password: string;
}
