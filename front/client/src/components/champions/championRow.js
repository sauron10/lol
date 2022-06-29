import { ChampionImage } from "../summoner/championImage"

export const ChampionRow = (props) => {
  const { image, name, games, wr, ban_rate, pick_rate } = props.champion

  return (
    <tr>
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