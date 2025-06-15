import { Body, Controller, Post } from '@nestjs/common'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { AuthenticationService } from './authentication.service'
import { LoginDto } from './dto/login.dto'

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authenticationService.login(dto)
  }

  @Post('registration')
  registration(@Body() dto: CreateUserDto) {
    return this.authenticationService.registration(dto)
  }
}
