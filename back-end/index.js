const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const path = require("path");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db");
const fileUpload = require("express-fileupload");
const fs = require("fs");
require("./passport-setup");

app.use(
  session({
    // name: "SESS_NAME",
    store: new pgSession({
      pool: pool,
    }),
    secret: "asjhdfaious12312381u98asudf",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      // sameSite: "none",
      // httpOnly: false,
      // secure: true,
    },
  })
);
const corsOptions = {
  credentials: true,
  origin: true,
};

app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// app.use(
//   cookieSession({
//     name: "session",
//     keys: ["key1", "key2"],
//     maxAge: 24 * 60 * 60 * 1000,
//   })
// );

app.use(passport.initialize());
app.use(passport.session());

const isAuth = (req, res, next) => {
  if (req.session.isAuth) next();
  else res.sendStatus(401);
};

const isAuthBasic = (req, res, next) => {
  if (req.session.isAuth && req.session.role === "basic") next();
  else res.sendStatus(401);
};

const isAuthAdmin = (req, res, next) => {
  if (req.session.isAuth && req.session.role === "admin") next();
  else res.sendStatus(401);
};

app.get("/success", async (req, res) => {
  try {
    const checkIfExistsBasic = await pool.query(
      `SELECT * FROM BasicUser WHERE id = '${req.user.id}';`
    );
    const checkIfExistsAdmin = await pool.query(
      `SELECT * FROM AdminUser WHERE id = '${req.user.id}';`
    );
    if (
      checkIfExistsBasic.rows.length === 0 &&
      checkIfExistsAdmin.rows.length === 0
    ) {
      const userID = await pool.query(
        `INSERT INTO BasicUser(id, name, email) VALUES(${req.user.id}, ${req.user.name}, ${req.user.email});`
      );
    }

    const checkIfExistsEmployee = await pool.query(
      `SELECT * FROM Employee WHERE user_id = '${req.user.id}';`
    );
    if (checkIfExistsEmployee.rows.length === 0) req.session.department = null;
    else req.session.department = true;

    req.session.isAuth = true;

    if (checkIfExistsAdmin.rows.length !== 0) req.session.role = "admin";
    else req.session.role = "basic";

    res.cookie("sid", req.sessionID);
    res.redirect("http://localhost:3000");
  } catch (err) {
    console.error(err);
  }
});

app.get("/failed", (req, res) => {
  try {
    req.session.isAuth = false;
    res.send(`Bad Credentials`);
  } catch (err) {
    console.error(err);
  }
});

app.get("/login", (req, res) => {
  try {
    res.redirect("/google");
  } catch (err) {
    console.error(err);
  }
});

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/failed" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/success");
  }
);

app.get("/api/checkIfAuth", async (req, res) => {
  try {
    if (req.sessionID) {
      res.status(200).json({
        status: "success",
        name: req.user.name,
        email: req.user.email,
        role: req.session.role,
        department: req.session.department,
      });
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error(err);
  }
});

app.post("/api/setEmployee", isAuth, async (req, res) => {
  try {
    const { dept } = req.body;
    const checkIfExistsDept = await pool.query(
      `SELECT * FROM Department WHERE dept_name = '${dept}';`
    );
    let deptID = "";
    if (checkIfExistsDept.rows.length === 0) {
      const setDept = await pool.query(
        `INSERT INTO Department(dept_name) VALUES('${dept}');`
      );
      const getDeptID = await pool.query(
        `SELECT * FROM Department WHERE dept_name = '${dept}';`
      );
      deptID = getDeptID.rows[0].id;
    } else deptID = checkIfExistsDept.rows[0].id;
    const setEmployee = await pool.query(
      `INSERT INTO Employee(emp_name, department_id, user_id) VALUES ('${req.user.name}', '${deptID}', '${req.user.id}')`
    );
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error(err);
  }
});

app.post("/api/addCall", isAuthBasic, async (req, res) => {
  try {
    const { client, callInfo } = req.body;
    // Data Fixing
    if (callInfo.duration.length === 5) {
      callInfo.duration = "00:" + callInfo.duration;
    }
    // Save in Database
    const getEmployee = await pool.query(
      `SELECT * FROM Employee WHERE user_id = '${req.user.id}';`
    );
    const checkIfClientExists = await pool.query(
      `SELECT * FROM Client WHERE client_name = '${client.clientName}' AND phone = '${client.phone}' AND email = '${client.email}';`
    );
    if (checkIfClientExists.rows.length === 0) {
      const setClient = await pool.query(
        `INSERT INTO Client(client_name, phone, email, notes, department_id) VALUES ('${client.clientName}', '${client.phone}', '${client.email}', '${client.notes}', '${getEmployee.rows[0].department_id}');`
      );
    }
    const checkIfExistsCallType = await pool.query(
      `SELECT * FROM CallType WHERE calltype = '${callInfo.calltype}';`
    );
    if (checkIfExistsCallType.rows.length === 0) {
      const setCallType = await pool.query(
        `INSERT INTO CallType(calltype) VALUES ('${callInfo.calltype}');`
      );
    }
    const getClient = await pool.query(
      `SELECT * FROM Client WHERE client_name = '${client.clientName}' AND phone = '${client.phone}' AND email = '${client.email}';`
    );
    const setPhoneCall = await pool.query(
      `INSERT INTO PhoneCall(duration, incoming, notes, calltype, client_id, emp_id) VALUES ('${callInfo.duration}', ${callInfo.incoming}, '${callInfo.notes}', '${callInfo.calltype}', ${getClient.rows[0].id}, ${getEmployee.rows[0].id});`
    );
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error(err);
  }
});

app.post("/api/uploadFiles", isAuth, async (req, res) => {
  try {
    const file = req.files.File;
    const getEmployee = await pool.query(
      `SELECT * FROM Employee WHERE user_id = '${req.user.id}';`
    );
    const getPhoneCall = await pool.query(
      `SELECT * FROM PhoneCall WHERE emp_id = ${getEmployee.rows[0].id};`
    );
    const currentPhoneCall = getPhoneCall.rows.pop();
    file.mv(
      path.join(
        __dirname,
        "./data",
        `${currentPhoneCall.id}${file.name.slice(-4)}`
      ),
      async (error) => {
        if (error) {
          console.error(error);
        }
        const setFileInPhoneCall = await pool.query(
          `UPDATE PhoneCall SET files = '${
            "/data" + "/" + currentPhoneCall.id + file.name.slice(-4)
          }' WHERE id = ${currentPhoneCall.id};`
        );
        res.status(200).json({
          status: "success",
        });
      }
    );
  } catch (err) {
    console.error(err);
  }
});

app.get("/api/getData", isAuthBasic, async (req, res) => {
  try {
    const getEmployee = await pool.query(
      `SELECT * FROM Employee WHERE user_id = '${req.user.id}';`
    );
    if (getEmployee.rows.length === 0) return;
    const getPhoneCalls = await pool.query(
      `SELECT * FROM PhoneCall WHERE emp_id = ${getEmployee.rows[0].id};`
    );
    let phoneCalls = new Array();
    for (call of getPhoneCalls.rows) {
      phoneCalls.push(addClientToObj(call));
    }
    Promise.all(phoneCalls)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => console.error(err));
  } catch (err) {
    console.error(err);
  }
});

