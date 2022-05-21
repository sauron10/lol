import { ImageEmblem } from "./importImage"

export const MobileSummonerCard = props => {
  return (
    <>
      <div className="columns my-0 container mscard m-2">
        <div className="column mx-6 is-narrow is-centered is-inline-block has-text-centered">
          <div className="image is-128x128 ml-2">
            <img
              className="is-rounded"
              src={`${process.env.PUBLIC_URL}/img/profileicon/${props.summoner.icon}`}
              alt="ProfileIcon"
            />
          </div>
          <p className="title is-size-5 has-text-light mt-3">{props.summoner.summoner_name}</p>
        </div>
        <button className="button my-3" onClick={props.updateProfile}>{props.loaded ? 'Update' : 'Loading...'}</button>

        {props.summoner.leagues.map((l) => (

          <div className="column is-inline-block is-centered has-text-centered" key={l.date+'mov'}>
            <ImageEmblem emblem={l}/>
            
          </div>

        ))}
      </div>
    </>

  )

}