import { ApiProperty } from "@nestjs/swagger";

export class AuthResponseDto {  
   @ApiProperty({required: true})
   token: string;  
   @ApiProperty({required: true})
   expiresIn: number;
}

export class AuthDto {  
   @ApiProperty({required: true})
   login: string;  
   @ApiProperty({required: true})
   senha: string;
}