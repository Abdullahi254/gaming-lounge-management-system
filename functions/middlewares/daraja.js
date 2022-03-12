const {getFirestore} = require("firebase-admin/firestore");
const {getAuth} = require("firebase-admin/auth");

// getting db ref
const db = getFirestore();

const getApiKeys = ( req, res, next)=> {
  const email = req.body.email;
  getAuth().getUserByEmail(email).then((user)=>{
    console.log(`${user.uid} found successfully`);
    const docRef = db.collection("users").doc(user.uid).
        collection("consoles").doc("darajaKeys");
    docRef.get().then((doc) => {
      if (doc.exists) {
        console.log("found daraja keys");
        req.userid = user.uid;
        req.consumerKey = doc.data().consumerKey;
        req.consumerSecret = doc.data().consumerSecret;
        req.passkey = doc.data().passkey;
        req.shortCode = doc.data().shortCode;
        next();
      } else {
        console.log("error doc with api keys does not exist");
        return res.status(500).send("error doc with api keys does not exist");
      }
    }).catch(()=>{
      console.log("error fetching daraja api keys");
      res.status(500).
          send("error fetching daraja api keys from db");
    });
  }).catch(()=>{
    console.log("error fetching user by email");
    res.status(500).
        send("error fetching user email");
  });
};

module.exports = getApiKeys;
