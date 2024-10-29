import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {  
   token: string;  
   expiresIn: number;
}

export class AuthDto {  
   @ApiProperty({required: true})
   login: string;  
   @ApiProperty({required: true})
   senha: string;
}