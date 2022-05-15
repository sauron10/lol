export const Rune = props => {
  return (
    <>
      <img
        className="is-rounded image is-32x32 "
        src={`${process.env.PUBLIC_URL}/${props.rune.image}`}
        alt="Rune"
      />
    </>
  );
}