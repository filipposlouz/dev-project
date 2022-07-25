import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RetrieveFiles from "./RetrieveFiles";

const tableCellStyle = {
  fontWeight: "bold",
  fontSize: "large",
  //   padding: "1rem",
  borderBottom: "1px solid black",
};

const GetData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/api/getData", {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());
      setData(response);
      console.log(response);
    };
    fetchData();
  }, []);
  return (
    <div style={{ marginTop: "3rem" }}>
      <strong style={{ textDecoration: "underline" }}>
        {data.length === 0 ? "" : "Already Submitted Data:"}
      </strong>
      {data.map((elem, index) => {
        return (
          <div style={{ marginTop: "1rem" }} key={index}>
            <TableContainer
              style={{ backgroundColor: "#FEFCFF" }}
              component={Paper}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={tableCellStyle}>Client Name:</TableCell>
                    <TableCell style={tableCellStyle}>Phone:</TableCell>
                    <TableCell style={tableCellStyle}>Email:</TableCell>
                    <TableCell style={tableCellStyle}></TableCell>
                    <TableCell style={tableCellStyle}></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{elem.clientData.client_name}</TableCell>
                    <TableCell>{elem.clientData.phone}</TableCell>
                    <TableCell>{elem.clientData.email}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: "bold", fontSize: "large" }}
                    >
                      Relevant Notes:
                    </TableCell>
                    <TableCell colSpan={4}>{elem.clientData.notes}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <TableCell style={tableCellStyle}>
                      Phone Call Duration:
                    </TableCell>
                    <TableCell style={tableCellStyle}>Incoming:</TableCell>
                    <TableCell style={tableCellStyle}>Purpose:</TableCell>
                    <TableCell style={tableCellStyle}>Files:</TableCell>
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
                      <RetrieveFiles id={elem.id} fileIsNotNull={elem.files} />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      style={{ fontWeight: "bold", fontSize: "large" }}
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
    </div>
  );
};

export default GetData;
