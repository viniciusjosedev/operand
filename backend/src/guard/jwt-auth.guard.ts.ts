import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = this.extractTokenFromHeader(authorizationHeader);

    try {
      const decoded = this.jwtService.verify(token);
      console.log('Token decodificado:', decoded);
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }

  extractTokenFromHeader(header: string): string {
    if (header.startsWith('Bearer ')) {
      return header.split(' ')[1];
    }
    throw new UnauthorizedException('Invalid Authorization header format');
  }
}
