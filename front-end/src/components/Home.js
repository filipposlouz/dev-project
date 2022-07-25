import React, { useEffect, useState } from "react";
import CheckDept from "./Modal";
import { getCookies, getCookie, setCookie, deleteCookie } from "cookies-next";

import "./Home.css";
import Admin from "./Admin";
import Basic from "./Basic";

const Home = ({ userState }) => {
  const [cookie, setCookie] = useState(null);
  useEffect(() => {
    setCookie(getCookie("sid"));
    console.log(getCookie("sid"));
  }, []);
  return (
    <div className="main-container">
      <div className="table-outside-container">
        <CheckDept deptState={userState.dept} userRole={userState.role} />
        {cookie !== null && cookie !== undefined ? (
          <>{userState.role === "basic" ? <Basic /> : <Admin />}</>
        ) : (
          <h1>Please Sign in to continue...</h1>
        )}
      </div>
    </div>
  );
};

export default Home;
