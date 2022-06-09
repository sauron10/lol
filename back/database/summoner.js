const db = require('./index')


const getSummonerDB = async summName => {
  try{
    // console.log(summName)
    const res = await db.query("SELECT * FROM summoner WHERE lower(summoner_name) = lower($1)",[summName])
    return res.rows    
  }catch(error){
    console.log('Error getSummonerDB',error)
  }
}

const addSummonerDB = async summ => {
  try{
    const query ={
      text : `INSERT INTO summoner VALUES ($1,$2,$3,$4)
              ON CONFLICT (id) DO UPDATE SET
              summoner_name = EXCLUDED.summoner_name,
              puuid = EXCLUDED.puuid,
              summoner_level = EXCLUDED.summoner_level`,
      values : [
        summ.id,
        summ.name,
        summ.puuid,
        summ.summonerLevel,
      ]
    }
    
    const res = await db.query(query)
  }catch(e){
    console.log('Error adding a new summoner: ',e)
  }
}

const getSummonerList = async () => {
  try{
    const res = await db.query(
      'select * from summoner limit 5000',
      [])
    return res.rows
    

  }catch(e){
    console.log('Error with getSummonerList :',e)
  }
}


module.exports = {
  getSummonerDB,
  addSummonerDB,
  getSummonerList,
}