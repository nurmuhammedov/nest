import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import * as process from 'node:process'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthenticationModule } from './authentication/authentication.module'
import { User } from './users/models/user.model'
import { UsersModule } from './users/users.module'

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      models: [User]
    }),
    AuthenticationModule,
    UsersModule
  ],
  exports: []
})
export class AppModule {}
