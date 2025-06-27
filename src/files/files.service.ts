import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import * as fs from 'fs/promises'
import * as path from 'path'
import { File } from './models/file.model'

export interface FormattedFileResponse {
  id: number
  name: string
  path: string
  size: number
}

@Injectable()
export class FilesService {
  constructor(@InjectModel(File) private readonly fileRepository: typeof File) {}

  async createFile(file: Express.Multer.File, name: string, userId: number): Promise<FormattedFileResponse> {
    const fileToCreate = {
      name,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size,
      userId
    }

    const createdFile = await this.fileRepository.create(fileToCreate)

    return this.formatFileResponse(createdFile, createdFile.id)
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const file = await this.fileRepository.findByPk(id)
    if (!file) {
      throw new NotFoundException(`File with ID #${id} not found`)
    }
    if (file.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this file')
    }

    try {
      const filePath = path.join(process.cwd(), file.path)
      await fs.unlink(filePath)
    } catch (error) {
      console.error(`Failed to delete file from disk: ${file.path}`, error)
    }

    await file.destroy()

    return { message: `File with ID #${id} has been deleted.` }
  }

  private formatFileResponse(file: File, id: number): FormattedFileResponse {
    if (!file) {
      throw new NotFoundException(`File with ID #${id} not found!`)
    }

    const domain = process.env.DOMAIN || ''
    return {
      id: file.id,
      name: file.name,
      path: `${domain}/${file.path.replace(/\\/g, '/')}`,
      size: file.size
    }
  }
}
