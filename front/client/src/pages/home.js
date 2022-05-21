import Search from '../components/searchDialog';
import Nav from '../components/nav'
import { useWindowDimensions } from '../customHooks/window';

const Home = () => {
  const {height,width} = useWindowDimensions()

  return (
    <div>
      <p>{`${height}/${width}`}</p>
      <Nav />
      <Search />
    </div>
  )
}

export default Home