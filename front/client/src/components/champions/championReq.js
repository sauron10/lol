import { useCallback, useState } from "react"
import axios from "axios"
import { vars } from "../../page-assets/route"
import Cookies from "js-cookie"

export const useChampionStats = () => {

  const [data, setData] = useState(null)
  const [versions, setVersions] = useState([])
  const [loaded, setLoaded] = useState(false)

  let championByWinrate = async (queue, version) => {
    try {
      const query = `?username=${Cookies.get('username')}&token=${Cookies.get('authToken')}&queue=${queue}&version=${version}%`
      const res = await axios.get(`${vars.route}/champions/winrate/${query}`)
      res.status === 200 && setData(() => res.data)
    } catch (e) {
      console.log('Error getting champions by winrate: ', e)
      return []
    } finally {
      setLoaded(true)
    }
  }

  let matchVersions = async () => {
    try {
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
        setVersions(() => uniqueVersions)
      }
    } catch (e) {
      console.log('Error getting matches patches: ', e)
      return []
    }
  }

  let bestSummoners = async (champion) => {
    try {
      setLoaded(false)
      const query = `?queue=420&username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
      const res = await axios.get(`${vars.route}/champions/best/${champion}/${query}`)
      if (res.status === 200) return res.data
      return []
    } catch (e) {
      console.log('Error getting best summoner with a champion', e)
      return []
    } finally {
      setLoaded(true)
    }
  }

  let winrateByPatch = async (champion) => {
    try {
      setLoaded(false)
      const query = `?queue=420&username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
      const res = await axios.get(`${vars.route}/champions/winrate/${champion}/${query}`)
      if (res.status === 200) return res.data
      return []
    } catch (e) {
      console.log('Error champion winrate by patch', e)
      return []
    } finally {
      setLoaded(true)
    }
  }

  let commonLane = async (champion) => {
    try {
      setLoaded(false)
      const query = `?version=%&username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
      const res = await axios.get(`${vars.route}/champions/lane/${champion}/${query}`)
      if (res.status === 200) return res.data
      return []
    } catch (e) {
      console.log('Error champion common lane patch', e)
      return []
    } finally {
      setLoaded(true)
    }
  }

  let championVsChampion = async (champion) => {
    try {
      setLoaded(false)
      const query = `?version=%&position=TOP&queue=420&username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
      const res = await axios.get(`${vars.route}/champions/against/${champion}/${query}`)
      if (res.status === 200) return res.data
      return []
    } catch (e) {
      console.log('Error getting champion vs champion', e)
      return []
    } finally {
      setLoaded(true)
    }
  }

  let championInfo = async (champion) => {
    try {
      setLoaded(false)
      const query = `?username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
      const res = await axios.get(`${vars.route}/champions/info/${champion}/${query}`)
      if (res.status === 200) return res.data
      return []
    } catch (e) {
      console.log('Error getting champion info', e)
      return []
    } finally {
      setLoaded(true)
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
    data, versions,
    loaded, championByWinrate,
    matchVersions, bestSummoners,
    winrateByPatch, commonLane,
    championVsChampion, championInfo
  }


}