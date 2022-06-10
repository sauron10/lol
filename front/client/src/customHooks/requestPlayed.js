import { useState, useEffect} from "react";
import axios from "axios";
import { vars } from "../page-assets/route";

export const useGetPlayed = (summonerName, queue) => {

  const [played, setPlayed] = useState([])

  useEffect(() => {
    const getPlayed = async () => {
      try {
        // console.log('Played effect ran')
        const playedWith = await axios.get(`${vars.route}/${summonerName}/played/?queue=${queue}`)
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