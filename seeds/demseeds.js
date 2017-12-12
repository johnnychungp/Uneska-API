const hash = '$2a$10$/MqlvDIKqMjEuOf5FkZJtOnSyv8NFcrmDcmVSgnMyzdC3/oSiKgwi' // password is 'password'
const moment = require('moment')
const faker = require('faker')

async function seedCompany(knex) {
  const [{ id }] = await knex('companies')
    .insert({
      name: 'Samtaro Inc.'
    })
    .returning('*')
  return { id }
}

async function seedUser(knex, companyId) {
  const [{ id: userId }] = await knex('users')
    .insert({
      password: hash,
      company_id: companyId,
      email: 'samtarowong@gmail.com',
      first_name: 'Sam',
      last_name: 'samtarowong@gmail.com',
    })
    .returning('*')
  return { userId }
}

exports.seed = async knex => {
  const { id } = await seedCompany(knex)
  await seedUser(knex, id)
}