const addClientToObj = async (call, phoneCalls) => {
  const getClient = await pool.query(
    `SELECT * FROM Client WHERE id = ${call.client_id};`
  );
  call.clientData = getClient.rows[0];
  return call;
};

app.get("/api/files/:id", isAuth, async (req, res) => {
  try {
    const { id } = req.params;
    res.status(200).sendFile(path.join(__dirname, "./data", `${id}.zip`));
  } catch (err) {
    console.error(err);
  }
});

app.delete("/api/basic/delete/:id", isAuthBasic, async (req, res) => {
  try {
    const { id } = req.params;
    const checkPhoneCall = await pool.query(
      `SELECT * FROM PhoneCall WHERE id = ${id};`
    );
    const checkUserId = await pool.query(
      `SELECT * FROM Employee WHERE id = ${checkPhoneCall.rows[0].emp_id};`
    );
    if (checkUserId.rows[0].user_id === req.user.id) {
      const deletePhoneCallWithId = await pool.query(
        `DELETE FROM PhoneCall WHERE id = ${id};`
      );
      fs.unlinkSync(`.${checkPhoneCall.rows[0].files}`);
      res.status(200).json({ status: "success" });
    } else {
      res.status(401);
    }
  } catch (err) {
    console.error(err);
  }
});

app.put("/api/basic/updateInfo", isAuthBasic, async (req, res) => {
  try {
    const data = req.body;
    const updateClient =
      await pool.query(`UPDATE Client SET client_name = '${data.clientData.clientName}', phone = '${data.clientData.phone}',
    email = '${data.clientData.email}', notes = '${data.clientData.notes}' 
    WHERE id = ${data.clientData.id};`);
    const updatePhoneCall =
      await pool.query(`UPDATE PhoneCall SET duration = '${data.duration}', incoming = ${data.incoming},
    notes = '${data.notes}', calltype = '${data.calltype}' WHERE id = ${data.id};`);
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error(err);
  }
});

// MAKE AUTHORIZATION MIDDLEWARE FOR BOTH ROLES
// ADMIN ROUTES
app.get("/api/admin/getAllUsers", isAuthAdmin, async (req, res) => {
  try {
    const getAllUsers = await pool.query(`SELECT * FROM Employee;`);
    res.status(200).json(getAllUsers.rows);
  } catch (err) {
    console.error(err);
  }
});

