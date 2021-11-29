import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'

const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      "email": req.body.email
    })
    if (!user)
      return res.status('401').json({
        error: "User not found"
      })

    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({
        error: "Email and password don't match."
      })
    }

    const token = jwt.sign({ //jwt c'est l'équivalent d'un filigrane qui permet de vérifier qu'un passeport  ou cart d'identité est une vraie mais ici je sais pas à quoi ça sert exactement, je sais juste que ça va etre stocké dans le client comme un cookie
      //Avec JWT, stocker le state de l'utilisateur c'est la responsabilité du client
    //Quand l'utilisateur signout, le client a besoin de supprimer le token coté client pour que l'utilisateur ne soit plus authentifié.
    //Coté serveur, on peut verifier le token généré lorsqu'un utilisateur se connecte  pour protéger les routes qui ont besoin de l'etre et d'avoir une authentifaction valide.
      _id: user._id
    }, config.jwtSecret)

    res.cookie("t", token, {
      expire: new Date() + 9999
    })

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (err) {

    return res.status('401').json({
      error: "Could not sign in"
    })

  }
}

const signout = (req, res) => {
  res.clearCookie("t")
  return res.status('200').json({
    message: "signed out"
  })
}


//expressJwt (requireSignin) sert à vérifier que le Jwt est valide
  // Si le token du jwt est valide expressJwt va append l'id de l'utilisateur (alors vérifié) dans un objet 'auth' dans l'object req(uest)
  //Sinon le module expressJwt throw une erreur
const requireSignin = expressJwt({
  secret: config.jwtSecret,
  algorithms: ['HS256'],
  userProperty: 'auth'
})

//hasAuthorization vérifier si l'utilisateur (alors authentitifé) est le meme que l'utilisateur dont on demande la mise à jour ou dont on demande la suppression
//req.auth est crée par expressJwt lors de la verification de l'authentitifaction (avant chaque )

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}


export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization
}
