export const MatchFilter = (props) => {
  
  return (
    <>
      <div className="tabs is-centered m-5">
        <ul>
          <li className={props.selectedTab === 1 ? 'is-active':''} onClick={() => {props.setSelectedTab(() => 1);props.setIndex(10)}}><a>All</a></li>
          <li className={props.selectedTab === 400 ? 'is-active':''} onClick={() => {props.setSelectedTab(() => 400);props.setIndex(10)}}><a>Normal</a></li>
          <li className={props.selectedTab === 420 ? 'is-active':''} onClick={() => {props.setSelectedTab(() => 420);props.setIndex(10)}}><a>Ranked Solo</a></li>
          <li className={props.selectedTab === 440 ? 'is-active':''} onClick={() => {props.setSelectedTab(() => 440);props.setIndex(10)}}><a>Ranked Flex</a></li>
          <li className={props.selectedTab === 450 ? 'is-active':''} onClick={() => {props.setSelectedTab(() => 450);props.setIndex(10)}}><a>ARAM</a></li>
        </ul>
      </div>
    </>
  );
};
