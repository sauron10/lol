export const Spell = (props) => {
  return (
    <>
      <img
        className="is-rounded image is-32x32"
        src={`${process.env.PUBLIC_URL}/img/spell/${props.spell.image}`}
        alt="Summoner spell"
      />
    </>
  );
};
