import { Spell } from "./spell";
import { Rune } from "./rune";
import { isMainRune } from "./helperFunc";
import { Item } from "./item";

export const ExpandedMatch = (props) => {
  return (
    <>
      <div className="columns is-mobile">
        {/* First column */}
        <div className="column is-narrow">
          <figure className="image is-48x48">
            <img
              className="is-rounded"
              src={`${process.env.PUBLIC_URL}/img/champion/${props.player.image}`}
              alt="Champion"
            />
          </figure>
        </div>
        {/* Second columns */}
        <div className="column image is-rounded is-narrow">
          {props.player.summoners.map((spell) => (
            <Spell spell={spell} />
          ))}
        </div>
        {/* Second columns */}
        <div className="column image is-rounded is-narrow">
          {props.player.runes.map(
            (rune) => isMainRune(rune.id) && <Rune rune={rune} />
          )}
        </div>
        {/* Third column */}
        <div className="column is-size-6">
          <p >{props.player.current_summoner_name}</p>
        </div>
        {/* Column */}
        <div className="column is-narrow ">
          <div className="has-text-centered">
            <p>{`${props.player.kills}/${props.player.deaths}/${props.player.assists}`}</p>
            <p>
              {(
                (props.player.kills + props.player.assists) /
                props.player.deaths
              ).toFixed(1)}
            </p>
          </div>
        </div>
        {/* Column */}
        <div className="column">
          <div className="columns is-mobile is-multiline">
            {props.player.items.map((item) => (
              <Item item={item} />
            ))}
          </div>
        </div>
        {/*  */}
        <div className="column is-mobile is-size-7">
          <div>
            <p>
              cs:{props.player.neutral_minions_killed} (
              {(
                props.player.neutral_minions_killed /
                (props.player.game_duration / 1000 / 60)
              ).toFixed(1)}
              )
            </p>
            <p>gold:{props.player.gold_earned}</p>
            <p>damage:{props.player.total_damage_dealt_champs}</p>
          </div>
        </div>
      </div>
    </>
  );
};
