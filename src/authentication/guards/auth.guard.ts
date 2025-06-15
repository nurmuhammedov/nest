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
        throw new UnauthorizedException(
          "Foydalanuvchi avtorizatsiyadan o'tmagan"
        )
      }

      const [bearer, token] = authHeader.split(' ')
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException(
          "Foydalanuvchi avtorizatsiyadan o'tmagan"
        )
      }

      const user = this.jwtService.verify(token)
      request.user = user // Foydalanuvchi ma'lumotlarini requestga qo'shib qo'yamiz
      return true
    } catch (e) {
      throw new UnauthorizedException("Foydalanuvchi avtorizatsiyadan o'tmagan")
    }
  }
}
