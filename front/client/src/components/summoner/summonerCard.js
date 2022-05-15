import { ImageEmblem } from "./importImage";

const SummonerCard = (props) => {
  // console.log(props.summoner)
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
      <div>
        {props.summoner.leagues.map((l) => (
          <ImageEmblem emblem={l} key={l.date} />
        ))}
      </div>
    </div>
  );
};

export default SummonerCard;
