import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UpdateUserDTO {
  @IsNotEmpty()
  id: number;

  userId: number;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  password?: string;
}
