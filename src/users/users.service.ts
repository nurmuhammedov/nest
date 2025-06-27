import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import * as bcrypt from 'bcrypt'
import { RoleEnum } from '../authentication/roles.enum'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User } from './models/users.model'

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

  async getAllUsers(role: RoleEnum = RoleEnum.USER) {
    console.log(role, 'ROLE')
    return this.userRepository?.findAll({
      attributes: { exclude: ['password'] },
      where: {
        role: role
      }
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

  async updateUser(id: number, dto: UpdateUserDto) {
    await this.getUser(id)
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10)
    }
    await this.userRepository.update(dto, { where: { id } })

    return this.getUser(id)
  }

  async getUserByUsername(username: string) {
    return this.userRepository.findOne({ where: { username }, attributes: { include: ['password'] } })
  }

  async deleteUser(id: number) {
    const user = await this.getUser(id)

    if (user.role === RoleEnum.ADMIN) {
      throw new ForbiddenException('Admins cannot be deleted!')
    }

    await this.userRepository.destroy({ where: { id } })
    return { message: `User with ID #${id} has been deleted.` }
  }
}
