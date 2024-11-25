import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ROLES_KEY } from './roles.decorator';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly jwtSecret: string;
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.jwtSecret,
      });
      request['user'] = payload;

      if (!requiredRoles) {
        return true;
      }
      if (!requiredRoles.some((role) => payload.roles?.includes(role))) {
        throw new UnauthorizedException('Usuário não tem permissão para acessar esta rota');
      }
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Token inválido');
      }
      throw new UnauthorizedException(error.message);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    if (!request.headers.authorization) {
      return undefined;
    }
    const [type, token] = request.headers.authorization.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
