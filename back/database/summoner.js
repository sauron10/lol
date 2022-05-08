const db = require('./index')


const getSummonerDB = async summName => {
  try{
    // console.log(summName)
    const res = await db.query("SELECT * FROM summoner WHERE summoner_name SIMILAR TO $1",[summName])
    return res.rows    
  }catch(error){
    console.error(error)
  }
}

const addSummonerDB = async summ => {
  try{
    const query ={
      text : 'INSERT INTO summoner VALUES ($1,$2,$3,$4)',
      values : [
        summ.id,
        summ.name,
        summ.puuid,
        summ.summonerLevel,
      ]
    }
    
    const res = await db.query(query)
  }catch(e){
    console.log(e)
  }
}

const getSummonerList = async () => {
  try{
    const res = await db.query(
      'select * from summoner limit 5000',
      [])
    return res.rows
    

  }catch(e){
    console.log('Eror with getSummonerList :',e)
  }
}


module.exports = {
  getSummonerDB,
  addSummonerDB,
  getSummonerList,
}