import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsOptional } from "class-validator";

export class sendNotificationUserDto {
  @ApiProperty({ type: "string", format: "text", required: true })
  @IsDefined()
  receiver_id: string;

  @ApiProperty({ type: "string", format: "text", required: true })
  @IsOptional()
  id: string;

  @ApiProperty({ type: "string", format: "text", required: true })
  @IsDefined()
  fk_matches_id: string;

  @ApiProperty({ type: "string", format: "text", required: true })
  @IsDefined()
  notification_description: string;

  @ApiProperty({ type: "number", format: "text", required: true })
  @IsDefined()
  chat_type: number;
}