app.get("/api/admin/getUserData/:user", isAuthAdmin, async (req, res) => {
  try {
    const { user } = req.params;
    if (user === "all") {
      const getAllUsers = await pool.query(`SELECT * FROM Employee;`);
      let employeeResponse = new Array();
      for (employee of getAllUsers.rows) {
        const getPhoneCalls = await pool.query(
          `SELECT * FROM PhoneCall WHERE emp_id = ${employee.id};`
        );
        if (getPhoneCalls.rows.length === 0) continue;
        employee.phoneCalls = getPhoneCalls.rows;
        for (call of employee.phoneCalls) {
          const getClient = await pool.query(
            `SELECT * FROM Client WHERE id = ${call.client_id};`
          );
          call.clientData = getClient.rows[0];
        }
        employeeResponse.push(employee);
      }
      Promise.all(employeeResponse)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => console.error(err));
    } else {
      const getPhoneCalls = await pool.query(
        `SELECT * FROM PhoneCall WHERE emp_id = ${user};`
      );
      let phoneCalls = new Array();
      for (call of getPhoneCalls.rows) {
        phoneCalls.push(addClientToObj(call));
      }
      Promise.all(phoneCalls)
        .then((result) => {
          res.status(200).send(result);
        })
        .catch((err) => console.error(err));
    }
  } catch (err) {
    console.error(err);
  }
});

app.delete("/api/admin/delete/:id", isAuthAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletePhoneCallWithId = await pool.query(
      `DELETE FROM PhoneCall WHERE id = ${id};`
    );
    fs.unlinkSync(`./data/${id}.zip`);
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error(err);
  }
});

app.put("/api/admin/updateInfo", isAuthAdmin, async (req, res) => {
  try {
    const data = req.body;
    const updateClient =
      await pool.query(`UPDATE Client SET client_name = '${data.clientData.clientName}', phone = '${data.clientData.phone}',
    email = '${data.clientData.email}', notes = '${data.clientData.notes}' 
    WHERE id = ${data.clientData.id};`);
    const updatePhoneCall =
      await pool.query(`UPDATE PhoneCall SET duration = '${data.duration}', incoming = ${data.incoming},
    notes = '${data.notes}', calltype = '${data.calltype}' WHERE id = ${data.id};`);
    res.status(200).json({ status: "success" });
  } catch (err) {
    console.error(err);
  }
});

app.put("/api/updateFile/:id", isAuth, (req, res) => {
  try {
    const { id } = req.params;
    const file = req.files.File;
    file.mv(
      path.join(__dirname, "./data", `${id}${file.name.slice(-4)}`),
      async (error) => {
        if (error) {
          console.error(error);
        }
        const setFileInPhoneCall = await pool.query(
          `UPDATE PhoneCall SET files = '${
            "/data" + "/" + id + file.name.slice(-4)
          }' WHERE id = ${id};`
        );
        res.status(200).json({
          status: "success",
        });
      }
    );
  } catch (err) {
    console.error(err);
  }
});

app.get("/api/admin/Employee", isAuthAdmin, async (req, res) => {
  try {
    const getAllEmployees = await pool.query("SELECT * FROM Employee;");
    let finalArray = new Array();
    for (user of getAllEmployees.rows) {
      const getPhoneCalls = await pool.query(
        `SELECT * FROM PhoneCall WHERE emp_id = ${user.id};`
      );
      if (getPhoneCalls.rows.length === 0) continue;
      user.phoneCalls = { ...getPhoneCalls.rows };
      finalArray.push(user);
    }
    Promise.all(finalArray)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => console.error(err));
  } catch (err) {
    console.error(err);
  }
});

app.get("/api/admin/Dept", isAuthAdmin, async (req, res) => {
  try {
    const getAllDepts = await pool.query("SELECT * FROM Department;");
    let finalArray = new Array();
    for (dept of getAllDepts.rows) {
      const getDeptUsers = await pool.query(
        `SELECT * FROM Employee WHERE department_id = ${dept.id};`
      );
      if (getDeptUsers.rows.length === 0) continue;
      for (user of getDeptUsers.rows) {
        const getPhoneCalls = await pool.query(
          `SELECT * FROM PhoneCall WHERE emp_id = ${user.id};`
        );
        if (getPhoneCalls.rows.length === 0) continue;
        user.phoneCalls = { ...getPhoneCalls.rows };
        user.deptInfo = { ...dept };
        finalArray.push(user);
      }
    }
    Promise.all(finalArray)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => console.error(err));
  } catch (err) {
    console.error(err);
  }
});

app.get("/api/admin/Client", isAuthAdmin, async (req, res) => {
  try {
    const getAllClients = await pool.query("SELECT * FROM Client;");
    let finalArray = new Array();
    for (client of getAllClients.rows) {
      const getPhoneCalls = await pool.query(
        `SELECT * FROM PhoneCall WHERE client_id = ${client.id};`
      );
      if (getPhoneCalls.rows.length === 0) continue;
      client.phoneCalls = { ...getPhoneCalls.rows };
      finalArray.push(client);
    }
    Promise.all(finalArray)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => console.error(err));
  } catch (err) {
    console.error(err);
  }
});

app.get("/logout", (req, res) => {
  // req.session.destroy((err) => {
  //   if (err) throw err;
  // });
  req.logout();
  req.session.destroy((err) => {
    if (err) throw err;
  });
  res.clearCookie;
  res.status(200).json({ status: "success" });
});

app.listen(5000, () => console.log("Listening on port 5000..."));
