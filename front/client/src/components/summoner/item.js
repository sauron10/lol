export const Item = (props) => {
  return (
    <>
      <div className="column is-one-quarter p-0 m-0 is-16x16">
        <figure className="image is-32x32">
          <img
            src={`${process.env.PUBLIC_URL}/img/item/${props.item.image}`}
            alt="Item"
          />
        </figure>
      </div>
    </>
  );
};
