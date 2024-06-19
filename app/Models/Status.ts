import { DateTime } from 'luxon'
import { BaseModel, column,HasMany,hasMany, belongsTo, BelongsTo} from '@ioc:Adonis/Lucid/Orm'
import Task from './Task'
import User from './User'
export default class Status extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @hasMany(() => Task)
  public tasks: HasMany<typeof Task>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public user_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
