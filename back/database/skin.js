const db = require('./index')

const addSkin = async skin => {
  try{
    const query = {
      text : 'INSERT INTO champion_skins VALUES ($1,$2,$3,$4,$5,$6,$7)',
      values : [
        champion.key,
        champion.name,
        '12.7.1',
        champion.title,
        champion.lore,
        champion.blurb,
        champion.image.full,
      ]
    }
    const res = await db.query(query)
    return res.rows
  }catch(e){
    console.log(e)
  }

}

module.exports = {
  addSkin
}