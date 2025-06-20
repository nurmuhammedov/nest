import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './models/user.model'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    const candidate = await this.getUserByUsername(dto.username)
    if (candidate) {
      throw new HttpException('User exist!', HttpStatus.BAD_REQUEST)
    }
    const hashedPassword = await bcrypt.hash(dto.password, 10)
    const user = await this.userRepository.create({
      ...dto,
      password: hashedPassword
    })

    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role
    }
  }

  async getAllUsers() {
    return this.userRepository?.findAll({
      attributes: { exclude: ['password'] }
    })
  }

  async getUser(id: number) {
    const user = await this.userRepository?.findOne({
      where: { id }
    })

    if (!user) {
      throw new NotFoundException(`User with ID #${id} not found!`)
    }

    return user
  }

  async getUserByUsername(username: string) {
    return this.userRepository.findOne({ where: { username }, attributes: { include: ['password'] } })
  }
}
