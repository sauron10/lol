// import { useContext } from "react";
import {
  useAuthentication,
  useAuthenticationUpdate,
} from "./authenticationContext";

import logo from '../page-assets/Logo_white.png'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthenticationModal } from "./authentication/authenticationModal";
import { SuccessModal } from "./authentication/succesModal";
import { LoginModal } from "./authentication/loginModal";
import axios from "axios";
import Cookies from "js-cookie";
import { vars } from "../page-assets/route";


const Nav = (props) => {
  const authenticated = useAuthentication();
  const toggleAuthentication = useAuthenticationUpdate();
  const [modalOpened, setModalOpened] = useState(false)
  const [loginOpened, setLoginOpened] = useState(false)
  const [success, setSuccess] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const axiosCall = async () => {
      const res = await axios.post(`${vars.route}/signin`, {
        username: Cookies.get('username'),
        token: Cookies.get('authToken')
      })
      return res
    }
    if (Cookies.get('authToken') && authenticated === false) {
      axiosCall().then(res => {
        if (res.data?.status === 200) toggleAuthentication()
      })
    }

  }, [authenticated, toggleAuthentication])

  const navigate = useNavigate();

  const logOut = () => {
    Cookies.remove('username', {
      expires: 60 * 60,
      sameSite: 'lax',
      path: '/'
    })
    Cookies.remove('authToken', {
      expires: 60 * 60,
      sameSite: 'lax',
      path: '/'
    })
    toggleAuthentication()
    if (props.page !== 'home') navigate('/')

  }

  const handleChange = e => {
    setSearch(e.target.value)
  }

  const handleSubmit = e => {
    try {
      e.preventDefault()
      navigate(`/summoner/${search}`);
      // window.location.reload();
    } catch (e) {
      console.log(e);
    }
  }

  // console.log(authenticated);
  return (
    <div className="columns is-mobile is-centered m-0 p-0 is-vcentered">
      {/* Logo */}
      <div className="column p-0 m-3">
        <div className="image clickable logo" onClick={() => navigate('/')}>
          <img
            src={logo}
            alt="logo"
          />
        </div>
      </div>
      {/* Search */}
      <div className="column is-narrow p-0 mr-4">
        {props.page !== 'home' &&
          <form className="form" onSubmit={handleSubmit}>
            <div className="field navbar-input has-addons">
              <input className="input" type='text' onChange={handleChange} value={search} placeholder='Summoner'></input>
            </div>
          </form>}
      </div>
      {/* Sign up button */}
      {vars.route !== '' && !authenticated &&
      <div className="column is-narrow p-0">
        
          <button className="button main-color"
            onClick={() => {
              setModalOpened(prevMod => !prevMod)
            }}>
            <strong>Sign up</strong>
          </button>
          
      </div>}
      {/* Sign in button */}
      <div className="column is-narrow mx-3 p-0">
        {!authenticated &&
          <button className="button is-info"
            onClick={() => setLoginOpened(prevLog => !prevLog)}
          >
            Login
          </button>}
        {authenticated &&
          <button className="button is-danger"
            onClick={logOut}
          >
            Logout
          </button>}
      </div>
      {/* Modals */}
      {modalOpened &&
        <AuthenticationModal setModalOpened={setModalOpened} setSuccess={setSuccess} setCookie={Cookies.set} />}
      {success &&
        <SuccessModal setSuccess={setSuccess} />}
      {loginOpened &&
        <LoginModal setLoginOpened={setLoginOpened} toggleAuthentication={toggleAuthentication} setCookie={Cookies.set} />}
    </div>

  )
}





















// <nav className="navbar" role="navigation" aria-label="main navigation">

//   <div className="navbar-brand">
//     <div className="image is-64x64 clickable" onClick={() => navigate('/')}>
//       <img
//         src={logo}
//         alt="logo"
//       />
//     </div>
//   </div>

//   <div className="navbar-menu is-active">
//     <div className="navbar-end">
//       <div className="navbar-item">
//         <div className="buttons">
//           {props.page !== 'home' &&
//             <form className="form" onSubmit={handleSubmit}>
//               <div className="field navbar-input has-addons mx-5 mb-0">
//                 <input className="input" type='text' onChange={handleChange} value={search} placeholder='Summoner'></input>
//               </div>
//             </form>}
//           {vars.route !== '' && !authenticated &&
//             (<button className="button main-color"
//               onClick={() => {
//                 setModalOpened(prevMod => !prevMod)
//               }}>
//               <strong>Sign up</strong>
//             </button>
//             )}
//           {!authenticated &&
//             <button className="button is-light"
//               onClick={() => setLoginOpened(prevLog => !prevLog)}
//             >
//               Login
//             </button>}
//           {authenticated &&
//             <button className="button is-light"
//               onClick={logOut}
//             >
//               Logout
//             </button>}
//         </div>
//       </div>
//     </div>
//     {modalOpened &&
//       <AuthenticationModal setModalOpened={setModalOpened} setSuccess={setSuccess} setCookie={Cookies.set} />}
//     {success &&
//       <SuccessModal setSuccess={setSuccess} />}
//     {loginOpened &&
//       <LoginModal setLoginOpened={setLoginOpened} toggleAuthentication={toggleAuthentication} setCookie={Cookies.set} />
//     }
//   </div>
// </nav>


export default Nav;
