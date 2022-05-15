// import logo from './logo.svg';
import { createContext, useContext } from 'react';
import './App.css'
import './components/searchDialog'
import 'bulma/css/bulma.css'
import { AuthenticationProvider } from './components/authenticationContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/home'
import Summoner from './pages/summoner'



const App = () => {
  return (

    
    <AuthenticationProvider>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/summoner/:summonerName' element={<Summoner />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthenticationProvider>
   
    )
}

export default App;
