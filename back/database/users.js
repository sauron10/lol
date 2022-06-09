const db = require('./index')

const addUser = async (user) => {
  try {
    const res =await db.query(`
      INSERT INTO users
      (id,name,email,password,last_login,created_on)
      VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING
      RETURNING *
    `,[
      user.userId,
      user.username,
      user.sanEmail,
      user.hashedPassword,
      Date.now(),
      Date.now()
    ])
    return ({status:'ok'})
  } catch (e) {
    console.log('Error adding a new user to DB:', e)
    return ({status:'error'})
  }
}

const searchUser = async (user) => {
  try{
    const res = await db.query(`
      SELECT * FROM users u
      WHERE name = $1
    `,[
      // user.type,
      user.payload,
    ])
    return res.rows
  }catch(e){
    console.log('Error finding user: ',e)
  }
}

module.exports={
  addUser,
  searchUser
}