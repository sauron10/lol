import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { vars } from "../page-assets/route";
import Cookies from "js-cookie";

export const useGetSummoner = summonerName => {


  const [data, setData] = useState(null)
  const [loaded, setLoaded] = useState(false)


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
        const matches = [...(prevData.matches), ...info].sort((a, b) => b.game_creation - a.game_creation)
        return { ...prevData, matches }
      })
    } catch (e) {
      console.log('Update axios error', e)
    } finally {
      setLoaded(true)
    }
  }, [summonerName])

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

  const getWastedTime = async () => {
    try {
      const res = await axios.post(`${vars.route}/summoner/${summonerName}`,
        {
          type: 'time',
          name: summonerName,
          username: Cookies.get('username'),
          token: Cookies.get('authToken')

        })
      console.log(res.data.wasted_time)
      return res.data.wasted_time
    } catch (e) {
      console.log('Wasted Time error')
    }
  }

  const updateProfileData = async (selectedTab) => {
    try {
      setLoaded(false)
      const res = await axios.get(`${vars.route}/summoner/${summonerName}/update/?queue=${selectedTab}&username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`)
      // console.log(res.data)
      res.status === 200 && setData(res.data)
    } catch (e) {
      console.log('Error updating Profile Data')
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
      console.log(response.data)
      success &&
        setData(() => ({ ...response.data.profile, matches: [] }))
    });
  }, [summonerName]);

  // useEffect(useCallback(() => getData,[]),[])

  return [data, updateData, loaded, updateProfileData, getSeasonMatches, cleanMatches, getWastedTime]
}