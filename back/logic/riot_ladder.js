const { response } = require('express')
const express = require('express')
const axios = require('axios').default
const dbM = require('../database/summoners')
const fs = require('fs')

const config = {
  headers : {
    "X-Riot-Token": "RGAPI-d53834f3-262c-49a5-b2d8-8c23640283ae",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.88 Safari/537.36",
  },
  validateStatus : function (status) {
    return true
  }
}



const checkSummoner = async summName => {
  try{
    const res = await dbM.getSummonerDB(summName)
    // console.log(resSum)
    if (res.length > 0) {
      console.log("Summoner in DB")
      if(!res[0].profile_icon_id){
        const resSum = await requestSummoner(summName)
        const resUp = await dbM.updateSummonerName(resSum)
        console.log('Updated',resUp)
        return resUp
      }
      console.log('Already in database')
      return res     
    }else {
      const resSum = await requestSummoner(summName)
      const resSav = await dbM.saveSummonerName(resSum)
      console.log('Saved',resSav)
      return resSav
    }
  }catch(e){
    console.error(e)
  }

}


const requestSummoner = async summName => {
  const response = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summName}`,config)
  return response.data
} 

const getLadder = async (division,rank) => {
  var cummResp = []
  var page = 1
  var end = true
  var time = 100
  try{
    do{
      const response = await axios.get(`https://na1.api.riotgames.com/lol/league/v4/entries/RANKED_SOLO_5x5/${division}/${rank}?page=${page}`,config)
      .then(x => new Promise(resolve => setTimeout(() => resolve(x), time)))
      
      if (response.status === 200){   
        cummResp = [...cummResp,...response.data]
        time = 100
        page +=1
        if (!response.data.length) {
          end = !end
        }
      }
      else{
        time = 120000
        console.log('Waiting......')
      }
      
      const now = new Date()
      console.log(division,rank,page,response.status,`${0}:${1}:${2}`,[date.getHours(),date.getMinutes(),date.getSeconds()])
    }while(end)
    return cummResp
  }catch(error) {    
    console.error(error)
  }
  
}

const addSummonerToDatabase = async (dataList) => {
  try{
    dataList.forEach((value) => {
      dbM.saveSummoner(value)
    })
  }catch(error){
    console.error(error)
  }
}

const populatePuuid = async () => {
  try{
    console.log('getting summoners')
    dbM.getAllSummoners('summoner_id','')
    .then(data => getPuuids(data))
  }catch(error){
    console.error(error)
  }
}

const getPuuids = async (summIds) => {
  // summIds.forEach((summId) => {
    
    for (let i = 0; i < summIds.length;i++){
      // console.log(i)
      setTimeout(() => {

        requestPuuids(summIds[i].summoner_id)

      },i * 1500)


      
    }
    // console.log('Getting PUUIDS')
    
    // .then(puuid => console.log(puuid))
    // console.log('getPuuid',res.data)
  // })
}

const requestPuuids = async summId => {
  const res = await axios.get(`https://na1.api.riotgames.com/lol/summoner/v4/summoners/${summId}`,config)
  dbM.updateSummoner(res.data.id,res.data.puuid)
}



module.exports = {getLadder,addToDatabase: addSummonerToDatabase,populatePuuid,checkSummoner}