import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { User } from '../users/models/user.model'
import { UsersService } from '../users/users.service'
import { LoginDto } from './dto/login.dto'

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async registration(dto: CreateUserDto) {
    const candidate = await this.usersService.getUserByUsername(dto.username)
    if (candidate) {
      throw new HttpException('User exist!', HttpStatus.BAD_REQUEST)
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const user = await this.usersService.createUser({
      ...dto,
      password: hashedPassword
    })
    return this.generateToken(user)
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto)
    return this.generateToken(user)
  }

  private async generateToken(user: User) {
    const payload = { id: user.id, username: user.username, roles: user.role }
    return {
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
