import { useEffect,useState } from "react";
import axios from "axios";

export const useGetSummoner = summonerName => {

  const [name] = useState(() => summonerName)
  const [data, setData ] = useState(null)

  const getData = async (summonerName) => {
    try {
      return await axios.get(`http://localhost:8080/${summonerName}`);
    } catch (e) {
      console.log("Axios error", e);
    }
  };

  const updateData = async(num) => {
    try{
      const res = await axios.get(`http://localhost:8080/${summonerName}/?start=${num}`)
      res.status === 200 && setData(prevData => {return {...prevData,'matches':[...prevData['matches'],...(res.data[0].matches)]}})
    }catch (e) {
      console.log('Update axios error',e)
    }
  }
  

  useEffect(() => {
    getData(name).then((response) => {
      const success = response.status === 200;
      success &&
        setData(() => response.data.data[0])
    });
  }, [name]);

  return [data,updateData]
}