import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import { User } from '../../users/models/users.model'

interface FilesCreationAttributes {
  name: string
  path: string
  mimetype: string
  size: number
  userId: number
}

@Table({ tableName: 'files', timestamps: true })
export class File extends Model<File, FilesCreationAttributes> {
  @Column({ type: DataType.INTEGER, autoIncrement: true, primaryKey: true })
  declare id: number

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string

  @Column({ type: DataType.STRING, allowNull: false })
  declare path: string

  @Column({ type: DataType.STRING, allowNull: false })
  declare mimetype: string

  @Column({ type: DataType.INTEGER, allowNull: false })
  declare size: number

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: false })
  declare userId: number

  @BelongsTo(() => User)
  declare user: User
}
