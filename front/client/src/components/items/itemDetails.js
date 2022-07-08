import { useCallback, useState } from "react"
import axios from "axios"
import { vars } from "../../page-assets/route"
import Cookies from "js-cookie"

export const useItems = () => {
  const [items, setItems] = useState([])
  const [loaded, setLoaded] = useState(false)

  let getCommonItemsSummonerChampion = (summoner, champion) => {
    try {
      const getData = async () => {
        let query = `?username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
        const res = await axios.get(`${vars.route}/items/common/${summoner}/${champion}/${query}`)
        return res
      }
      setLoaded(false)
      getData().then((res) => {
        if (res.status === 200) setItems(res.data)
      })
    } catch (e) {
      console.log('Error getting most common items used by a player with a champion')
      return []
    } finally {
      setLoaded(true)
    }
  }

  let getCommonItemsChampion = (champion) => {
    try {
      const getData = async () => {
        let query = `?username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
        query = `${query}&queue=420&version=%`
        const res = await axios.get(`${vars.route}/items/common/${champion}/${query}`)
        return res
      }
      setLoaded(false)
      getData().then((res) => {
        if (res.status === 200) setItems(res.data)
      })
    } catch (e) {
      console.log('Error getting most common items used by champion')
      return []
    } finally {
      setLoaded(true)
    }
  }

  getCommonItemsSummonerChampion = useCallback(getCommonItemsSummonerChampion,[])
  getCommonItemsChampion = useCallback(getCommonItemsChampion,[])


  return { items, loaded, getCommonItemsSummonerChampion, getCommonItemsChampion }
}