import { Module } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './models/user.model'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, JwtService],
  exports: [UsersService]
})
export class UsersModule {}
