import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { Roles } from '../../authentication/roles.enum'

interface UserCreationAttributes {
  fullName: string
  username: string
  password: string
  roles?: Roles[]
}

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
  fullName: string

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  username: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password: string

  @Column({
    type: DataType.ENUM(...Object.values(Roles)),
    defaultValue: Roles.USER,
    allowNull: false
  })
  role: Roles

  // @BeforeCreate
  // static async hashPassword(instance: User) {
  //   const salt = await bcrypt.genSalt(10)
  //   instance.password = await bcrypt.hash(instance.password, salt)
  // }
}
