import './App.css'
import './components/searchDialog'
import 'bulma/css/bulma.css'
import { AuthenticationProvider } from './components/authenticationContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home'
import { Auth } from './pages/auth';



const App = () => {

  return (
    <AuthenticationProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/summoner/:summonerName' element={<Auth page={'summoner'} />} />
            <Route path='/champions/' element={<Auth page={'champions'}/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </AuthenticationProvider>
   
    )
}

export default App;
