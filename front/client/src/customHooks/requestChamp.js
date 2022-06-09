import { useState, useEffect} from "react";
import axios from "axios";

export const useGetChamps = (summonerName, queue) => {

  const [champs , setChamps,] = useState([])

  useEffect(() => {
    const getChamps = async () => {
      try {
        console.log('Champ effect ran')
        const champs = await axios.get(`http://localhost:8080/${summonerName}/champion/rank?queue=${queue}`)
        // console.log(champs)
        return champs
      } catch (e) {
        console.log('Error getting champs: ', e)
      }
    }
    getChamps().then((response) => {
      const success = response?.status === 200;
      success && setChamps(() => response.data)
    })

  }, [summonerName, queue])

  // console.log(champs)
  return [champs, setChamps]
}