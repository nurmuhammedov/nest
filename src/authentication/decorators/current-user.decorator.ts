import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { JwtPayload } from '../interfaces/jwt-payload.interface'

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext): JwtPayload | undefined => {
  const request: Request = ctx.switchToHttp().getRequest()
  return request.user
})
