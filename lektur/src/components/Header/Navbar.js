import { Dropdown } from "react-bootstrap";
import logo from "../../assests/logo.png";
// import user from '../../assests/user.png'
import search from "../../assests/icon-seacrh.png";

const Navbar = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container" style={{ maxWidth: "98%" }}>
          <a className="navbar-brand me-5" href="#">
            <img className="logo-nav" src={logo} alt="logo" />
          </a>
          <div className="navbar-search">
            <form className="form-search">
              <input className="form-control searching" type="search" placeholder="Search course or lecturer" />
              <button className="btn-search">
                <img src={search} alt="search" height="auto" width="auto" />
              </button>
            </form>
          </div>

          <div className="mx-auto"></div>

          <div className="navbar-categori">
            <Dropdown>
              <Dropdown.Toggle variant="none">Category</Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Business</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Technology</Dropdown.Item>
                <Dropdown.Item href="#/action-3">Graphic Desain</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="navbar-right">
            {/* NoLogin */}
            <ul className="navbar-nav no-login">
              <li className="nav-item">
                <a className="nav-link " href="#">
                  For Teacher
                </a>
              </li>
              <div className="garis my-auto"></div>
              <li className="nav-item">
                <a className="nav-link" href="#">
                  Login
                </a>
              </li>
              <button type="button" className="btn btn-signup">
                Sign Up
              </button>
            </ul>

            {/* IsLogin */}
            {/* <ul className="navbar-nav is-login">
                <div className="garis my-auto"></div>
                <li className="nav-item">
                 <img src={user} alt="user" height='40px'/> Jhon Dhoe
                </li>
               
              </ul> */}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;