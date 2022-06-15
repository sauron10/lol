const jwt = require('jsonwebtoken')
const uDb = require('../../database/users')
const bcrypt = require('bcrypt')



const authenticate = async (req, res, next) => {
  try {
    console.log('Authenticatiing')
    if (process.env.ENV === 'dev'){
      if(req.originalUrl === '/signin/' || req.originalUrl === '/signup/'){
        next()
        return 
      }
    }else{
      if(req.originalUrl === '/signup/') throw 'This is still an alpha creating accounts is disabled'
    }
    console.log(req.query)
    if (!req?.body?.username) {
      if (!req?.query.username) throw 'Credentials not provided'
    }
    const { token, username, password } = req.body.username ? req.body : req.query
    console.log({ token, username, password })
    const [user] = await uDb.searchUser({ type: 'name', payload: username })
    if (!user) throw 'user does not exist'
    if (token) {
      const uToken = jwt.verify(token, process.env.PRIVATE_KEY)
      if (uToken.username !== user.name) throw 'Token is not valid'
      next()
      return
    }
    if (password) {
      if (!await bcrypt.compare(password, user.password)) throw 'The password is incorrect'
      next()
      return
    }
    throw 'Incomplete info'

  } catch (e) {
    console.log('Error authenticating', e)
    return res.status(401).json({ error: e })
  }

}

module.exports = {
  authenticate
}