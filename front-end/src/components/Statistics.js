import React, { Fragment, useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import "./Statistics.css";
import EmployeeStats from "./EmployeeStats";
import DeptStats from "./DeptStats";
import ClientStats from "./ClientStats";

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

const Statistics = () => {
  const [statOption, setStatOption] = useState("");
  const [userData, setUserData] = useState([]);

  const handleChange = async (e) => {
    e.preventDefault();
    setStatOption(e.target.value);
  };

  return (
    <Fragment>
      <div className="table-outside-container">
        <div style={{ width: "80%" }}>
          <Box
            sx={{
              flexGrow: 1,
              marginTop: "3rem",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <NeutralItem>
                  <Box>
                    <FormControl fullWidth>
                      <InputLabel>Statistics per:</InputLabel>
                      <Select
                        id="select"
                        value={statOption}
                        label="Statistics per:"
                        onChange={handleChange}
                      >
                        <MenuItem value={""} selected disabled>
                          Select one of the options:
                        </MenuItem>
                        <MenuItem value={"Employee"}>Employee</MenuItem>
                        <MenuItem value={"Dept"}>Department</MenuItem>
                        <MenuItem value={"Client"}>Client</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </NeutralItem>
              </Grid>
              <Grid item xs={9}>
                <Item>
                  {statOption === "Employee" ? (
                    <EmployeeStats statOption={statOption} />
                  ) : (
                    ""
                  )}
                  {statOption === "Dept" ? (
                    <DeptStats statOption={statOption} />
                  ) : (
                    ""
                  )}
                  {statOption === "Client" ? (
                    <ClientStats statOption={statOption} />
                  ) : (
                    ""
                  )}
                </Item>
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
    </Fragment>
  );
};

export default Statistics;
