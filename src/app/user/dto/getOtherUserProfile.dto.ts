import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class GetOtherUserDto {
  @ApiProperty({ type: "string", format: "text", required: true })
  @IsUUID("4", { message: "Invalid userId" })
  userId: string;
}
