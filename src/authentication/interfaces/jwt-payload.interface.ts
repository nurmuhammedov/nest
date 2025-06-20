import { Roles } from '../roles.enum'

export interface JwtPayload {
  id: number
  username: string
  role: Roles
}
