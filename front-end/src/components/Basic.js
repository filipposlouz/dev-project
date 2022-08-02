import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import GetData from "./GetData";

const tableCellStyle = {
  fontWeight: "bold",
  fontSize: "large",
  padding: "1rem",
  borderBottom: "1px solid black",
};

const textFieldStyle = {
  width: "100%",
};

const Basic = ({ userRole }) => {
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
  const [rerender, setRerender] = useState(false);
  const [dataCheck, setDataCheck] = useState(true);

  const handleChangeClient = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setClient({ ...client, [name]: value });
  };

  const handleChangeCall = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (name === "files") {
      const fileValue = e.target.files[0];
      setSelectedFile(fileValue);
    } else {
      setCallInfo({ ...callInfo, [name]: value });
    }
  };

  const dataValidation = (dataToCheck) => {
    const checkDuration =
      /[0-9][0-9]:[0-9][0-9]:[0-9][0-9]/g.test(dataToCheck.callInfo.duration) ||
      /[0-9][0-9]:[0-9][0-9]/g.test(dataToCheck.callInfo.duration);
    const checkName = /\d/g.test(dataToCheck.client.name) === false;
    const checkEmail = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/g.test(
      dataToCheck.client.email
    );
    const checkPhone = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/g.test(
      dataToCheck.client.phone
    );
    if (checkDuration && checkName && checkEmail && checkPhone) return true;
    else return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalData = { client, callInfo };
    if (dataValidation(finalData)) {
      setDataCheck(true);
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
      setRerender(rerender ? false : true);
      setClient({
        clientName: "",
        phone: "",
        email: "",
        notes: "",
      });
      setCallInfo({
        duration: "",
        incoming: "",
        notes: "",
        files: undefined,
        calltype: "",
      });
    } else setDataCheck(false);
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
                  placeholder="HH:MM:SS"
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
          </TableBody>
        </Table>
      </TableContainer>
      {dataCheck ? (
        ""
      ) : (
        <Stack sx={{ width: "100%", marginTop: "1rem" }} spacing={2}>
          <Alert severity="error">Please insert correct data.</Alert>
        </Stack>
      )}
      <GetData rerenderVar={rerender} userRole={userRole} />
    </div>
  );
};

export default Basic;
