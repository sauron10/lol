import { Spell } from "./spell";
import { Rune } from "./rune";
import { Item } from "./item";
import { Player } from "./player";
import { ExpandedMatchTable } from "./expandedMatchTable";
import { useState, useEffect } from "react";
import { isMainRune } from "./helperFunc";
import { ChampionImage } from "./championImage";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDragon, faOtter, faChessRook } from '@fortawesome/free-solid-svg-icons'


export const Match = (props) => {
  const [expanded, setExpanded] = useState(false);
  const [date, setDate] = useState('')

  const handleMatchClick = () => {
    setExpanded((prev) => !prev);
  };

  const matchId = {
    900: 'URF',
    400: 'Normal',
    420: 'Solo',
    440: 'Flex',
    450: 'ARAM',

  }
  useEffect(() => {
    const manageDate = () => {
      const dateObj = new Date(props.summoner.game_creation)
      const dateNow = new Date()
      setDate(dateObj.toDateString() === dateNow.toDateString() ? `${dateObj.getHours()}:${dateObj.getMinutes()}:${dateObj.getSeconds()}` : dateObj.toDateString())
    }

    manageDate()

  }, [props.summoner.game_creation])


  const pair = (arr) => {
    var newArr = [];
    var start = 0;
    var end = 5;
    while (end < arr.length) {
      newArr.push([arr[start], arr[end]]);
      start++;
      end++;
    }
    return newArr;
  };

  const isInsideRange = (start, end) => {
    return props.position < start && props.position > end
  }

  const getKillPart = () => {
    const ka = props.summoner.kills + props.summoner.assists
    const team = props.summoner.team
    let teamKills = 0
    props.summoner.teams.forEach(t => {
      if(t.team_number === team){
        teamKills = t.champion_kills
      }
    })
    return (ka/teamKills*100).toFixed(1)
  }



  return (props.summoner.queue_id in matchId) ? (
    
    <>
      <div
        className={props.loaded ? "container has-text-centered px-1 is-max-desktop" : "container has-text-centered px-1 is-max-desktop transparent"}
        onClick={handleMatchClick}
      >
        <div className="columns my-3 has-text-light is-mobile">
          <div className={(props.summoner.win ? 'column is-narrow win' : 'column is-narrow lose')}>

          </div>
          {/* Champion image*/}
          <div className="column is-narrow pt-5 pr-0">
            <p className="is-size-7 date">{date}</p>
            <figure className="image is-48x48">
              <img
                className="is-rounded"
                src={`${process.env.PUBLIC_URL}/img/champion/${props.summoner.image}`}
                alt="Champion"
              />
            </figure>
            <p>{matchId[props.summoner.queue_id]}</p>
          </div>
          {/* Summoner Spells */}
          <div className="column image is-rounded is-32x32 is-narrow pt-5">
            {props.summoner.summoner_spells && props.summoner.summoner_spells.map((spell) => (
              <Spell spell={spell} key={spell.id} />
            ))}
          </div>
          {/* Runes */}
          <div className="column image is-rounded is-32x32 is-narrow pt-5 is-hidden-mobile">
            {props.summoner.runes.map(
              (rune) =>
                isMainRune(rune.id) && <Rune rune={rune} key={rune.id} />
            )}
          </div>
          {/* KDA */}
          <div className="column is-narrow pt-5 px-0">
            <p>KDA</p>
            <p>{`${props.summoner.kills}/${props.summoner.deaths}/${props.summoner.assists}`}</p>
          </div>
          {/* Items */}
          <div className="column pl-5 pr-0">
            <div className="columns is-multiline is-gapless mt-3 is-mobile item-column">
              {props.summoner?.items?.map((item) => (
                <div className="column is-one-quarter p-0 m-0 is-16x16" key={item.id}>
                  <Item item={item} key={item.id} />
                </div>
              ))}
            </div>
          </div>
          {/* Farm */}
          <div className="column is-narrow pt-5">
            <p>CS</p>
            <p>{props.summoner.minions_killed}</p>
          </div>
          {/* Kill participation */}
          <div className="column is-narrow pt-5">
            <p>KP</p>
            <p>{getKillPart()}%</p>
          </div>
          {/* Players */}
          {(isInsideRange(5000, 1484) || isInsideRange(769, 600)) && <div className="column">
            <div className="columns is-multiline is-gapless has-text-light is-mobile">
              {pair(props.summoner.players).map((playerPair) => (
                <Player playerPair={playerPair} key={playerPair[0].id + playerPair[0].current_summoner_name} />
              ))}
            </div>
          </div>}

        </div>
      </div>
      {expanded && (
        <div className="table-container">
          <table className="table is-stripped is-narrow is-hoverable">
            <tbody>
              {props.summoner.players.map((player, index) => (
                index < 5 &&
                <ExpandedMatchTable
                  player={{
                    game_duration: props.summoner.game_duration,
                    ...player,
                  }}
                  key={player.id + player.current_summoner_name}
                />
              ))}
            </tbody>
          </table>



          <div className="columns is-mobile is-size-5 has-text-centered my-3 has-text-white is-centered">

            <div className="column columns is-gapless is-centered mb-0 is-mobile is-narrow">
              {props.summoner.teams[0].bans && props.summoner.teams[0].bans.map((ban) => (
                <div className="column is-narrow" key={ban.name}>
                  <ChampionImage image={ban.image} key={ban.name} size={'is-24x24'} />
                </div>
              ))}
            </div>

            <p className="column is-narrow"><FontAwesomeIcon icon={faDragon} /> {props.summoner.teams[0].dragon_kills}</p>
            <p className="column is-narrow"><FontAwesomeIcon icon={faOtter} /> {props.summoner.teams[0].baron_kills}</p>
            <p className="column is-narrow"><FontAwesomeIcon icon={faChessRook} /> {props.summoner.teams[0].tower_kills}</p>

            <p className="column is-narrow">{`${props.summoner.teams[0].champion_kills} <=> ${props.summoner.teams[1].champion_kills} `}</p>
            
            <p className="column is-narrow"><FontAwesomeIcon icon={faDragon} /> {props.summoner.teams[1].dragon_kills}</p>
            <p className="column is-narrow"><FontAwesomeIcon icon={faOtter} /> {props.summoner.teams[1].baron_kills}</p>
            <p className="column is-narrow"><FontAwesomeIcon icon={faChessRook} /> {props.summoner.teams[1].tower_kills}</p>

            <div className="column columns is-gapless is-centered mb-0 is-mobile is-narrow">
              {props.summoner.teams[1].bans && props.summoner.teams[1].bans.map((ban) => (
                <div className="column is-narrow" key={ban.name}>
                  <ChampionImage image={ban.image} key={ban.name} size={'is-24x24'} />
                </div>
              ))}
            </div>
          </div>



          <table className="table is-stripped is-narrow is-hoverable">
            <tbody>
              {props.summoner.players.map((player, index) => (
                index >= 5 &&
                <ExpandedMatchTable
                  player={{
                    game_duration: props.summoner.game_duration,
                    ...player,
                  }}
                  key={player.id + player.current_summoner_name}
                />
              ))}
            </tbody>
          </table>

        </div>
      )}
    </>
  ):(<></>)
};
