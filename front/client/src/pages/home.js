import Search from '../components/searchDialog';
import Nav from '../components/nav'
import { useAuthentication} from '../components/authenticationContext';
import Footer from '../components/footer';



const Home = () => {
  const authenticated = useAuthentication(); 

  return (

    <div>
      <Nav page={'home'}/>
      {authenticated && <Search />}
      {/* <Footer/> */}
    </div>
  )
}

export default Home