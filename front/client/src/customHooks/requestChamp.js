import { useState, useEffect } from "react";
import axios from "axios";
import { vars } from "../page-assets/route";
import Cookies from "js-cookie";

export const useGetChamps = (summonerName, queue) => {

  const [champs, setChamps,] = useState([])

  useEffect(() => {
    const getChamps = async () => {
      try {
        const champs = await axios.get(`${vars.route}/summoner/${summonerName}/champion/rank?queue=${queue}&username=${Cookies.get('username')}&token=${Cookies.get('authToken')}`)
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

  return [champs, setChamps]
}