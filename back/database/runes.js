const db = require('./index')

const addRune = async rune => {
  try{
    const query = {
      text : 'INSERT INTO runes VALUES ($1,$2,$3,$4,$5)',
      values : [
        rune.id,
        rune.name,
        rune.icon,
        rune.shortDesc,
        rune.longDesc,           
      ]
    }
    return res = await db.query(query)
  }catch(e){
    console.log(e)
  }
}

module.exports = {
  addRune,
}