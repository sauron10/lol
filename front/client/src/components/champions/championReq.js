import { useCallback, useReducer, useState } from "react"
import axios from "axios"
import { vars } from "../../page-assets/route"
import Cookies from "js-cookie"
const iniReducer = {
  loaded:false,
  winrates:[],
  versions:[],
  bestSummoners:[],
  winratesXPatch:[],
  commonLanes:[],
  matchups:[],
  blurbs:[]
}

const reducer = (state,action) => {
  switch (action.type){
    case 'setWinrates':
      return {...state,winrates:action.payload}
    case 'setLoaded':
      return {...state,loaded:action.payload}
    case 'setVersions':
      return {...state,versions:action.payload}
    case 'setBestSummoners':
      return {...state,bestSummoners:action.payload}
    case 'setWinratesXPatch':
      return {...state,winrateByPatch:action.payload}
    case 'setCommonLanes':
      return {...state,commonLanes:action.payload}
    case 'setMatchups' : 
      return {...state,matchups:action.payload}
    case 'setBlurbs' : 
      return {...state,blurbs:action.payload}
    default:
      return state
  }
}

export const useChampionStats = () => {

  const [state,dispatch]=useReducer(reducer,iniReducer)

  let championByWinrate = async (queue, version) => {
    try {
      dispatch({type:'setLoaded',payload:false})
      const query = `?username=${Cookies.get('username')}&token=${Cookies.get('authToken')}&queue=${queue}&version=${version}%`
      const res = await axios.get(`${vars.route}/champions/winrate/${query}`)
      res.status === 200 && dispatch({type:'setWinrates',payload:res.data})
    } catch (e) {
      console.log('Error getting champions by winrate: ', e)
      return []
    } finally {
      dispatch({type:'setLoaded',payload:true})
    }
  }

  let matchVersions = async () => {
    try {
      dispatch({type:'setLoaded',payload:false})
      const sliceVersion = (version) => {
        const splitVersion = version.split('.')
        const firstTwo = splitVersion.slice(0, 2)
        firstTwo[1] = firstTwo[1].padStart(2, '0')
        return firstTwo.join('.')
      }

      const query = `?username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
      const res = await axios.get(`${vars.route}/game/versions/${query}`)
      if (res.status === 200) {
        const formattedVersions = res.data.map(version => sliceVersion(version.game_version))
        const uniqueVersions = [...new Set(formattedVersions)]
        uniqueVersions.sort((a, b) => b - a)
        dispatch({type:'setVersions',payload:res.data})
      }
    } catch (e) {
      console.log('Error getting matches patches: ', e)
      return []
    } finally{
      dispatch({type:'setLoaded',payload:true})
    }
  }

  let bestSummoners = async (champion) => {
    try {
      dispatch({type:'setLoaded',payload:false})
      const query = `?queue=420&username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
      const res = await axios.get(`${vars.route}/champions/best/${champion}/${query}`)
      if (res.status === 200) dispatch({type:'setBestSummoners', payload:res.data})
      return []
    } catch (e) {
      console.log('Error getting best summoner with a champion', e)
      return []
    } finally {
      dispatch({type:'setLoaded',payload:true})
    }
  }

  let winrateByPatch = async (champion) => {
    try {
      dispatch({type:'setLoaded',payload:false})
      const query = `?queue=420&username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
      const res = await axios.get(`${vars.route}/champions/winrate/${champion}/${query}`)
      if (res.status === 200) dispatch({type:'setWinratesXPatch', payload:res.data})
      return []
    } catch (e) {
      console.log('Error champion winrate by patch', e)
      return []
    } finally {
      dispatch({type:'setLoaded',payload:true})
    }
  }

  let commonLane = async (champion) => {
    try {
      dispatch({type:'setLoaded',payload:false})
      const query = `?version=%&username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
      const res = await axios.get(`${vars.route}/champions/lane/${champion}/${query}`)
      if (res.status === 200) dispatch({type:'setCommonLanes', payload:res.data})
      return []
    } catch (e) {
      console.log('Error champion common lane patch', e)
      return []
    } finally {
      dispatch({type:'setLoaded',payload:true})
    }
  }

  let championVsChampion = async (champion,position) => {
    try {
      dispatch({type:'setLoaded',payload:false})
      let query = `?username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
      query = `${query}&position=${position}&queue=420`
      const res = await axios.get(`${vars.route}/champions/against/${champion}/${query}`)
      if (res.status === 200) dispatch({type:'setMatchups',payload:res.data})
      return []
    } catch (e) {
      console.log('Error getting champion vs champion', e)
      return []
    } finally {
      dispatch({type:'setLoaded',payload:true})
    }
  }

  let championInfo = async (champion) => {
    try {
      dispatch({type:'setLoaded',payload:false})
      const query = `?username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
      const res = await axios.get(`${vars.route}/champions/info/${champion}/${query}`)
      if (res.status === 200) dispatch({type:'setBlurbs',payload:res.data})
      return []
    } catch (e) {
      console.log('Error getting champion info', e)
      return []
    } finally {
      dispatch({type:'setLoaded',payload:true})
    }
  }

  championByWinrate = useCallback(championByWinrate, [])
  matchVersions = useCallback(matchVersions, [])
  bestSummoners = useCallback(bestSummoners, [])
  winrateByPatch = useCallback(winrateByPatch, [])
  commonLane = useCallback(commonLane, [])
  championVsChampion = useCallback(championVsChampion, [])
  championInfo = useCallback(championInfo, [])

  return {
    ...state,
    championByWinrate,
    matchVersions,
    bestSummoners,
    winrateByPatch,
    commonLane,
    championVsChampion,
    championInfo
  }


}