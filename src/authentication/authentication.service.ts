import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto)
    const payload = { id: user.id, username: user.username, role: user.role }

    const userResponse = {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role
    }

    return {
      ...userResponse,
      token: this.jwtService.sign(payload)
    }
  }

  private async validateUser(dto: LoginDto) {
    const user = await this.usersService.getUserByUsername(dto.username)
    if (!user) {
      throw new UnauthorizedException({
        message: 'Username or password incorrect!'
      })
    }
    const passwordEquals = await bcrypt.compare(dto.password, user.password)
    if (passwordEquals) {
      return user
    }
    throw new UnauthorizedException({
      message: 'Username or password incorrect!'
    })
  }
}
