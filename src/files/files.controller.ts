import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  UnsupportedMediaTypeException,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Request } from 'express'
import * as fs from 'fs'
import { diskStorage } from 'multer'
import { extname, join } from 'path'
import { CurrentUser } from '../authentication/decorators/current-user.decorator'
import { JwtPayload } from '../authentication/interfaces/jwt-payload.interface'
import { FilesService } from './files.service'

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_, __, cb) => {
          const now = new Date()
          const year = now.getFullYear().toString()
          const month = (now.getMonth() + 1).toString().padStart(2, '0')
          const day = now.getDate().toString().padStart(2, '0')
          const uploadPath = join('uploads', year, month, day)
          fs.mkdirSync(uploadPath, { recursive: true })
          cb(null, uploadPath)
        },
        filename: (_, file, callback) => {
          const timestamp = Date.now()
          const fileExtName = extname(file.originalname)
          callback(null, `${timestamp}${fileExtName}`)
        }
      }),
      limits: {
        fileSize: 10 * 1024 * 1024
      },
      fileFilter: (req: Request, file, callback) => {
        const type = (req.query.type as 'IMAGE' | 'PDF') || 'IMAGE'

        const allowedMimeTypes = {
          IMAGE: /^image\/(jpeg|png|gif|webp)$/,
          PDF: /^application\/pdf$/
        }

        if (!allowedMimeTypes[type] || !allowedMimeTypes[type].test(file.mimetype)) {
          return callback(new UnsupportedMediaTypeException(`Invalid file type. Only ${type} is allowed!`), false)
        }
        callback(null, true)
      }
    })
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 10 * 1024 * 1024,
            message: `The file size must not exceed 10 MB!`
          })
        ]
      })
    )
    file: Express.Multer.File,
    @Body('name') name: string,
    @Query('type') type: 'IMAGE' | 'PDF' = 'IMAGE',
    @CurrentUser() user: JwtPayload
  ) {
    if (!name) {
      throw new BadRequestException('File name is required')
    }

    const allowedMimeTypes = {
      IMAGE: /^image\/(jpeg|png|gif|webp)$/,
      PDF: /^application\/pdf$/
    }

    if (!allowedMimeTypes[type] || !allowedMimeTypes[type].test(file.mimetype)) {
      throw new UnsupportedMediaTypeException(`Invalid file type. Only ${type} is allowed!`)
    }

    return this.filesService.createFile(file, name, user.id)
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: JwtPayload) {
    return this.filesService.remove(id, user.id)
  }
}
