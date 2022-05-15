import { useContext } from "react";
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
        <a className="navbar-item" href="https://bulma.io">
          <img
            src="https://bulma.io/images/bulma-logo.png"
            width="112"
            height="28"
          />
        </a>

        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
              {!authenticated && (
                <a className="button is-primary">
                  <strong>Sign up</strong>
                </a>
              )}
              <a className="button is-light" onClick={toggleAuthentication}>
                {!authenticated ? "Log in" : "Log out"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
