const router = require("express").Router();
const {getAuth} = require("firebase-admin/auth");

router.post("/make-admin", (req, res)=>{
  const email = req.body.email;
  getAuth().getUserByEmail((email)).then((user)=>{
    const subscriptionEnd = user.customClaims["subscriptionEnd"];
    const premium = user.customClaims["premium"];
    const customClaims = {
      subscriptionEnd: subscriptionEnd,
      premium: premium,
      admin: true,
    };
    getAuth().setCustomUserClaims(user.uid, customClaims).then(()=>{
      console.log("user has become admin", user.email);
      res.send("successfully made user admin");
    }).catch((er)=>{
      console.log("error making user admin", user.email);
      console.log(JSON.stringify(er));
      throw Error("error making user admin");
    });
  }).catch((er)=>{
    console.log("error fetching user by mail");
    console.log(JSON.stringify(er));
    throw Error("error fetching user by mail");
  });
});

router.post("/unsubscribe", (req, res)=>{
  const email = req.body.email;
  getAuth().getUserByEmail((email)).then((user)=>{
    const admin = user.customClaims["admin"];
    const customClaims = {
      subscriptionEnd: undefined,
      premium: false,
      admin: admin,
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
    const admin = user.customClaims["admin"];
    const customClaims = {
      subscriptionEnd: subEnd.toDateString(),
      premium: true,
      admin: admin,
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
