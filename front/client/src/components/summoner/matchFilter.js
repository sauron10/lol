export const MatchFilter = (props) => {
  return (
    <>
      <div className="tabs is-centered m-5">
        <ul>
          <li className={props.selectedTab === 1 ? 'is-active':''} onClick={() => props.tab(() => 1)}><a>All</a></li>
          <li className={props.selectedTab === 400 ? 'is-active':''} onClick={() => props.tab(() => 400)}><a>Normal</a></li>
          <li className={props.selectedTab === 420 ? 'is-active':''} onClick={() => props.tab(() => 420)}><a >Ranked Solo</a></li>
          <li className={props.selectedTab === 440 ? 'is-active':''} onClick={() => props.tab(() => 440)}><a>Ranked Flex</a></li>
          <li className={props.selectedTab === 450 ? 'is-active':''} onClick={() => props.tab(() => 450)}><a>ARAM</a></li>
        </ul>
      </div>
    </>
  );
};
