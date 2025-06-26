import { Column, DataType, DefaultScope, Model, Table } from 'sequelize-typescript'
import { RoleEnum } from '../../authentication/roles.enum'

interface UserCreationAttributes {
  fullName: string
  username: string
  password: string
  role: RoleEnum
}

@DefaultScope(() => ({
  attributes: {
    exclude: ['createdAt', 'updatedAt', 'password']
  }
}))
@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User, UserCreationAttributes> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  declare id: number

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare fullName: string

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  declare username: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  declare password: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: RoleEnum.USER
  })
  declare role: RoleEnum
}
