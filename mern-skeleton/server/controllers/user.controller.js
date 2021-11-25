import User from '../models/user.model'
import extend from 'lodash/extend' //Remplacer par Object.assign (natif à Node)
import errorHandler from './../helpers/dbErrorHandler'

// Méthodes des controlleurs qui vont etre executé lorsque le serveur recevra une requete au endpoints / à la route correspondante

// Créer un nouvel utilisateur avec l'objet JSON reçu de la requete POST, dans le req.body de le requete POST
const create = async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    return res.status(200).json({
      message: "Successfully signed up!"
    })
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}


/**
 * Load user and append to req.
 */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id)
    if (!user)
      return res.status('400').json({
        error: "User not found"
      })
    req.profile = user //req.locals de manière générale est utilisée pour passer des données d'un middleware au(x) prochain(s)
    next()
  } catch (err) {
    return res.status('400').json({
      error: "Could not retrieve user"
    })
  }
}

const read = (req, res) => {
  req.profile.hashed_password = undefined
  req.profile.salt = undefined
  return res.json(req.profile)
}

const list = async (req, res) => {
  try {
    let users = await User.find().select('name email updated created') //populate with, (penser que ça donne vie à la date "qu'est-ce qu'il y a dans cette data ?")
    res.json(users)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const update = async (req, res) => {
  try {
    let user = req.profile
    user = extend(user, req.body) //Remplacer par Object.assign //?Password réencodé ?//
    user.updated = Date.now()
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.json(user)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

const remove = async (req, res) => {
  try {
    let user = req.profile
    let deletedUser = await user.remove()//Ça remove direct de la db, req.profil = user ça assigne bien l'instance de User qui est dans la db, et donc on peut en utiliser les méthodes (https://stackoverflow.com/questions/31942526/node-js-express-js-removing-user-from-request-removes-it-from-database, https://mongoosejs.com/docs/api/model.html#model_Model-remove)
    deletedUser.hashed_password = undefined //L'objet utilisateur est nettoyé des données sensibles avant d'etre renvoyé en réponse au client
    deletedUser.salt = undefined
    res.json(deletedUser)
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err)
    })
  }
}

export default {
  create,
  userByID,
  read,
  list,
  remove,
  update
}
