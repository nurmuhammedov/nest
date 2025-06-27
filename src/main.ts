import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { AppModule } from './app.module'

async function start() {
  const PORT = process.env.PORT ?? 8000
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({
    origin: ['http://127.7.7.7', 'http://192.168.1.82'],
    methods: 'GET,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true
  })

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/'
  })

  app.setGlobalPrefix('api/v1')
  await app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
}

start()
  .then(() => {
    console.log('Server is running')
  })
  .catch((error) => {
    console.error('Failed to start server:', error)
  })
