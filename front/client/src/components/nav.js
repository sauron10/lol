// import { useContext } from "react";
import {
  useAuthentication,
  useAuthenticationUpdate,
} from "./authenticationContext";

const Nav = () => {
  const authenticated = useAuthentication();
  const toggleAuthentication = useAuthenticationUpdate();
  // console.log(authenticated);
  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img
            src="https://bulma.io/images/bulma-logo.png"
            width="112"
            height="28"
            alt="logo"
          />
        </a>

        <button
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {!authenticated && (
                <button className="button is-primary">
                  <strong>Sign up</strong>
                </button>
              )}
              <button className="button is-light" onClick={toggleAuthentication}>
                {!authenticated ? "Log in" : "Log out"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
