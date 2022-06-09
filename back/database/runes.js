const db = require('./index')

const addRune = async rune => {
  try{
    const query = {
      text : `INSERT INTO runes VALUES ($1,$2,$3,$4,$5)
              ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              image = EXCLUDED.image,
              short_desc = EXCLUDED.short_desc,
              long_desc = EXCLUDED.long_desc`,
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
    console.log('Error adding rune: ',e)
  }
}

module.exports = {
  addRune,
}