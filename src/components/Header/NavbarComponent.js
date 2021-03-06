import { useState, useEffect } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../assests/logo.png";
import { getSearchCourse } from "../../redux/actions/Courses/getSearchCourseAction";
import logOut from "../../assests/logOut.png";
import { userLogOut } from "../../redux/actions/User/userAuthAction";
import { getUserProfileAction } from "../../redux/actions/User/getUserProfileAction";
import { getCoursesAction } from "../../redux/actions/Courses/getCoursesAction";
import LoaderSecond from "../Loader/LoaderSecond";

const NavbarComponent = () => {
  const { courseList } = useSelector((state) => state.courses);
  const { user, isLoading } = useSelector((state) => state.userProfile);
  const { users } = useSelector((state) => state.userAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  //get token
  let token = localStorage.getItem("token");
  let tokenGoogle = localStorage.getItem("loginGoogle");
  let tokenFb = localStorage.getItem("loginFacebook");
  let isToken = token || tokenGoogle || tokenFb;
  useEffect(() => {
    if (isToken !== null) {
      dispatch(getUserProfileAction(isToken));
    }
  }, [dispatch]);

  //getCategory
  useEffect(() => {
    dispatch(getCoursesAction());
  }, [dispatch]);

  const submitSearchText = (e) => {
    e.preventDefault();
    if (searchText !== "") {
      dispatch(getSearchCourse(searchText));
      navigate("/search/" + searchText);
    }
  };

  // Category
  const uniqCategory = [];
  courseList.filter((course) => {
    if (!uniqCategory.includes(course.category.name)) {
      uniqCategory.push(course.category.name);
    }
  });
  // button logout
  const handleLogOut = (evt) => {
    evt.preventDefault();
    dispatch(userLogOut());
    navigate("/");
  };
  return (
    <Navbar bg="white" expand="lg" className="navbar">
      <Container fluid>
        <Navbar.Brand href="/">
          <img src={logo} alt="logo" className="logo-navbar" />
        </Navbar.Brand>

        <form className="input-group wrapper-search" onSubmit={submitSearchText}>
          <input className="form-control border-end-0 border" type="search" value={searchText} placeholder="Search course or lecturer" onChange={(evt) => setSearchText(evt.target.value)} />
          <span className="input-group-append">
            <button className="btn btn-searching border-start-0 border ms-n5" type="button">
              <i className="fa fa-search" onClick={submitSearchText}></i>
            </button>
          </span>
        </form>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto navbar-right">
            <form className="input-group wrapper-search mobile" onSubmit={submitSearchText}>
              <input className="form-control border-end-0 border" type="search" value={searchText} placeholder="Search course or lecturer" onChange={(evt) => setSearchText(evt.target.value)} />
              <span className="input-group-append">
                <button className="btn btn-searching border-start-0 border ms-n5" type="button">
                  <i className="fa fa-search" onClick={submitSearchText}></i>
                </button>
              </span>
            </form>
            <NavDropdown title="Category" id="basic-nav-dropdown">
              {uniqCategory.map((category, index) => (
                <NavDropdown.Item href={"/categories/" + category} key={index}>
                  {category}
                </NavDropdown.Item>
              ))}
            </NavDropdown>

            {isToken !== null ? (
              <>
                {isLoading ? (
                  <div className="loading-nav">
                    <LoaderSecond />
                  </div>
                ) : (
                  <>
                    {/* IsLogin */}
                    <div className="garis"></div>
                    <img className="shadow" src={users?.image || user?.image} alt="image-user" height="40px" width="40px" style={{ borderRadius: "50%" }} />
                    <NavDropdown title={users?.fullName || user?.fullName} id="basic-nav-dropdown">
                      <NavDropdown.Item href="/student-dashboard">Dashboard</NavDropdown.Item>
                      <NavDropdown.Divider />
                      <button className="nav-btn-logout ms-2" type="button" onClick={handleLogOut}>
                        <img src={logOut} alt="logOut" className="me-2" />
                        Log Out
                      </button>
                    </NavDropdown>
                  </>
                )}
              </>
            ) : (
              <>
                {/* NotLogin */}
                <Nav.Link href="/">For Teacher</Nav.Link>
                <div className="garis"></div>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link className="nav-btn-signup" href="/register">
                  Sign Up
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
