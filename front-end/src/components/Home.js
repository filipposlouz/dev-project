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
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Paper from "@mui/material/Paper";

import "./Home.css";
import GetData from "./GetData";

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
  borderBottom: "1px solid black",
};

// const textFieldCellStyle = {
//   borderBottom: "2px solid white",
// };

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
    incoming: "",
    notes: "",
    files: undefined,
    calltype: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [counter, setCounter] = useState(1);

  const handleChangeClient = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setClient({ ...client, [name]: value });
  };

  const handleChangeCall = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(callInfo);
    if (name === "files") {
      const fileValue = e.target.files[0];
      setSelectedFile(fileValue);
    } else {
      if (name === "duration") {
        handleChangeTime(e, value);
      } else setCallInfo({ ...callInfo, [name]: value });
    }
  };

  const handleChangeTime = (e, value) => {
    setCounter(counter + 1);
    if (counter === 2 && callInfo.duration.length < 6) {
      setCallInfo({ ...callInfo, duration: value + ":" });
      setCounter(1);
    } else {
      setCallInfo({ ...callInfo, duration: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = { client, callInfo };
    const response = await fetch("http://localhost:5000/api/addCall", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(finalData),
    }).then((res) => res.json());
    const formData = new FormData();
    formData.append("File", selectedFile);
    const sendFiles = await fetch("http://localhost:5000/api/uploadFiles", {
      method: "POST",
      credentials: "include",
      body: formData,
    }).then((res) => res.json());
  };

  return (
    <div>
      <TableContainer
        className="table-container"
        style={{ backgroundColor: "#FEFCFF" }}
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={tableCellStyle}>Client:</TableCell>
              <TableCell style={tableCellStyle}></TableCell>
              <TableCell style={tableCellStyle}></TableCell>
              <TableCell style={tableCellStyle}></TableCell>
              <TableCell style={tableCellStyle}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>
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
                  label="Phone Number"
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
            </TableRow>
            <TableRow>
              <TableCell colSpan={4}>
                <TextField
                  type="text"
                  variant="standard"
                  id="notes"
                  name="notes"
                  label="Relevant Notes"
                  value={client.notes}
                  onChange={handleChangeClient}
                  style={textFieldStyle}
                />
              </TableCell>
            </TableRow>
          </TableBody>
          <TableHead>
            <TableRow>
              <TableCell style={tableCellStyle}>Phone Call:</TableCell>
              <TableCell style={tableCellStyle}></TableCell>
              <TableCell style={tableCellStyle}></TableCell>
              <TableCell style={tableCellStyle}></TableCell>
              <TableCell style={tableCellStyle}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <TextField
                  type="text"
                  variant="standard"
                  id="duration"
                  name="duration"
                  label="Call Duration"
                  value={callInfo.duration}
                  onChange={handleChangeCall}
                  style={textFieldStyle}
                />
              </TableCell>
              <TableCell>
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="standard-label">Type of call</InputLabel>
                  <Select
                    id="standard"
                    name="incoming"
                    value={callInfo.incoming}
                    onChange={handleChangeCall}
                    label="Type of call"
                  >
                    <MenuItem value="" disabled>
                      None
                    </MenuItem>
                    <MenuItem value={true}>Incoming</MenuItem>
                    <MenuItem value={false}>Outgoing</MenuItem>
                  </Select>
                </FormControl>
              </TableCell>
              <TableCell>
                <TextField
                  type="text"
                  variant="standard"
                  id="calltype"
                  name="calltype"
                  label="Purpose of Call"
                  value={callInfo.calltype}
                  onChange={handleChangeCall}
                  style={textFieldStyle}
                />
              </TableCell>
              <TableCell>
                <input
                  type="file"
                  variant="standard"
                  id="files"
                  name="files"
                  label="Files"
                  // value={callInfo.files}
                  onChange={handleChangeCall}
                  // ref={selectedFile}
                  style={textFieldStyle}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3}>
                <TextField
                  type="text"
                  variant="standard"
                  id="notes"
                  name="notes"
                  label="Relevant Notes"
                  value={callInfo.notes}
                  onChange={handleChangeCall}
                  style={textFieldStyle}
                />
              </TableCell>
              <TableCell className="submit-button">
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: "100%" }}
                  onClick={handleSubmit}
                >
                  Add
                </Button>
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
        </Table>
      </TableContainer>
      <GetData />
    </div>
  );
};

const Admin = () => {
  return <h1>admin</h1>;
};

export default Home;
