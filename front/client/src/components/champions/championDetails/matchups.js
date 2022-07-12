import { ChampionImage } from "../../summoner/championImage"
import { useNavigate } from "react-router-dom"

export const Matchups = props => {
  const nav = useNavigate()

  const navigate = (name) => {
    nav(`/champions/${name}`)
    props.dispatch({type:'changeName', payload:name})
  }

  return(
    <table className="table has-text-centered background-table" >
      <thead>
        <tr>
          <th>Image</th>
          <th>Name</th>
          <th>Matches</th>
          <th>Winrate</th>
        </tr>
      </thead>
      <tbody>
        {props?.vs?.map(versus => (
          <tr className="clickable" onClick={() => navigate(versus.name)} key={`${versus.name}-${versus.individual_position}`}> 
            <td><ChampionImage size={'is-48x48'} image={versus.image}/></td>
            <th>{versus.name}</th>
            <td>{versus.matches}</td>
            <td>{versus.winrate}%</td>
          </tr>
        ))}
      </tbody>

    </table>
  )
}