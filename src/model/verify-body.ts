import { ApiProperty } from "@nestjs/swagger";

export class VerifyBody {
    @ApiProperty()
    userId: number;
    @ApiProperty()
    token: string;
}