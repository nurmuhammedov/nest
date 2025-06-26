import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { Roles } from '../authentication/decorators/roles.decorator'
import { RoleEnum } from '../authentication/roles.enum'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
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
  getAll(@Query('role') role?: RoleEnum) {
    return this.usersService.getAllUsers(role)
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto)
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.usersService.deleteUser(id)
  }
}
