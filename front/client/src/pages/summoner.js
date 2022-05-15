import Nav from "../components/nav";
import { useParams } from "react-router-dom";
import SummonerCard from "../components/summoner/summonerCard";
import { useGetSummoner } from "../customHooks/requestSummoner";
import { Achievement } from "../components/summoner/achievementsCard";
import { Match } from "../components/summoner/match";
import { useState } from "react";

const Summoner = () => {
  const [data,updateData] = useGetSummoner(useParams().summonerName);
  const [index,setIndex] = useState(10)

  const loadMore = () => {
    updateData(index)
    setIndex(prevIndex => prevIndex + 10)
  }

  const isLoaded = (data) => data !== null;

  return (
    <>
      <Nav />

      <div className="columns ">
        {/* First column */}
        <div className="column is-narrow pl-6 pr-4 mt-5 is-hidden-mobile">
          {isLoaded(data) && <SummonerCard summoner={data} />}
        </div>
        {/* Second column */}
        <div className="column mt-5">
          <div className="px-6">
            <div className="columns">
              <div className="column">
                {isLoaded(data) && <Achievement summoner={data} />}
              </div>
              <div className="column">
                {isLoaded(data) && <Achievement summoner={data} />}
              </div>
              <div className="column">
                {isLoaded(data) && <Achievement summoner={data} />}
              </div>
            </div>
          </div>
          {isLoaded(data) &&
            data.matches.map((match) => (
              <Match summoner={match} key={`${match.id}/${match.game_creation}}`} />
            ))}

          <button className="button" onClick={loadMore}>Load More</button>
        </div>
        {/* Third column */}
        <div className="column is-narrow pr-5"></div>
      </div>
    </>
  );
};

export default Summoner;
