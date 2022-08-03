import { ApiProperty } from "@nestjs/swagger";

export class SignUpBody {
    @ApiProperty()
    email: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    confirmPassword: string;
}