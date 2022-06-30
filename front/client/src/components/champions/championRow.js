import { ChampionImage } from "../summoner/championImage"
import {useNavigate } from "react-router-dom"

export const ChampionRow = (props) => {
  const { image, name, games, wr, ban_rate, pick_rate } = props.champion

  const navigate = useNavigate()

  const handleClick = e => {
    e.preventDefault()
    try{
      navigate(`/champions/${name}`)
    }catch(e){
      console.log(e)
    }
  }


  return (
    <tr onClick={handleClick}>
      <td><ChampionImage image={image} size={'is-48x48'} /></td>
      <th>{name}</th>
      <td>
        <p>{wr}%</p>
        <p className="is-size-7">{games}</p>
      </td>
      <td>{pick_rate}%</td>
      <td>{ban_rate ?? '-'}%</td>
    </tr>
  )
}