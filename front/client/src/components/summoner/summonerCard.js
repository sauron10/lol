import { ImageEmblem } from "./importImage";
import { getFirstEmblems } from "./functions";

const SummonerCard = (props) => {
  return (
    <div id="summCard" className="container has-text-centered px-2">
      <div className="image is-128x128 is-inline-block mt-5">
        <img
          className="is-rounded"
          src={`${process.env.PUBLIC_URL}/img/profileicon/${props.summoner.icon}`}
          alt="ProfileIcon"
        />
      </div>
      <p className="title is-size-2 has-text-light my-1">
        {props.summoner.summoner_name}
      </p>
      <button className="button my-3" onClick={props.updateProfile}>{props.loaded ? 'Update' : 'Loading...'}</button>
      <button className="button my-3" onClick={props.getSeasonMatches}>{props.loaded ? 'Consolidate season' : 'Loading...'}</button>

      <div>
        {props.summoner.leagues && getFirstEmblems(props.summoner.leagues).map((emblem) => 
          <ImageEmblem emblem={emblem} key={`${emblem.date}/${emblem.queue_type}`} />
        )}
        {/* {props.summoner.leagues && props.summoner.leagues.map((l,i,arr) => (
          i < 2 &&
          <ImageEmblem emblem={l} key={`${l.date}/${l.queue_type}`} />
        ))} */}
      </div>
    </div>
  );
};

export default SummonerCard;
