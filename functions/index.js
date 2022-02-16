const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const express = require("express");
admin.initializeApp();
const app = express();

// middleware
app.use(express.json());
app.use(cors());


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
    admin.firestore().collection("users").doc(req.params.uid).
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
    console.log(req.body.Body);
    res.status("payment failed! Transaction might have been cancelled.").
        status(417);
  }
}
);

exports.app = functions.https.onRequest(app);
