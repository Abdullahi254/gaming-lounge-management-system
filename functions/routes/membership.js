const router = require("express").Router();
const {getAuth} = require("firebase-admin/auth");

router.post("/check-membership", (req, res)=>{
  const email = req.body.email;
  getAuth().getUserByEmail((email)).then((user)=>{
    const subEndClaim = user.customClaims["subscriptionEnd"];
    console.log("subscription end date", subEndClaim);
    const now = new Date();
    const endDate = new Date(subEndClaim);
    const diff = endDate.getTime() - now.getTime();
    console.log("days due", Math.round(diff/86400000));
    if (diff > 0) {
      const customClaims = {
        subscriptionEnd: user.customClaims["subscriptionEnd"],
        premium: true,
      };
      getAuth().setCustomUserClaims(user.uid, customClaims).then(()=>{
        console.log("user has become or retained premium membership",
            user.email);
        res.send("successfully made or retained user's premium membership");
      }).catch((er)=>{
        console.log("error making or sustaining user premium memmbership",
            user.email);
        console.log(JSON.stringify(er));
        throw Error("error making or sustaining user premium membership");
      });
    } else {
      const customClaims = {
        subscriptionEnd: user.customClaims["subscriptionEnd"],
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
    }
  }).catch((er)=>{
    console.log("error fetching user by mail");
    console.log(JSON.stringify(er));
    throw Error("error fetching user by mail");
  });
});


module.exports = router;
