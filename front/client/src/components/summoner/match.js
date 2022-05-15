import { Spell } from "./spell";
import { Rune } from "./rune";
import { Item } from "./item";
import { Player } from "./player";
import { ExpandedMatchTable } from "./expandedMatchTable";
import { useState } from "react";
import { isMainRune } from "./helperFunc";

export const Match = (props) => {
  const [expanded, setExpanded] = useState(false);

  const handleMatchClick = () => {
    setExpanded((prev) => !prev);
  };

  const pair = (arr) => {
    var newArr = [];
    var start = 0;
    var end = 1;
    while (end < arr.length) {
      newArr.push([arr[start], arr[end]]);
      start += 2;
      end += 2;
    }

    return newArr;
  };

  return (
    <>
      <div
        className="container has-text-centered px-1 is-max-desktop"
        onClick={handleMatchClick}
      >
        <div className="columns my-3 has-text-light is-mobile">
          {/* Champion image*/}
          <div className="column is-narrow pt-5 pr-0">
            <figure className="image is-48x48">
              <img
                className="is-rounded"
                src={`${process.env.PUBLIC_URL}/img/champion/${props.summoner.image}`}
                alt="Champion"
              />
            </figure>
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
          <div className="column">
            <div className="columns is-multiline is-gapless mt-3 is-mobile">
              {props.summoner.items.map((item) => (
                <Item item={item} key={item.id} />
              ))}
            </div>
          </div>
          {/* Farm */}
          <div className="column is-narrow pt-5">
            <p>CS</p>
            <p>{props.summoner.neutral_minions_killed}</p>
          </div>
          {/* Kill participation */}
          <div className="column is-narrow pt-5">
            <p>KP</p>
            <p></p>
          </div>
          {/* Players */}
          <div className="column is-hidden-mobile is-hidden-touch">
            <div className="columns is-multiline is-gapless has-text-light is-mobile">
              {pair(props.summoner.players).map((playerPair) => (
                <Player playerPair={playerPair} key={playerPair[0].id} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {expanded && <div className="table-container">
        <table className="table is-stripped is-narrow">
          <tbody>
            {props.summoner.players.map(
              (player) =>
                (
                  <ExpandedMatchTable
                    player={{
                      game_duration: props.summoner.game_duration,
                      ...player,
                    }}
                    key={player.id}
                  />
                )
            )}
          </tbody>
        </table>
      </div>}
    </>
  );
};
