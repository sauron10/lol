const db = require('./index')

const addSummonerIcon = async summ => {
  try{
    if(summ.profileIconId < 1) return 0
    const query ={
      text : `INSERT INTO profile_icon_summoner (summoner_id,profile_icon_id) VALUES ($1,$2)
              ON CONFLICT (summoner_id,profile_icon_id) DO UPDATE SET
              summoner_id = EXCLUDED.summoner_id,
              profile_icon_id = EXCLUDED.profile_icon_id
              `,
      values : [
        summ.id,
        summ.profileIconId,
      ]
    }
    const res = await db.query(query)
    return res.rows
  }catch(e){
    console.log('Error adding summoner icon: ',e)
  }
}

const addIcon = async icon => {
  try{
    const res = await db.query('INSERT INTO profile_icon VALUES ($1,$2) ON CONFLICT (id) DO NOTHING',[icon.id,icon.image.full])
  return res.rows
  }catch(e){
    console.log('Error adding icon: ',e)
  }

}


module.exports = {
  addSummonerIcon,
  addIcon,
}