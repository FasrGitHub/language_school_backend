import { ApiProperty } from "@nestjs/swagger";

export class SignInBody {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
};
