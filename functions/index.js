const functions = require("firebase-functions");
const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const cors = require("cors");
const express = require("express");

initializeApp();
const app = express();

// routes
const gameRoute = require("./routes/game");
const subRoute = require("./routes/subscribe");
const membership = require("./routes/membership");
const admin = require("./routes/admin");

// middleware
app.use(express.json());
app.use(cors());
app.use("/api/game", gameRoute);
app.use("/api/subscribe", subRoute);
app.use("/api/membership", membership);
app.use("/api/admin", admin);

exports.app = functions.https.onRequest(app);

exports.sendWelcomeEmail = functions.auth.user().onCreate((user)=>{
  getAuth().setCustomUserClaims(user.uid, {
    subscriptionEnd: undefined,
    premium: false,
  }).then(()=>{
    console.log("new user created: ", user.email);
  }).catch((er)=>{
    console.log("error setting custom claim for new user");
    console.log(JSON.stringify(er));
  });
});
