const router = require("express").Router();
const {getAuth} = require("firebase-admin/auth");

router.post("/check-membership", (req, res)=>{
  const email = req.body.email;
  getAuth().getUserByEmail((email)).then((user)=>{
    const subEndClaim = user.customClaims["subscriptionEnd"];
    const now = new Date();
    const endDate = new Date(subEndClaim);
    const diff = endDate.getTime() - now.getTime();
    console.log("days due", Math.round(diff/86400000));
    if (diff > 0) {
      const admin = user.customClaims["admin"];
      const customClaims = {
        subscriptionEnd: user.customClaims["subscriptionEnd"],
        premium: true,
        admin: admin,
      };
      getAuth().setCustomUserClaims(user.uid, customClaims).then(()=>{
        console.log("user has become or retained premium membership",
            user.email);
        res.send("successfully made or retained user's premium membership");
      }).catch(()=>{
        console.log("error making or sustaining user premium memmbership",
            user.email);
        res.status(500).send({
          code: "Internal",
          message: "error making or sustaining user premium memmbership",
        });
      });
    } else {
      const admin = user.customClaims["admin"];
      const customClaims = {
        subscriptionEnd: user.customClaims["subscriptionEnd"],
        premium: false,
        admin: admin,
      };
      getAuth().setCustomUserClaims(user.uid, customClaims).then(()=>{
        console.log("user subscription has ended", user.email);
        res.send("successfully usubscribed user");
      }).catch(()=>{
        console.log("error usubscribing user", user.email);
        res.status(500).send({
          code: "Internal",
          message: "error usubscribing user",
        });
      });
    }
  }).catch(()=>{
    console.log("error fetching user by mail");
    res.status(400).send({
      code: "Bad request",
      message: "error fetching user by mail(membership route)",
    });
  });
});


module.exports = router;
