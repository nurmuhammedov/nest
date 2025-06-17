import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthGuard } from 'src/authentication/guards/auth.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto)
  }

  @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.usersService.getAllUsers()
  }
}
