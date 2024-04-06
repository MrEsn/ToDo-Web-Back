import { DateTime } from 'luxon'
import {BaseModel, column, hasMany,  HasMany, beforeSave} from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Task from './Task'
import Category from './Category'
import Status from './Status'
import Note from './Note'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_name: string | null

  @column()
  public email: string

  @column()
  public password: string | undefined

  @column()
  public profileUrl: string

  @column()
  public provider: string | null

  @column()
  public providerId: number | null 

  @hasMany(()=>Task)
  public tasks: HasMany<typeof Task>

  @hasMany(()=>Category)
  public categories: HasMany<typeof Category>

  @hasMany(()=>Status)
  public statuses: HasMany<typeof Status>

  @hasMany(()=>Note)
  public notes: HasMany<typeof Note>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password!)
    }
  }
}
