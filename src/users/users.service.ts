import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from './models/user.model'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    return await this.userRepository.create(dto)
  }

  async getAllUsers() {
    return this.userRepository?.findAll({
      attributes: { exclude: ['password'] }
    })
  }

  async getUserByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } })
  }
}
