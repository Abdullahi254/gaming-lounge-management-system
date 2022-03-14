const {getFirestore} = require("firebase-admin/firestore");
const {getAuth} = require("firebase-admin/auth");

// getting db ref
const db = getFirestore();

const getApiKeys = ( req, res, next)=> {
  const email = req.body.email;
  getAuth().getUserByEmail(email).then((user)=>{
    console.log(`${user.uid} found successfully`);
    const docRef = db.collection("users").doc(user.uid).
        collection("daraja").doc("darajaKeys");
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
        res.status(400).send({
          code: "Bad request",
          message: "error doc with api keys does not exist",
        });
      }
    }).catch(()=>{
      console.log("error fetching daraja api keys");
      res.status(500).send({
        code: "Internal",
        message: "error fetching daraja api keys",
      });
    });
  }).catch(()=>{
    console.log("error fetching user by email");
    res.status(400).send({
      code: "Bad request",
      message: "error fetching user by email(daraja middleware)",
    });
  });
};

module.exports = getApiKeys;
