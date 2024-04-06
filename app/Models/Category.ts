import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm'
import Task from './Task'
export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public user_id: number

  @hasMany(()=> Task)
  public tasks: HasMany<typeof Task>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
