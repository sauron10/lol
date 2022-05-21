import { useState,useEffect, useCallback } from "react";
import axios from "axios";

export const useGetSummoner = summonerName => {


  const [data, setData ] = useState(null)
  const [loaded,setLoaded] = useState(false)

  const updateData = async(num,queue) => {
    try{
      setLoaded(false)
      const res = await axios.get(`http://localhost:8080/${summonerName}/?start=${num}&queue=${queue}`)
      const data = res.data[0].matches === null ? []:res.data[0].matches
      res.status === 200 && setData(prevData => {return {...prevData,'matches':[...prevData['matches'],...data]}})
    }catch (e) {
      console.log('Update axios error',e)
    } finally {
      setLoaded(true)
    }
  }

  const updateQueue = useCallback(async(queue) => {
    try{
      setLoaded(false)
      const res = await axios.get(`http://localhost:8080/${summonerName}/?queue=${queue}&start=0`)
      const data = res.data[0].matches === null ? []:res.data[0].matches
      res.status === 200 && setData(prevData => {return {...prevData,'matches': data}})
    }catch(e){
      console.log('Update queue error')
    }finally{
      setLoaded(true)
    }
  },[summonerName])

  const updateProfileData = async (selectedTab) => {
    try{
      setLoaded(false)
      const res = await axios.get(`http://localhost:8080/${summonerName}/update/?queue=${selectedTab}`)
      res.status === 200 && setData(res.data.data[0])
    }catch(e){
      console.log('Error updating Profile Data')
    }finally{
      setLoaded(true)
    }
  }

  useEffect(() => {
    const getData = async (summName) => {
      try {
        return await axios.get(`http://localhost:8080/${summName}/`);
      } catch (e) {
        console.log("Axios error", e);
      } finally{
        setLoaded(true)
      }
    };

    console.log('Req data effect ran')
    getData(summonerName).then((response) => {
      const success = response.status === 200;
      success &&
        setData(() => response.data.data[0])
    });
  }, [summonerName]);

  // useEffect(useCallback(() => getData,[]),[])

  return [data,updateData,updateQueue,loaded,updateProfileData]
}