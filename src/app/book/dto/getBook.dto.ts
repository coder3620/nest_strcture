import { ApiProperty } from "@nestjs/swagger";

export class GetBookDto {
  @ApiProperty({ type: "number", format: "binary", required: false })
  userId: number;
}
