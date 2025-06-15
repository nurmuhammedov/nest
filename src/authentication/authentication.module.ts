import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from 'src/users/users.module'
import { AuthenticationController } from './authentication.controller'
import { AuthenticationService } from './authentication.service'

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '3600s' }
    })
  ]
})
export class AuthenticationModule {}
