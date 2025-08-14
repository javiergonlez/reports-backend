//--------------------------------------------------------------------------------------------------------------------

import { IsString, IsEmail, MinLength } from 'class-validator';

//--------------------------------------------------------------------------------------------------------------------

class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export { LoginDto };
