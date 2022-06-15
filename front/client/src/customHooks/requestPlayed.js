import { useState, useEffect} from "react";
import axios from "axios";
import { vars } from "../page-assets/route";
import Cookies from "js-cookie";

export const useGetPlayed = (summonerName, queue) => {

  const [played, setPlayed] = useState([])

  useEffect(() => {
    const getPlayed = async () => {
      try {
        // console.log('Played effect ran')
        const playedWith = await axios.get(`${vars.route}/summoner/${summonerName}/played/?queue=${queue}&username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`)
        return playedWith
      } catch (e) {
        console.log('Error getting champs: ', e)
      }
    }
    getPlayed().then((response) => {
      const success = response?.status === 200;
      success && setPlayed(() => response.data)
    })

  }, [summonerName, queue])

  // console.log(played)
  return ([played, setPlayed])
}