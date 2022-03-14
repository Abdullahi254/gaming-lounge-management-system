const router = require("express").Router();
const {getFirestore} = require("firebase-admin/firestore");
const axios = require("axios");
const getApiKeys = require("../middlewares/daraja");

// getting db ref
const db = getFirestore();

// pay-game
router.post("/pay", getApiKeys, (req, resp)=>{
  const tokenUrl = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  const buff = Buffer.from(req.consumerKey + ":" + req.consumerSecret);
  const auth = "Basic " + buff.toString("base64");
  axios({
    method: "get",
    url: tokenUrl,
    headers: {"Authorization": auth},
  }).then((res) => {
    console.log("Access Token acquired");
    console.log(`${req.userid} found successfully`);
    const accessToken = res.data.access_token;
    let amount = req.body.amount;
    const url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
    const shortCode = req.shortCode.toString();
    const passKey = req.passkey.toString();
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
    console.log("Amount before rounding", amount);
    amount = Math.round(amount).toString();
    console.log("amount after rounding", amount);
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
        "CallBackURL": `https://us-central1-gaming-payment-system-dev.cloudfunctions.net/app/api/game/save-receipt/${req.userid}`,
        "AccountReference": "AIM LABS KE",
        "TransactionDesc": "Game payment fee",
      },
    }).then((res) => {
      console.log("STP sent to customer");
      resp.send(res.data);
    }).catch(()=>{
      console.log("STP error");
      resp.status(500).send({
        code: "internal",
        message: "STP error",
      });
    });
  }).catch(() => {
    console.log("access token not found");
    resp.status(500).send({
      code: "internal",
      message: "access token not found",
    });
  });
});

router.post("/save-receipt/:uid", (req, res) => {
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
      checkoutId: req.body.Body.stkCallback.CheckoutRequestID,
    };
    db.collection("users").doc(req.params.uid).
        collection("statements").add(statement).then(()=>{
          console.log("statement added to db");
          console.log(JSON.stringify(statement));
          res.send("Thank you safaricom");
        }).catch((error)=>{
          console.log("error saving to db");
          console.log(error);
          res.send("Thank you safaricom");
        });
  } else {
    // when payment failed
    console.log("payment failed!.");
    console.log(JSON.stringify(req.body.Body));
    res.send("THANK YOU SAFARICOM");
  }
},
);

module.exports = router;
