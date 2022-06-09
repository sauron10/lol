import { useGetPlayed } from "../../../customHooks/requestPlayed";
import { PlayedRow } from "./playedRow";


export const PlayedWith = (props) => {
  const [played] = useGetPlayed(props.summoner, props.queue)

  return (
    <>
      <div className="played-with">
        <div className="table-container">
          <table className="table is-narrow is-hoverable my-5">
            <thead>
              <tr>
                <td>Name</td>
                <td>Matches</td>
                <td>WR</td>
                <td>Gold</td>
                <td>Minions</td>
                <td>Wards</td>
                <td>Turrets</td>
                <td>Damage</td>
                <td>Damage B</td>
              </tr>
            </thead>
            <tbody>
              {played?.map(obj => (obj.current_summoner_name && <PlayedRow obj={obj} key={obj.current_summoner_name} />))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}