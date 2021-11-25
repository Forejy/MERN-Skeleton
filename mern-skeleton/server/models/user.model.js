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


// Au moment de créer ou de mettre à jour, password est encrypté
// Mais je sais pas encore à quel moment ni comment c'est décrypté, ni à quoi sert password finalement
// Et il appelle un virtual pour en fait changer la valeur des champs salts et hashed_password
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

  //Verification du password au moment de créer, ou d'update, l'utilisateur. Juste avant que mongoose ne save l'user.
  // Le message d'erreur sera retourné en cas d'erreur
    // Les erreurs de Mongoose sont gérées par le helper dbErrorHandler.js
UserSchema.path('hashed_password').validate(function(v) {
  if (this._password && this._password.length < 6) {
    this.invalidate('password', 'Password must be at least 6 characters.')
  }
  if (this.isNew && !this._password) {
    this.invalidate('password', 'Password is required')
  }
}, null)

//authenticate : compare le hashed_password stocké dans la base de données avec celui que l'utilisateur a fourni via le formulaire
//encryptPassword : encrypte le password qui vient d'etre donné ds le formulaire pour qu'il soit au meme format que le password en base de données en vu de les comparer

UserSchema.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password
  },
  encryptPassword: function(password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt) // créer une instance d'un objet qui peut etre utilisé pour  traiter avec l'algorithme indiqué pour encoder (pour hash-er). 'sha1' c'est le nom de l'algo, et du coup le salt doit etre ajouté
        .update(password) // met à jour le contenu de l'objet Hmac en ajoutant password
        .digest('hex') //'calcule le digest', en fait la sortie hashée, sous forme de string si y'a un encodage (ici 'hex') sinon sous forme de buffer ('<buffer 4e 27 6d ... >)
    } catch (err) {
      return ''
    }
  },
  makeSalt: function() {
    return Math.round((new Date().valueOf() * Math.random())) + ''
  }
}

export default mongoose.model('User', UserSchema)
