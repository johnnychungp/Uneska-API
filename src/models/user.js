import Model from './abstract/base'
import Promise from 'bluebird'
import jwt from 'jsonwebtoken'
import config from 'config'

const bcrypt = Promise.promisifyAll(require('bcryptjs'))

export default class User extends Model {
  static tableName = 'users';

  get secureFields() {
    return ['password', 'passwordResetToken', 'resetTokenExpiry']
  }

  static jsonSchema = {
    type: 'object',

    properties: {
      id: { type: 'integer' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
      role: { type: 'string' },
      passwordResetToken: { type: ['string', 'null'] },
      resetTokenExpiry: { type: ['string', 'null'], format: 'date-time' },
      facebookToken: { type: 'string' },
      facebookId: { type: 'string' },
      instagramToken: { type: 'string' },
      instagramId: { type: 'string' },
      googleToken: { type: 'string' },
      googleId: { type: 'string' },
      isVerified: { type: 'boolean' },
      onboarded: { type: 'boolean' },
      vatNumber: { type: 'string' },
      companyName: { type: 'string' },
      companyAddress: { type: 'string' },
      companyAddress2: { type: 'string' },
      companyCountry: { type: 'string' },
      companyCity: { type: 'string' },
      companyState: { type: 'string' },
      companyZipCode: { type: 'string' },
      billingName: { type: 'string' },
      billingAddress: { type: 'string' },
      billingAddress2: { type: 'string' },
      billingCountry: { type: 'string' },
      billingCity: { type: 'string' },
      billingState: { type: 'string' },
      billingZipCode: { type: 'string' },
      contactName: { type: 'string' },
      contactEmail: { type: 'string' },
      contactNumber: { type: 'string' },
      lastSeen: { type: 'string', format: 'date-time' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' }
    }
  };

  static relationMappings = {
  };

  $beforeInsert() {
    super.$beforeInsert()

    if (this.password) {
      return this.hashPassword()
    }
  }

  $beforeUpdate(opts, context) {
    super.$beforeUpdate(opts, context)
    if (this.password && opts.old.password !== this.password) {
      return this.hashPassword()
    }
  }

  generateToken() {
    const { id, role } = this
    return jwt.sign({ id, role }, config.jwtSecret)
  }

  async validatePassword(password) {
    return await bcrypt.compareAsync(password, this.password)
  }

  async hashPassword() {
    const password = this.password

    const salt = await bcrypt.genSaltAsync(10)
    this.password = await bcrypt.hashAsync(password, salt)
  }
}
