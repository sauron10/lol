import { ChampionImage } from "../../summoner/championImage"

export const Matchups = props => {
  return(
    <table className="table has-text-centered">
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
          <tr>
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