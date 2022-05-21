import { Spell } from "./spell";
import { Rune } from "./rune";
import { Item } from "./item";
import { Player } from "./player";
import { ExpandedMatchTable } from "./expandedMatchTable";
import { useState, useEffect } from "react";
import { isMainRune } from "./helperFunc";

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


  return (
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
            {props.summoner.summoner_spells.map((spell) => (
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
              {props.summoner.items.map((item) => (
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
            <p>{props.position}</p>
          </div>
          {/* Players */}
          {(isInsideRange(5000, 930) || isInsideRange(769, 600)) && <div className="column">
            <div className="columns is-multiline is-gapless has-text-light is-mobile">
              {pair(props.summoner.players).map((playerPair) => (
                <Player playerPair={playerPair} key={playerPair[0].id} />
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
                  key={player.id}
                />
              ))}
            </tbody>
          </table>
          <table className="table is-stripped is-narrow is-hoverable">
            <tbody>
              {props.summoner.players.map((player, index) => (
                index >= 5 &&
                <ExpandedMatchTable
                  player={{
                    game_duration: props.summoner.game_duration,
                    ...player,
                  }}
                  key={player.id}
                />
              ))}
            </tbody>
          </table>

        </div>
      )}
    </>
  );
};
