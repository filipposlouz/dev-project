import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Home from "./components/Home";
import "./App.css";

function App() {
  const [userState, setUserState] = useState({ role: "basic", dept: true });
  const callbackFunction = (data) => {
    setUserState(data);
  };
  return (
    <div className="App">
      <Router>
        <Navbar callbackFunction={callbackFunction} />
        <Routes>
          <Route exact path="/" element={<Home userState={userState} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
