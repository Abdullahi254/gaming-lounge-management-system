const router = require("express").Router();
const {getAuth} = require("firebase-admin/auth");

router.post("/unsubscribe", (req, res)=>{
  const email = req.body.email;
  getAuth().getUserByEmail((email)).then((user)=>{
    const customClaims = {
      subscriptionEnd: undefined,
      premium: false,
    };
    getAuth().setCustomUserClaims(user.uid, customClaims).then(()=>{
      console.log("user subscription has ended", user.email);
      res.send("successfully usubscribed user");
    }).catch((er)=>{
      console.log("error usubscribing user", user.email);
      console.log(JSON.stringify(er));
      throw Error("error usubscribing user");
    });
  }).catch((er)=>{
    console.log("error fetching user by mail");
    console.log(JSON.stringify(er));
    throw Error("error fetching user by mail");
  });
});

router.post("/subscribe-specify-days", (req, res)=>{
  const email = req.body.email;
  const days = req.body.days;
  getAuth().getUserByEmail((email)).then((user)=>{
    const now = new Date();
    const subEnd = new Date(now.getTime() + (1000 * 60 * 60 * 24 * days));
    const customClaims = {
      subscriptionEnd: subEnd.toDateString(),
      premium: true,
    };
    getAuth().setCustomUserClaims(user.uid, customClaims).then(()=>{
      console.log("one minute subscription started", user.email);
      res.send("successfully subscribed user");
    }).catch((er)=>{
      console.log("error subscribing user", user.email);
      console.log(JSON.stringify(er));
      throw Error("error subscribing user");
    });
  }).catch((er)=>{
    console.log("error fetching user by mail");
    console.log(JSON.stringify(er));
    throw Error("error fetching user by mail");
  });
});

module.exports = router;
