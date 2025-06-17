import { Roles } from '../../authentication/roles.enum'

export class CreateUserDto {
  readonly fullName: string
  readonly username: string
  readonly password: string
  readonly role: Roles
}
