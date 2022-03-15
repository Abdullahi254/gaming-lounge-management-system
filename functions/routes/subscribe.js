const router = require("express").Router();
const {getFirestore} = require("firebase-admin/firestore");
const axios = require("axios");
const {getAuth} = require("firebase-admin/auth");

// getting db ref
const db = getFirestore();
router.post("/", (req, resp)=>{
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
        amount = (subscribtionMonth * 1) * 0.9;
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
          "CallBackURL": `https://us-central1-gaming-payment-system-dev.cloudfunctions.net/app/api/subscribe/save-receipt/${user.uid}`,
          "AccountReference": "AIM LABS KE",
          "TransactionDesc": "subscription fee",
        },
      }).then((res) => {
        console.log("STP sent to customer");
        resp.send(res.data);
      }).catch(()=>{
        console.log("STP error");
        resp.status(500).send({
          code: "Internal",
          message: "Error occured sending STP request",
        });
      });
    }).catch(()=>{
      console.log("failed to get user by email(subscribe route)");
      resp.status(500).send({
        code: "Internal",
        message: "failed to get user by email",
      });
    });
  }).catch(() => {
    console.log("access token not found");
    resp.status(500).send({
      code: "Internal",
      message: "access token not found",
    });
  });
});

router.post("/save-receipt/:uid", (req, res) => {
  console.log(`requested from user ${req.params.uid}`);
  // when payment is successfull
  if (req.body.Body.stkCallback.ResultCode === 0) {
    console.log("payment successfull");
    getAuth().getUser(req.params.uid).then((userRecord)=>{
      let amount = req.body.Body.stkCallback.CallbackMetadata.Item[0].Value;
      if (amount!==1) {
        amount = amount / 0.9;
      }
      const months = amount/1;
      const subscriptionEnd = userRecord.customClaims["subscriptionEnd"];
      const subscriptionEndEvent = new Date(subscriptionEnd);
      let diff = 0;
      if (subscriptionEnd) {
        const now = new Date();
        console.log("The current date and time is", now);
        console.log("subscription ends in", subscriptionEnd);
        console.log("subscription ends in(milliseconds)",
            subscriptionEndEvent.getTime());
        console.log("now in(milliseconds)", now.getTime());
        diff = subscriptionEndEvent.getTime() - now.getTime();
      }
      if (diff > 1) {
        const sub = subscriptionEndEvent.getTime();
        const newDate = new Date(sub);
        newDate.setMonth(newDate.getMonth() + months);
        const admin = userRecord.customClaims["admin"];
        const customClaims = {
          subscriptionEnd: newDate.toDateString(),
          premium: true,
          admin: admin,
        };
        getAuth().setCustomUserClaims(req.params.uid, customClaims).then(()=>{
          console.log("subscription expiry date updated");
        }).catch(()=>{
          console.log("error updating subscription date");
        });
      } else {
        const newDate = new Date();
        newDate.setMonth(newDate.getMonth() + months);
        const admin = userRecord.customClaims["admin"];
        const customClaims = {
          subscriptionEnd: newDate.toDateString(),
          premium: true,
          admin: admin,
        };
        getAuth().setCustomUserClaims(req.params.uid, customClaims).then(()=>{
          console.log("subscription expiry date updated");
        }).catch(()=>{
          console.log("error updating subscription date");
        });
      }
    }).catch(()=>{
      console.log("error fetching premium custom claims");
    });
    const date = new Date();
    let amount = req.body.Body.stkCallback.CallbackMetadata.Item[0].Value;
    if (amount!==1) {
      amount = amount / 0.9;
    }
    const months = amount/1;
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
      period: months,
    };
    db.collection("users").doc(req.params.uid).
        collection("subscriptions").add(statement).then(()=>{
          console.log("statement added to db");
          console.log(JSON.stringify(statement));
          res.send("THANK YOU SAFARICOM");
        }).catch((error)=>{
          console.log("error saving to db");
          console.log(error);
          res.send("THANK YOU SAFARICOM");
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
