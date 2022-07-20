import { useState, useEffect, useCallback, useMemo, useDebugValue } from "react";
import axios from "axios";
import { vars } from "../page-assets/route";
import Cookies from "js-cookie";

export const useGetSummoner = summonerName => {


  const [data, setData] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [time, setTime] = useState(0)
  const [winrate, setWinrate] = useState([])

  useDebugValue(data,'data')

  const getKP = (ka, team, teams) => {
    let teamKills = 0
    teams.forEach(t => {
      if (t.team_number === team) {
        teamKills = t.champion_kills
      }
    })
    return (ka / teamKills * 100).toFixed(1)
  }

  const addKP = useCallback((arr) => {
    return arr.map(match =>
    ({
      ...match,
      kp: getKP(match.kills + match.assists, match.team, match.teams)
    }))
  }, [])


  let getWinrate = async (summoner, queue = 420) => {
    try {
      setLoaded(false)
      const query = `?username=${Cookies.get('username')}&token=${Cookies.get('authToken')}&queue=${queue}`
      const res = await axios.get(`${vars.route}/patch/winrate/${summoner}/${query}`)
      if (res.status === 200) setWinrate(() => res.data)
    } catch (e) {
      console.log('Error getting winrates per patch: ', e)
    } finally {
      setLoaded(true)

    }
  }


  const updateData = useCallback(async (num, queue, champion = '', matchList) => {
    try {
      setLoaded(false)
      const res = await axios.post(`${vars.route}/summoner/${summonerName}/`,
        {
          type: 'matches',
          name: summonerName,
          queue,
          size: num,
          champion,
          matchList,
          username: Cookies.get('username'),
          token: Cookies.get('authToken')
        })
      const info = res.data.matches ?? []
      res.status === 200 && setData(prevData => {
      const prevDataMatch = prevData?.matches ?? []
      const matches = [...prevDataMatch,...info].sort((a, b) => b.game_creation - a.game_creation)
        return { ...prevData, matches: addKP(matches) }
      })
    } catch (e) {
      console.log('Update axios error', e)
    } finally {
      setLoaded(true)
    }
  }, [addKP, summonerName])

  const getSeasonMatches = async () => {
    try {
      setLoaded(false)
      const res = await axios.get(`${vars.route}/summoner/${summonerName}/season/?startTime=1641549600&username=${Cookies.get('username')}&token=${Cookies.get('authToken')}
      `)
      return res
    } catch (e) {
      console.log('Season matches error: ', e)
    } finally {
      setLoaded(true)
    }
  }

  let getWastedTime = async () => {
    try {
      const res = await axios.post(`${vars.route}/summoner/${summonerName}`,
        {
          type: 'time',
          name: summonerName,
          username: Cookies.get('username'),
          token: Cookies.get('authToken')

        })
      setTime(() => res.data.wasted_time)
    } catch (e) {
      console.log('Wasted Time error')
    }
  }

  const updateProfileData = async (selectedTab) => {
    try {
      setLoaded(false)
      const res = await axios.get(`${vars.route}/summoner/${summonerName}/update/?queue=${selectedTab}&username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`)
      res.status === 200 && setData({ ...res.data, matches: addKP(res.data.matches) })
    } catch (e) {
      console.log('Error updating Profile Data',e)
    } finally {
      setLoaded(true)
    }
  }

  const cleanMatches = useCallback(async () => {
    try {
      setData(prevData => ({ ...prevData, matches: [] }))
    } catch (e) {
      console.log('Error cleaning matches')
    }
  }, [])

  useEffect(() => {
    const getData = async (summName) => {
      try {
        setLoaded(false)
        return await axios.post(`${vars.route}/summoner/${summName}/`,
          {
            type: 'profile',
            name: summName,
            username: Cookies.get('username'),
            token: Cookies.get('authToken')
          });
      } catch (e) {
        console.log("Axios error", e);
      } finally {
        setLoaded(true)
      }
    };

    getData(summonerName).then((response) => {
      const success = response.status === 200;
      success &&
        setData(() => ({ ...response.data.profile, matches: [] }))
    });
  }, [summonerName]);


  getWinrate = useCallback(getWinrate, [])
  getWastedTime = useCallback(getWastedTime,[summonerName])

  return {
    data,
    updateData,
    loaded,
    updateProfileData,
    getSeasonMatches,
    cleanMatches,
    time,
    winrate,
    getWinrate,
    getWastedTime
  }
}