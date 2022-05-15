export const Achievement = (props) => {
  return (
    <>
      <div className="container has-text-centered has-text-light">
        <div className="image is-96x96 is-inline-block mt-4">
          <img
            className="is-rounded"
            src={`${process.env.PUBLIC_URL}/img/mission/aprilfools2019_cat-icon.png`}
            alt="ProfileIcon"
          />
        </div>
        <p className="title is-size-4 has-text-light mb-1">
          Filler title
        </p>
        <p>Filler text</p>
        <p>Filler text</p>
      </div>
    </>
  );
};
