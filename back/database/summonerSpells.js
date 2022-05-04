const db = require('./index')

const addSummonerSpell = async spell => {
  try{
    const query = {
      text : 'INSERT INTO summoner_spells VALUES($1,$2,$3,$4,$5)',
      values : [
        parseInt(spell.key),
        spell.name,
        spell.cooldown[0],
        spell.description,
        spell.image.full,
      ]
    }  
    const res = await db.query(query)
    return res.rows
  }catch(e){
    console.log(e)
  }
}






module.exports = {
  addSummonerSpell,
}