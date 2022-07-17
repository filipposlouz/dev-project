import React, { useState } from "react";
import Auth from "./Auth";

const Home = ({ userState }) => {
  return <div>{userState === "basic" ? <Basic /> : <Admin />};</div>;
};

const Basic = () => {
  const [client, setClient] = useState({
    clientName: "",
    phone: "",
    email: "",
    notes: "",
  });
  return <h1>basic</h1>;
};

const Admin = () => {
  return <h1>admin</h1>;
};

export default Home;
