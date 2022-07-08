import { ChampionImage } from "../championImage"

export const ChampCard = (props) => {
  return(
    <>
    <div className="columns has-text-white has-text-centered is-mobile mt-3 is-centered">
      <div className="column is-narrow">
        <ChampionImage image={props.champ.image} size={'is-48x48'}/>
      </div>
      {/* Kills */}
      <div className="column px-0 kill-column">
        <p className="is-size-7">{`${props.champ.kills}/${props.champ.deaths}/${props.champ.assists}`}</p>
        <p>{((parseFloat(props.champ.kills) + parseFloat(props.champ.assists))/ parseFloat(props.champ.deaths)).toFixed(1)}</p>
      </div>
      {/* Matches */}
      <div className="column is-narrow">
        <p className="is-size-7">{props.champ.games} games</p>
        <p>{(props.champ.wins / props.champ.games*100).toFixed(1)}%</p>
      </div>
      {/* Minions */}
      <div className="column is-narrow">
        {/* <p className="is-size-7">minions</p> */}
        <p>{(props.champ.minions/props.champ.duration*60).toFixed(2)}</p>
      </div>
      {/* Game duration */}
      <div className="column is-narrow">
        {/* <p className="is-size-7"> duration</p> */}
        <p>{Math.floor(props.champ.duration/60)}:{((n)=> String(n).padStart(2,'0'))(Math.floor(props.champ.duration) % 60)}</p>
      </div>
    </div>
    </>
  )
}