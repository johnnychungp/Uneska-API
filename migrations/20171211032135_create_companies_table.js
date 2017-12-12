
exports.up = knex =>
  knex.schema.createTable('companies', table => {
    table.increments('id').primary()
    table.string('name')
    table.string('description')
    table.string('link')
    table.string('logo')
    table.string('industry')
    table.integer('size')
    table.timestamp('founded')
    table.string('address')
    table.string('phone_number')
    table.string('fax_number')
    table.string('country')
    table.integer('consecutive_days')
    table.timestamp('last_seen').defaultTo(knex.fn.now())
    table.timestamps(true, true)
  })

exports.down = knex => knex.schema.dropTableIfExists('companies')
