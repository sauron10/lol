import { Spell } from "./spell";
import { Rune } from "./rune";
import { isMainRune } from "./helperFunc";
import { Item } from "./item";

export const ExpandedMatchTable = (props) => {
  const handleColor = () => {
    const className = props.player.win ? 'win-row' : 'lose-row'
    return className
  }

  const className = props.player.win ? 'win-row' : 'lose-row'
  return (
    <>
      <tr className={className}>
        <td>
          <div className="image is-48x48">
            <img
              className="is-rounded"
              src={`${process.env.PUBLIC_URL}/img/champion/${props.player.image}`}
              alt="Champion"
            />
          </div>
        </td>
        <td className="is-hidden-mobile">
          <figure className="image is-rounded is-mobile">
            {props.player.summoners.map((spell) => (
              <Spell spell={spell} key={spell.id} />
            ))}
          </figure>
        </td>
        <td className="is-hidden-mobile">
          <div className="image is-rounded">
            {props.player.runes.map(
              (rune) =>
                isMainRune(rune.id) && <Rune rune={rune} key={rune.id} />
            )}
          </div>
        </td>
        <td>
          <div className="is-size-6">
            <a href={`/summoner/${props.player.current_summoner_name}`}>{props.player.current_summoner_name}</a>
          </div>
        </td>
        <td>
          <div className="has-text-centered">
            <p>{`${props.player.kills}/${props.player.deaths}/${props.player.assists}`}</p>
            <p>
              {(
                (props.player.kills + props.player.assists) /
                props.player.deaths
              ).toFixed(1)}
            </p>
          </div>
        </td>
        <td>
          <div className="columns is-gapless is-mobile is-multiline">
            {props.player.items.map((item) => (
              <Item item={item} key={item.id} />
            ))}
          </div>
        </td>
        <td>
          <div className="is-size-7">
            <p>
              cs:{props.player.minions_killed} (
              {(
                props.player.minions_killed /
                (props.player.game_duration / 60)
              ).toFixed(1)}
              )
            </p>
            <p>gold:{props.player.gold_earned}</p>
            <p>damage:{props.player.total_damage_dealt_champs}</p>
          </div>
        </td>
      </tr>
    </>
  );
};