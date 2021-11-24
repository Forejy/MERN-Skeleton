import mongoose from 'mongoose'
import crypto from 'crypto'
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, //space at the beginning and at the end, but not between words
    required: 'Name is required'
  },
  email: {
    type: String,
    trim: true,
    unique: 'Email already exists',
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
    required: 'Email is required'
  },
  hashed_password: {
    type: String,
    required: "Password is required"
  },
  salt: String,
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  }
})


//Au moment où il y a un get, un find, de l'user, le champs password rendu va passer par le virtual ?// "When the password value is received on user creation or update, it is encrypted into a new hashed value and set to the hashed_password field, along with the unique salt value in the salt field."
UserSchema
  .virtual('password')
  .set(function(password) {
    this._password = password
    this.salt = this.makeSalt()
    // Salting is simply the addition of a unique, random string of characters known only to the site to each password before it is hashed, typically this “salt” is placed in front of each password.
    this.hashed_password = this.encryptPassword(password)
  })
  .get(function() {
    return this._password
  })

UserSchema.path('hashed_password').validate(function(v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null)

UserSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function(password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  }
}

export default mongoose.model('User', UserSchema)
