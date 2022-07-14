const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const passport = require("passport");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const pool = require("./db");
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

app.get("/success", async (req, res) => {
  try {
    console.log("here", req.user);
    console.log(req.session);
    console.log(req.sessionID);
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
        `INSERT INTO BasicUser(id) VALUES(${req.user.id});`
      );
    }
    req.session.isAuth = true;
    if (checkIfExistsAdmin.rows.length !== 0) req.session.role = "admin";
    else req.session.role = "basic";
    console.log(res);
    console.log(req.session);
    console.log(req.sessionID);
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
    console.log(req.user);
    res.redirect("/success");
  }
);

app.get("/checkIfAuth", async (req, res) => {
  try {
    if (req.sessionID) {
      res.status(200).json({
        status: "success",
        name: req.user.name,
        email: req.user.email,
        role: req.session.role,
      });
    } else {
      res.sendStatus(404);
    }
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
