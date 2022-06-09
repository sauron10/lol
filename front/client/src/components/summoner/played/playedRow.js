import { useNavigate } from "react-router-dom"

export const PlayedRow = (props) => {
  const navigate = useNavigate()

  return(
    <tr onClick={() => navigate(`/summoner/${props.obj.current_summoner_name}`)}>
      <td>{props.obj.current_summoner_name}</td>
      <td className="has-text-centered">{props.obj.count}</td>
      <td>{(props.obj.wins/props.obj.count*100).toFixed(1)}%</td>
      <td>{props.obj.gold}</td>
      <td>{props.obj.minions}</td>
      <td>{props.obj.wards}</td>
      <td>{props.obj.turrets}</td>
      <td>{props.obj.damage}</td>
      <td>{props.obj.dmg_buildings}</td>
      
    </tr>
  )
}