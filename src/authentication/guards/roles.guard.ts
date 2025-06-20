import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { ROLES_KEY } from '../decorators/roles.decorator'
import { JwtPayload } from '../interfaces/jwt-payload.interface'
import { Roles as RoleEnum } from '../roles.enum'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (isPublic) {
      return true
    }

    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    if (!requiredRoles) {
      return true
    }

    const { user } = context.switchToHttp().getRequest<{ user: JwtPayload }>()

    if (!user || !user.role) {
      return false
    }

    return requiredRoles.some((role) => user.role === role)
  }
}
