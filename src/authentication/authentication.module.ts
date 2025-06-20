import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from 'src/users/users.module'
import { AuthenticationController } from './authentication.controller'
import { AuthenticationService } from './authentication.service'
import { AuthGuard } from './guards/auth.guard'

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AuthGuard],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '36000s' }
    })
  ],
  exports: [AuthenticationService, AuthGuard, JwtModule]
})
export class AuthenticationModule {}
