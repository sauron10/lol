const bcrypt = require('bcrypt')
const validator = require('validator')
const {v4: uuidv4} = require('uuid')
const jwt = require('jsonwebtoken')
const uDb = require('../database/users')

const createUser = async (body) => {
  try {
    const validate = (username,email) => {
      if (!validator.isAlphanumeric(username)) throw 'Username is not alphanumeric'
      if (username.length >= 64) throw 'username is too long'
      if (!validator.isEmail(email)) throw 'Email is not valid'
    }
    const key = process.env.PRIVATE_KEY
    const { username, email, password } = body
    const sanEmail = email.toLowerCase()
    validate(username, email)
    const hashedPassword = await bcrypt.hash(password, 10)
    const userId = uuidv4()
    const res = await uDb.addUser({
      userId,
      username,
      sanEmail,
      hashedPassword,
    })
    const token = jwt.sign({username},process.env.PRIVATE_KEY,{ expiresIn: '1800s' })
    return ({token,username,...res})
  } catch (e) {
    console.log("Error creating user: ", e)
    return ({ status: 'error' })
  }
}

const signIn = async (body) => {
  try{
    const validate = async (username) => {
      let user = {}
      if(validator.isEmail(username)){
        user = await uDb.searchUser({type:'email',payload:username})
        if(user.length > 0) return user
        throw 'The email is not registered'
      }
      if(validator.isAlphanumeric){
        user = await uDb.searchUser({type:'name',payload:username})
        if(user.length > 0) return user
        throw 'The username is not registered'
      }
      throw 'The username must be alphanumeric'
    }
    if(body?.token){
      const{token,username} = body
      const isToken = jwt.verify(token,process.env.PRIVATE_KEY)
      const [user] = await validate(username)
      if (isToken.username === user.name) return({
        usernmame:user.name,
        status:200
      })
      throw 'Token does not match'
      
    }
    const {username,password} = body
    const [user] = await validate(username)
    if(!await bcrypt.compare(password,user.password)) throw 'The password is incorrect'
    const token = jwt.sign({username},process.env.PRIVATE_KEY,{ expiresIn: '1800s' })
    return({
      token,
      username:user.name,
      status:200
    })   


  }catch(e){
    console.log('Error signing in: ',e)
    return ({e,status:400})
  }
}


module.exports = {
  createUser,
  signIn
}