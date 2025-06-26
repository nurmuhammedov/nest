import { RoleEnum } from '../../authentication/roles.enum'

export class CreateUserDto {
  fullName: string
  username: string
  password: string
  role: RoleEnum
}
