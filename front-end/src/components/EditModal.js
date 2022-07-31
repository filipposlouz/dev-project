import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import RetrieveFiles from "./RetrieveFiles";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  outline: 0,
};

const tableCellStyle = {
  fontWeight: "bold",
  fontSize: "large",
  padding: "1rem",
  borderBottom: "1px solid black",
};

const textFieldStyle = {
  width: "100%",
};

const EditModal = ({ phoneCall, setShowModal, rerenderFunction, userRole }) => {
  const [open, setOpen] = React.useState(true);

  const [client, setClient] = useState({
    clientName: phoneCall.clientData.client_name,
    phone: phoneCall.clientData.phone,
    email: phoneCall.clientData.email,
    notes: phoneCall.clientData.notes,
  });
  const [callInfo, setCallInfo] = useState({
    duration: phoneCall.duration,
    incoming: phoneCall.incoming,
    notes: phoneCall.notes,
    files: phoneCall.files,
    calltype: phoneCall.calltype,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [counter, setCounter] = useState(0);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setShowModal(false);
  };

  const handleChangeClient = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setClient({ ...client, [name]: value });
  };

  const handleChangeCall = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    // console.log(callInfo);
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
    setShowModal(false);
    handleClose();
    const finalData = {
      id: phoneCall.id,
      emp_id: phoneCall.emp_id,
      client_id: phoneCall.client_id,
      ...callInfo,
      clientData: {
        department_id: phoneCall.clientData.department_id,
        id: phoneCall.clientData.id,
        ...client,
      },
    };
    console.log(finalData);
    const res = await fetch(
      `http://localhost:5000/api/${userRole}/updateInfo`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalData),
      }
    ).then((res) => res.json());
    if (selectedFile) {
      const formData = new FormData();
      formData.append("File", selectedFile);
      const updateFile = await fetch(
        `http://localhost:5000/api/updateFile/${finalData.id}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      ).then((res) => res.json());
    }
    console.log(res);
    rerenderFunction();
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Information:
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
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
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                      >
                        <InputLabel id="standard-label">
                          Type of call
                        </InputLabel>
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
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <label htmlFor={phoneCall.id}>Current File:</label>
                        <RetrieveFiles
                          id={phoneCall.id}
                          fileIsNotNull={phoneCall.files}
                        />
                      </div>
                      <input
                        type="file"
                        variant="standard"
                        id="files"
                        name="files"
                        label="Files"
                        onChange={handleChangeCall}
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
                        Submit
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default EditModal;
