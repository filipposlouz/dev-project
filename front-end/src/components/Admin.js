import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import RetrieveFiles from "./RetrieveFiles";
import EditButton from "./EditButton";
import DelButton from "./DelButton";

const tableCellStyle = {
  fontWeight: "bold",
  fontSize: "large",
  //   padding: "1rem",
  borderBottom: "1px solid black",
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#899499",
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const NeutralItem = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const Admin = ({ userRole }) => {
  const [user, setUser] = useState("all");
  const [userData, setUserData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getAllUsers();
    getUserData("all");
  }, []);

  const handleChange = async (e) => {
    e.preventDefault();
    await getUserData(e.target.value);
    setUser(e.target.value);
  };

  const getUserData = async (user) => {
    const res = await fetch(
      `http://localhost:5000/api/admin/getUserData/${user}`,
      {
        method: "GET",
        credentials: "include",
      }
    ).then((res) => res.json());
    setUserData(res);
  };

  const getAllUsers = async () => {
    const res = await fetch("http://localhost:5000/api/admin/getAllUsers", {
      method: "GET",
      credentials: "include",
    }).then((res) => res.json());
    setAllUsers(res);
  };

  const rerenderFunction = () => {
    getUserData(user);
  };

  return (
    <div style={{ width: "80%" }}>
      <Box sx={{ flexGrow: 1, width: "100%" }}>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <NeutralItem>
              <Box>
                <FormControl fullWidth>
                  <InputLabel>User:</InputLabel>
                  <Select
                    id="select"
                    value={user}
                    label="User"
                    onChange={handleChange}
                  >
                    <MenuItem value={"all"} selected>
                      All Users
                    </MenuItem>
                    {allUsers.map((elem, index) => {
                      return (
                        <MenuItem value={elem.id} key={index}>
                          {elem.emp_name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </NeutralItem>
          </Grid>
          <Grid item xs={9}>
            <Item>
              {user === "" ? "Please pick an option on the left." : ""}
              {user === "all" ? (
                <>
                  {userData.map((outer_elem, index) => {
                    if (outer_elem.phoneCalls === undefined) {
                      return;
                    }
                    return (
                      <div style={{ marginTop: "1rem" }} key={index}>
                        <h2>
                          {outer_elem.phoneCalls === undefined
                            ? ""
                            : outer_elem.emp_name}
                        </h2>
                        {outer_elem.phoneCalls.map((elem, index) => {
                          return (
                            <div style={{ marginTop: "1rem" }} key={index}>
                              <TableContainer
                                style={{ backgroundColor: "#FEFCFF" }}
                                component={Paper}
                              >
                                <Table>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell style={tableCellStyle}>
                                        Client Name:
                                      </TableCell>
                                      <TableCell style={tableCellStyle}>
                                        Phone:
                                      </TableCell>
                                      <TableCell style={tableCellStyle}>
                                        Email:
                                      </TableCell>
                                      <TableCell style={tableCellStyle}>
                                        <EditButton
                                          phoneCall={elem}
                                          rerenderFunction={rerenderFunction}
                                          userRole={userRole}
                                        />
                                      </TableCell>
                                      <TableCell style={tableCellStyle}>
                                        <DelButton
                                          phoneCallId={elem.id}
                                          rerenderFunction={rerenderFunction}
                                          userRole={userRole}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell>
                                        {elem.clientData === undefined
                                          ? ""
                                          : elem.clientData.client_name}
                                      </TableCell>
                                      <TableCell>
                                        {elem.clientData === undefined
                                          ? ""
                                          : elem.clientData.phone}
                                      </TableCell>
                                      <TableCell>
                                        {elem.clientData === undefined
                                          ? ""
                                          : elem.clientData.email}
                                      </TableCell>
                                      <TableCell></TableCell>
                                      <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "large",
                                        }}
                                      >
                                        Relevant Notes:
                                      </TableCell>
                                      <TableCell colSpan={4}>
                                        {elem.clientData === undefined
                                          ? ""
                                          : elem.clientData.notes}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell style={tableCellStyle}>
                                        Phone Call Duration:
                                      </TableCell>
                                      <TableCell style={tableCellStyle}>
                                        Incoming:
                                      </TableCell>
                                      <TableCell style={tableCellStyle}>
                                        Purpose:
                                      </TableCell>
                                      <TableCell style={tableCellStyle}>
                                        Files:
                                      </TableCell>
                                      <TableCell
                                        style={tableCellStyle}
                                      ></TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    <TableRow>
                                      <TableCell>{elem.duration}</TableCell>
                                      <TableCell>
                                        {elem.incoming
                                          ? "Incoming"
                                          : "Outgoing"}
                                      </TableCell>
                                      <TableCell>{elem.calltype}</TableCell>
                                      <TableCell>
                                        <RetrieveFiles
                                          id={elem.id}
                                          fileIsNotNull={elem.files}
                                        />
                                      </TableCell>
                                      <TableCell></TableCell>
                                    </TableRow>
                                    <TableRow>
                                      <TableCell
                                        style={{
                                          fontWeight: "bold",
                                          fontSize: "large",
                                        }}
                                      >
                                        Relevant Notes:
                                      </TableCell>
                                      <TableCell colSpan={4}>
                                        {elem.notes}
                                      </TableCell>
                                    </TableRow>
                                  </TableBody>
                                </Table>
                              </TableContainer>
                              &nbsp;
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              ) : (
                <>
                  {userData.map((elem, index) => {
                    return (
                      <div style={{ marginTop: "1rem" }} key={index}>
                        <TableContainer
                          style={{ backgroundColor: "#FEFCFF" }}
                          component={Paper}
                        >
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell style={tableCellStyle}>
                                  Client Name:
                                </TableCell>
                                <TableCell style={tableCellStyle}>
                                  Phone:
                                </TableCell>
                                <TableCell style={tableCellStyle}>
                                  Email:
                                </TableCell>
                                <TableCell style={tableCellStyle}></TableCell>
                                <TableCell style={tableCellStyle}></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>
                                  {elem.clientData.client_name}
                                </TableCell>
                                <TableCell>{elem.clientData.phone}</TableCell>
                                <TableCell>{elem.clientData.email}</TableCell>
                                <TableCell></TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "large",
                                  }}
                                >
                                  Relevant Notes:
                                </TableCell>
                                <TableCell colSpan={4}>
                                  {elem.clientData.notes}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                            <TableHead>
                              <TableRow>
                                <TableCell style={tableCellStyle}>
                                  Phone Call Duration:
                                </TableCell>
                                <TableCell style={tableCellStyle}>
                                  Incoming:
                                </TableCell>
                                <TableCell style={tableCellStyle}>
                                  Purpose:
                                </TableCell>
                                <TableCell style={tableCellStyle}>
                                  Files:
                                </TableCell>
                                <TableCell style={tableCellStyle}></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell>{elem.duration}</TableCell>
                                <TableCell>
                                  {elem.incoming ? "Incoming" : "Outgoing"}
                                </TableCell>
                                <TableCell>{elem.calltype}</TableCell>
                                <TableCell>
                                  <RetrieveFiles
                                    id={elem.id}
                                    fileIsNotNull={elem.files}
                                  />
                                </TableCell>
                                <TableCell></TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "large",
                                  }}
                                >
                                  Relevant Notes:
                                </TableCell>
                                <TableCell colSpan={4}>{elem.notes}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        &nbsp;
                      </div>
                    );
                  })}
                </>
              )}
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Admin;
