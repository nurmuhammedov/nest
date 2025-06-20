import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { JwtPayload } from '../interfaces/jwt-payload.interface'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    const request: Request = context.switchToHttp().getRequest()

    const authHeader = request.headers.authorization
    if (!authHeader) {
      throw new UnauthorizedException('User unauthorized!')
    }

    const [bearer, token] = authHeader.split(' ')
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('User unauthorized!')
    }
    try {
      request.user = this.jwtService.verify<JwtPayload>(token) as unknown as JwtPayload
      return true
    } catch {
      throw new UnauthorizedException('User unauthorized!')
    }
  }
}
