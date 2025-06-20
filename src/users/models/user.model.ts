import { Column, DataType, DefaultScope, Model, Table } from 'sequelize-typescript'
import { Roles } from '../../authentication/roles.enum'

interface UserCreationAttributes {
  fullName: string
  username: string
  password: string
  role: Roles
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
    defaultValue: Roles.USER
  })
  declare role: Roles
}
