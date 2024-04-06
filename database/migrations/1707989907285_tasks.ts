import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('title').notNullable()
      table.string('description').notNullable()
      table.enum('priority', ['High', 'Medium', 'Low']).notNullable().defaultTo('Medium')
      table.integer('category_id').references('id').inTable('categories')
      table.integer('user_id').references('id').inTable('users')
      table.integer('status_id').unsigned().references('id').inTable('statuses')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
