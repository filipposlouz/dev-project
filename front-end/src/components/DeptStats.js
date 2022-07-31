import React, { useState, useEffect, Fragment } from "react";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const DeptStats = ({ statOption }) => {
  const [userData, setUserData] = useState([]);

  const getCallData = async () => {
    console.log(statOption);
    const res = await fetch(`http://localhost:5000/api/admin/${statOption}`, {
      method: "GET",
      credentials: "include",
    }).then((res) => res.json());
    console.log(res);
    processData(res);
  };

  const processData = (phoneData) => {
    let finalData = new Array();
    phoneData.forEach((elem) => {
      //   console.log(elem);
      let minDuration = [Infinity, Infinity, Infinity];
      let maxDuration = [-Infinity, -Infinity, -Infinity];
      let median = [0, 0, 0];
      let numOfCalls = Object.keys(elem.phoneCalls).length;
      console.log("phonecalls", numOfCalls);
      //   const calls = elem.phoneCalls;
      for (let index in elem.phoneCalls) {
        console.log(elem.phoneCalls[index]);
        let call = elem.phoneCalls[index];
        let timeSpent = call.duration.split(":");
        timeSpent[0] = parseInt(timeSpent[0]);
        timeSpent[1] = parseInt(timeSpent[1]);
        timeSpent[2] = parseInt(timeSpent[2]);
        console.log(timeSpent);
        // MIN
        if (minDuration[0] >= timeSpent[0]) {
          if (minDuration[0] > timeSpent[0]) {
            minDuration = timeSpent;
          } else {
            if (minDuration[1] >= timeSpent[1]) {
              if (minDuration[1] > timeSpent[1]) {
                minDuration = timeSpent;
              } else {
                if (minDuration[2] >= timeSpent[2]) {
                  minDuration = timeSpent;
                }
              }
            }
          }
        }
        // MAX
        if (maxDuration[0] <= timeSpent[0]) {
          if (maxDuration[0] < timeSpent[0]) {
            maxDuration = timeSpent;
          } else {
            if (maxDuration[1] <= timeSpent[1]) {
              if (maxDuration[1] < timeSpent[1]) {
                maxDuration = timeSpent;
              } else {
                if (maxDuration[2] <= timeSpent[2]) {
                  maxDuration = timeSpent;
                }
              }
            }
          }
        }
        median[0] += timeSpent[0];
        median[1] += timeSpent[1];
        median[2] += timeSpent[2];
        console.log("median", median);
      }
      median[0] = median[0] / numOfCalls;
      median[1] = median[1] / numOfCalls;
      median[2] = median[2] / numOfCalls;
      elem.stats = {
        min: `${minDuration[0]}:${minDuration[1]}:${minDuration[2]}`,
        max: `${maxDuration[0]}:${maxDuration[1]}:${maxDuration[2]}`,
        median: `${median[0].toFixed(0)}:${median[1].toFixed(
          0
        )}:${median[2].toFixed(0)}`,
        numOfCalls: numOfCalls,
      };
      console.log(elem.stats);
      finalData.push(elem);
    });
    setUserData(finalData);
  };

  useEffect(() => {
    getCallData();
  }, []);

  return (
    <Fragment>
      <div>
        {userData.map((elem, index) => {
          return (
            <div key={index}>
              <h2>Dept Name: {elem.deptInfo.dept_name}</h2>
              <TableContainer
                style={{ backgroundColor: "#FEFCFF" }}
                component={Paper}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Min Duration:</TableCell>
                      <TableCell>Max Duration:</TableCell>
                      <TableCell>Median:</TableCell>
                      <TableCell>Number Of Calls:</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{elem.stats.min}</TableCell>
                      <TableCell>{elem.stats.max}</TableCell>
                      <TableCell>{elem.stats.median}</TableCell>
                      <TableCell>{elem.stats.numOfCalls}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              &nbsp;
            </div>
          );
        })}
      </div>
    </Fragment>
  );
};

export default DeptStats;
