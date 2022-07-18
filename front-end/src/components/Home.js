import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import CheckDept from "./Modal";

import "./Home.css";

const Home = ({ userState }) => {
  return (
    <div className="main-container">
      <div className="table-outside-container">
        <CheckDept deptState={userState.dept} />
        {userState.role === "basic" ? <Basic /> : <Admin />}
      </div>
    </div>
  );
};

const tableCellStyle = {
  fontWeight: "bold",
  fontSize: "large",
  padding: "1rem",
};

const textFieldStyle = {
  width: "100%",
};

const Basic = () => {
  const [client, setClient] = useState({
    clientName: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [callInfo, setCallInfo] = useState({
    duration: "",
    incoming: false,
    notes: "",
    files: "",
    calltype: "",
  });

  const handleChangeClient = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setClient({ ...client, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("hi");
  };

  return (
    <div>
      <TableContainer className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={tableCellStyle}>Client:</TableCell>
              <TableCell style={tableCellStyle}></TableCell>
              <TableCell style={tableCellStyle}></TableCell>
              <TableCell style={tableCellStyle}></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <TextField
                  type="text"
                  variant="standard"
                  id="clientName"
                  name="clientName"
                  label="Client Name"
                  value={client.clientName}
                  onChange={handleChangeClient}
                  style={textFieldStyle}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="text"
                  variant="standard"
                  id="phone"
                  name="phone"
                  label="Phone"
                  value={client.phone}
                  onChange={handleChangeClient}
                  style={textFieldStyle}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="email"
                  variant="standard"
                  id="email"
                  name="email"
                  label="Email"
                  value={client.email}
                  onChange={handleChangeClient}
                  style={textFieldStyle}
                />
              </TableCell>
              <TableCell>
                <TextField
                  type="text"
                  variant="standard"
                  id="notes"
                  name="notes"
                  label="Notes"
                  value={client.notes}
                  onChange={handleChangeClient}
                  style={textFieldStyle}
                />
              </TableCell>
              <TableCell>
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Add
                </Button> */}
              </TableCell>
            </TableRow>
            {/* {employees.map((employee, index) => {
              let { first_name, last_name, afm, date_of_birth } = employee;
              return (
                <TableRow key={index}>
                  <TableCell>{first_name}</TableCell>
                  <TableCell>{last_name}</TableCell>
                  <TableCell>{afm}</TableCell>
                  <TableCell>{date_of_birth}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              );
            })} */}
          </TableBody>
          <TableHead>
            <TableRow>
              <TableCell style={tableCellStyle}>Phone Call:</TableCell>
              <TableCell style={tableCellStyle}></TableCell>
              <TableCell style={tableCellStyle}></TableCell>
              <TableCell style={tableCellStyle}></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </div>
  );
};

const Admin = () => {
  return <h1>admin</h1>;
};

export default Home;
