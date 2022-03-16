const router = require("express").Router();
const {getFirestore} = require("firebase-admin/firestore");
const {getAuth} = require("firebase-admin/auth");

// getting db ref
const db = getFirestore();

router.post("/validate", (req, res)=>{
  const email = req.body.BillRefNumber;
  getAuth().getUserByEmail(email).then((user)=>{
    const amount = req.body.TransAmount;
    if (amount === 1 || Number.isInteger(amount/0.9)) {
      res.json({
        "ResultCode": 0,
        "ResultDesc": "Accepted",
      });
    } else {
      res.json(
          {
            "ResultCode": "C2B00013",
            "ResultDesc": "Rejected",
          },
      );
    }
  }).catch(()=>{
    res.json(
        {
          "ResultCode": "C2B00012",
          "ResultDesc": "Rejected",
        },
    );
  });
});

router.post("/confirm", (req, res)=>{
  getAuth().getUser(req.body.BillRefNumber).then((userRecord)=>{
    let amount = req.body.TransAmount;
    if (amount!==1) {
      amount = amount / 0.9;
    }
    const months = amount/1;
    const subscriptionEnd = userRecord.customClaims["subscriptionEnd"];
    const subscriptionEndEvent = new Date(subscriptionEnd);
    let diff = 0;
    if (subscriptionEnd) {
      const now = new Date();
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
      getAuth().setCustomUserClaims(userRecord.uid, customClaims).then(()=>{
        console.log("subscription expiry date updated");
      }).catch(()=>{
        console.log("error updating subscription date");
        res.end();
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
      getAuth().setCustomUserClaims(userRecord.uid, customClaims).then(()=>{
        console.log("subscription expiry date updated");
      }).catch(()=>{
        console.log("error updating subscription date");
        res.end();
      });
    }
    const date = new Date();
    const statement = {
      date: date,
      amount: req.body.TransAmount,
      from: req.body.MSISDN,
      receiptNumber: req.body.TransID,
      month: date.getMonth(),
      year: date.getFullYear(),
      viewed: false,
      transactionType: req.body.TransactionType,
      period: months,
    };
    db.collection("users").doc(userRecord.uid).
        collection("subscriptions").add(statement).then(()=>{
          console.log("statement added to db");
          console.log(JSON.stringify(statement));
          res.send("THANK YOU SAFARICOM");
        }).catch((error)=>{
          console.log("error saving to db");
          console.log(error);
          res.send("THANK YOU SAFARICOM");
        });
  }).catch(()=>{
    console.log("error fetching user");
  });
});

module.exports = router;
