import { Body, Controller, Get, Post } from '@nestjs/common'
import { UsersService } from '../users/users.service'
import { AuthenticationService } from './authentication.service'
import { CurrentUser } from './decorators/current-user.decorator'
import { Public } from './decorators/public.decorator'
import { LoginDto } from './dto/login.dto'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Controller('authentication')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService
  ) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authenticationService.login(dto)
  }

  @Get('me')
  getProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.getUser(user.id)
  }
}
