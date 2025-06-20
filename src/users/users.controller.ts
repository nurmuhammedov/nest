import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { Roles } from '../authentication/decorators/roles.decorator'
import { Roles as RoleEnum } from '../authentication/roles.enum'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'

@Controller('users')
@Roles(RoleEnum.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  registration(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto)
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.usersService.getUser(id)
  }

  @Get()
  getAll() {
    return this.usersService.getAllUsers()
  }
}
