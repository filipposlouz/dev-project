import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { deleteCookie } from "cookies-next";
import "./Navbar.css";
import Auth from "../Auth";

import Logo from "./devProjectLogo.png";

const Navbar = ({ callbackFunction }) => {
  const [clicked, setClicked] = useState(false);
  const [authenticate, setAuthenticate] = useState(false);
  const [role, setRole] = useState("basic");

  useEffect(() => {
    const checkAuth = async () => {
      await Auth.getUserState();
      setAuthenticate(Auth.isAuthenticated());
      if (Auth.isAuthenticated())
        await callbackFunction({
          role: Auth.getRole(),
          dept: Auth.getDepartment(),
        });
      setRole(Auth.getRole());
    };
    checkAuth();
  }, []);

  const handleClick = (e) => {
    e.preventDefault();
    setClicked(clicked ? false : true);
  };

  return (
    <nav className="NavbarItems">
      <div className="navbar-logo">
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
      </div>
      <a className="toggle-button" onClick={(e) => handleClick(e)}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </a>
      <ul className="nav-menu">
        {role === "basic" || role === null ? (
          ""
        ) : (
          <li>
            <Link
              to="/statistics"
              className={clicked ? `nav-links active` : `nav-links`}
            >
              Στατιστικά
            </Link>
          </li>
        )}

        <li>
          {authenticate ? SignOut(clicked, setAuthenticate) : SignIn(clicked)}
        </li>
      </ul>
    </nav>
  );
};

const SignIn = (clicked) => {
  return (
    <a
      href="http://localhost:5000/google"
      className={clicked ? `nav-links active` : `nav-links`}
    >
      Είσοδος
    </a>
  );
};

const SignOut = (clicked, setAuthenticate) => {
  const handleSignOut = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/logout", {
      method: "GET",
    }).then((res) => res.json());
    if (res.status === "success") {
      deleteCookie("sid");
      setAuthenticate(false);
      window.location.reload();
    }
  };
  return (
    <div className="dropdown">
      <a className={clicked ? `nav-links active` : `nav-links`}>
        {Auth.getEmail()}
      </a>
      <div className="dropdown-content">
        <a onClick={(e) => handleSignOut(e)} style={{ cursor: "pointer" }}>
          Έξοδος
        </a>
      </div>
    </div>
  );
};

export default Navbar;
