const functions = require("firebase-functions");
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const {getAuth} = require("firebase-admin/auth");
const cors = require("cors");
const express = require("express");
const axios = require("axios");

initializeApp();
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// getting db ref
const db = getFirestore();

app.post("/lipanamobile/:uid", (req, res) => {
  console.log(`requested from user ${req.params.uid}`);
  // when payment is successfull
  if (req.body.Body.stkCallback.ResultCode === 0) {
    console.log("payment successfull");
    const date = new Date();
    const statement = {
      type: "Mpesa",
      date: date,
      amount: req.body.Body.stkCallback.CallbackMetadata.Item[0].Value,
      from: req.body.Body.stkCallback.CallbackMetadata.Item[4].Value,
      receiptNumber: req.body.Body.stkCallback.CallbackMetadata.Item[1].Value,
      month: date.getMonth(),
      year: date.getFullYear(),
      viewed: false,
      requestId: req.body.Body.stkCallback.MerchantRequestID,
    };
    db.collection("users").doc(req.params.uid).
        collection("statements").add(statement).then(()=>{
          console.log("statement added to db");
          console.log(JSON.stringify(statement));
          res.send("successful created statement").status(201);
        }).catch((error)=>{
          console.log("error saving to db");
          console.log(error);
          res.send("failed to create statement").status(424);
        });
  } else {
    // when payment failed
    console.log("payment failed! Transaction cancelled.");
    res.send("payment failed! Transaction cancelled.").status(499);
  }
}
);

app.post("/subscribe", (req, resp)=>{
  const tokenUrl = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const buff = Buffer.from(process.env.SAFARICOM_CONSUMER_KEY + ":" +
  process.env.SAFARICOM_CONSUMER_SECRET);
  const auth = "Basic " + buff.toString("base64");
  axios({
    method: "get",
    url: tokenUrl,
    headers: {
      "Authorization": auth,
    },
  }).then((res) => {
    console.log("Access Token acquired");
    const email = req.body.email;
    getAuth().getUserByEmail(email).then((user)=>{
      console.log(`${user.uid} found successfully`);
      const subscribtionMonth = req.body.month;
      const accessToken = res.data.access_token;
      let amount = subscribtionMonth * 1;
      if (subscribtionMonth>1) {
        amount = (subscribtionMonth * 500) * 0.9;
      }
      const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
      const shortCode = process.env.SAFARICOM_SHORTCODE.toString();
      const passKey = process.env.SAFARICOM_PASSKEY.toString();
      const event = new Date();
      const year = event.getFullYear().toString();
      let month = event.getMonth() + 1;
      month = month.toString();
      if (month.length < 2) month = "0" + month;
      let date = event.getDate().toString();
      if (date.length < 2) date = "0" + date;
      let hour = event.getHours().toString();
      if (hour.length < 2) hour = "0" + hour;
      let minutes = event.getMinutes().toString();
      if (minutes.length < 2) minutes = "0" + minutes;
      let seconds = event.getSeconds().toString();
      if (seconds.length < 2) seconds = "0" + seconds;
      const timeStamp = year + month + date + hour + minutes + seconds;
      const password = Buffer.from(shortCode + passKey + timeStamp).
          toString("base64");
      amount = amount.toString();
      const phone = "254" + req.body.phone.toString();
      axios({
        method: "post",
        url,
        headers: {
          "Authorization": "Bearer " + accessToken,
          "Content-Type": "application/json",
        },
        data: {
          "BusinessShortCode": shortCode,
          "Password": password,
          "Timestamp": timeStamp,
          "TransactionType": "CustomerPayBillOnline",
          "Amount": amount,
          "PartyA": phone,
          "PartyB": shortCode,
          "PhoneNumber": phone,
          "CallBackURL": `https://us-central1-gaming-payment-system-dev.cloudfunctions.net/app/lipasubscription/${user.uid}`,
          "AccountReference": "AIM LABS KE",
          "TransactionDesc": "subscription fee",
        },
      }).then((res) => {
        console.log("STP sent to customer");
        resp.send(res.data);
      }).catch((er)=>{
        console.log("STP error");
        resp.send(er);
      });
    }).catch((er)=>{
      console.log("failed to get user by email");
      resp.send(er);
    });
  }).catch((er) => {
    console.log("access token not found");
    resp.send(er);
  });
});

app.post("/lipasubscription/:uid", (req, res) => {
  console.log(`requested from user ${req.params.uid}`);
  // when payment is successfull
  if (req.body.Body.stkCallback.ResultCode === 0) {
    console.log("payment successfull");
    const date = new Date();
    const statement = {
      type: "Mpesa",
      date: date,
      amount: req.body.Body.stkCallback.CallbackMetadata.Item[0].Value,
      from: req.body.Body.stkCallback.CallbackMetadata.Item[4].Value,
      receiptNumber: req.body.Body.stkCallback.CallbackMetadata.Item[1].Value,
      month: date.getMonth(),
      year: date.getFullYear(),
      requestId: req.body.Body.stkCallback.MerchantRequestID,
    };
    db.collection("users").doc(req.params.uid).
        collection("subscriptions").add(statement).then(()=>{
          console.log("statement added to db");
          console.log(JSON.stringify(statement));
          res.send("successful created statement").status(201);
        }).catch((error)=>{
          console.log("error saving to db");
          console.log(error);
          res.send("failed to create statement").status(424);
        });
  } else {
    // when payment failed
    console.log("payment failed! Transaction cancelled.");
    res.send("payment failed! Transaction cancelled.").status(499);
  }
}
);
exports.app = functions.https.onRequest(app);

