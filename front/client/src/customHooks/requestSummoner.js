import { useState,useEffect, useCallback } from "react";
import axios from "axios";

export const useGetSummoner = summonerName => {


  const [data, setData ] = useState(null)
  const [loaded,setLoaded] = useState(false)

  const updateData = useCallback(async(num,queue,champion='') => {
    try{
      setLoaded(false)
      console.log('Updating data')
      const res = await axios.get(`/api/${summonerName}/?start=0&queue=${queue}&size=${num}&champion=${champion}`)
      const data = res?.data[0]?.matches === null ? []:res?.data[0]?.matches
      res.status === 200 && setData(prevData => {return {...prevData,'matches':data}})
    }catch (e) {
      console.log('Update axios error',e)
    } finally {
      setLoaded(true)
    }
  },[summonerName])

  const getSeasonMatches = async() =>{
    try{
      setLoaded(false)
      const res = await axios.get(`/api/${summonerName}/season/?startTime=1641549600`)
      return res
    }catch(e){
      console.log('Season matches error: ',e)
    } finally{
      setLoaded(true)
    }
  }

  const updateProfileData = async (selectedTab) => {
    try{
      setLoaded(false)
      const res = await axios.get(`/api/${summonerName}/update/?queue=${selectedTab}`)
      res.status === 200 && setData(res.data?.data[0])
    }catch(e){
      console.log('Error updating Profile Data')
    }finally{
      setLoaded(true)
    }
  }

  useEffect(() => {
    const getData = async (summName) => {
      try {
        return await axios.get(`/api/${summName}/`);
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

  return [data,updateData,loaded,updateProfileData,getSeasonMatches]
}