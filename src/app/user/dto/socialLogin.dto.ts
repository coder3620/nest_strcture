import { IsDefined, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class SocialLoginUserDto {
  @IsString()
  @IsDefined()
  @IsNotEmpty()
  type: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsDefined()
  id: string;

  @IsNotEmpty()
  @IsOptional()
  userId: string;
}
