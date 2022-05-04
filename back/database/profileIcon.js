const db = require('./index')

const addSummonerIcon = async summ => {

  try{
    const query ={
      text : 'INSERT INTO profile_icon_summoner VALUES ($1,$2)',
      values : [
        summ.id,
        summ.profileIconId,
      ]
    }
    const res = await db.query(query)
    return res.rows
  }catch(e){
    console.log(e)
  }
}

const addIcon = async icon => {
  try{
    const res = await db.query('INSERT INTO profile_icon VALUES ($1,$2)',[icon.id,icon.image.full])
  return res.rows
  }catch(e){
    console.log(e)
  }

}


module.exports = {
  addSummonerIcon,
  addIcon,
}