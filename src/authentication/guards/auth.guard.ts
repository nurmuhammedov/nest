import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    try {
      const authHeader = request.headers.authorization
      if (!authHeader) {
        throw new UnauthorizedException('User Not Authenticated!')
      }

      const [bearer, token] = authHeader.split(' ')
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException('User Not Authenticated!')
      }

      request.user = this.jwtService.verify(token)
      return true
    } catch (e) {
      throw new UnauthorizedException('User Not Authenticated!')
    }
  }
}
