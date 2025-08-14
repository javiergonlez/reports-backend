//--------------------------------------------------------------------------------------------------------------------

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'node:crypto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import type { SafeUser } from './entities/user.entity';

//--------------------------------------------------------------------------------------------------------------------

@Injectable()
class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: SafeUser; token: string; expiresAt: number }> {
    const { email, password }: LoginDto = loginDto;
    const emailNormalized: string = email.trim().toLowerCase();

    const user: User | null = await this.userRepository.findOne({
      where: { email: emailNormalized },
    });

    if (!user || typeof user.password !== 'string') {
      throw new UnauthorizedException('Credenciales inv\u{00E1}lidas');
    }

    const isValid: boolean = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new UnauthorizedException('Contrase\u{00F1}a incorrecta.');
    }

    // Eliminar tokens existentes del usuario
    await this.tokenRepository.delete({ email: user.email });

    // Crear nuevo token
    const token: Token = new Token();
    token.id = Buffer.from(randomBytes(32)).toString('hex');
    token.email = user.email;
    token.expiresAt = Date.now() + 60 * 60 * 1000; // 60 minutos

    await this.tokenRepository.save(token);

    return {
      user: user.clearPassword(),
      token: token.id,
      expiresAt: token.expiresAt,
    };
  }

  async logout(token: string): Promise<{ message: string }> {
    await this.tokenRepository.delete({ id: token });
    return { message: 'Logout exitoso' };
  }
}

export { AuthService };
