import { useCallback, useState } from "react"
import axios from "axios"
import { vars } from "../../page-assets/route"
import Cookies from "js-cookie"

export const useChampionStats = () => {

  const [data,setData] = useState(null)
  const [versions,setVersions] = useState([])
  const [loaded,setLoaded] = useState(false)

  let championByWinrate = async (queue,version) => {
    try{
      const query = `?username=${Cookies.get('username')}&token=${Cookies.get('authToken')}&queue=${queue}&version=${version}%`
      const res = await axios.get(`${vars.route}/champions/winrate/${query}`)
      res.status === 200 && setData(() => res.data)
    }catch(e){
      console.log('Error getting champions by winrate: ',e)
      return []
    }finally{
      setLoaded(true)
    }
  }

  let matchVersions = async() => {
    try{
      const sliceVersion = (version) => {
        const splitVersion = version.split('.')
        const firstTwo = splitVersion.slice(0,2)
        firstTwo[1] = firstTwo[1].padStart(2,'0')
        return firstTwo.join('.')
      }

      const query = `?username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`
      const res = await axios.get(`${vars.route}/game/versions/${query}`)
      if (res.status === 200){
        const formattedVersions = res.data.map(version => sliceVersion(version.game_version))
        const uniqueVersions = [...new Set(formattedVersions)]
        uniqueVersions.sort((a,b) => b - a)
        setVersions(() => uniqueVersions)
      } 
    }catch(e){
      console.log('Error getting matches patches: ',e)
      return []
    }
  }

  championByWinrate = useCallback(championByWinrate,[])
  matchVersions = useCallback(matchVersions,[])

  return [data,versions,loaded, championByWinrate,matchVersions]


}