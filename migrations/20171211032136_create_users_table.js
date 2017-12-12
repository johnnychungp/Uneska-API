exports.up = knex =>
  knex.schema.createTable('users', table => {
    table.increments('id').primary()
    table.string('email').unique()
    table.string('password')
    table.string('password_reset_token')
    table.timestamp('reset_token_expiry')
    table.string('first_name')
    table.string('last_name')
    table.string('profile_picture')
    table.string('company_id').notNullable()
    table.bool('is_admin').defaultTo(false)
    table.timestamp('last_seen').defaultTo(knex.fn.now())
    table.timestamps(true, true)
  })

exports.down = knex => knex.schema.dropTableIfExists('users')
