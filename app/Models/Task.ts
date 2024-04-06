import { DateTime } from 'luxon'
import { BaseModel, column,belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Category from './Category'
import Status from './Status'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public priority: 'High' | 'Medium' | 'Low'

  @column()
  public userId: number

  @column()
  public categoryId: number

  @column()
  public statusId: number

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(()=>Status)
  public status: BelongsTo<typeof Status>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
