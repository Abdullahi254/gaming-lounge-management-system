const functions = require("firebase-functions");
const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const cors = require("cors");
const express = require("express");

initializeApp();
const app = express();

// routes
const gameRoute = require("./routes/game");
const subRoute = require("./routes/subscribe");
const membership = require("./routes/membership");

// middleware
app.use(express.json());
app.use(cors());
app.use("/api/game", gameRoute);
app.use("/api/subscribe", subRoute);
app.use("/api/membership", membership);

exports.app = functions.https.onRequest(app);

exports.sendWelcomeEmail = functions.auth.user().onCreate((user)=>{
  getAuth().setCustomUserClaims(user.uid, {
    subscriptionEnd: undefined,
    premium: false,
  }).then(()=>{
    console.log("new user created: ", user.email);
  }).catch((er)=>{
    console.log("error setting custom claim for new user");
    console.log(JSON.stringify(er));
  });
});

exports.addAdminRole = functions.https.onCall((data, context)=>{
  const email = data.email;
  if (context.auth.token.admin === true) {
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
        return {
          message: `success ${user.email} has been made an admin`,
        };
      }).catch(()=>{
        throw new functions.https.HttpsError("internal",
            "Error making user admin.");
      });
    }).catch(()=>{
      throw new functions.https.HttpsError("invalid-argument",
          "The function must be called with " +
            "one arguments 'Email' containing the email to unsubscribe");
    });
  } else {
    throw new functions.https.HttpsError("permission-denied",
        "The function must be called " + "by an Administrator.");
  }
});

exports.unsubScribeUser = functions.https.onCall((data, context)=>{
  if (context.auth.token.admin === true) {
    const email = data.email;
    getAuth().getUserByEmail((email)).then((user)=>{
      const admin = user.customClaims["admin"];
      const customClaims = {
        subscriptionEnd: undefined,
        premium: false,
        admin: admin,
      };
      getAuth().setCustomUserClaims(user.uid, customClaims).then(()=>{
        console.log("user subscription has ended", user.email);
        return {message: "successfully usubscribed user"};
      }).catch(()=>{
        throw new functions.https.HttpsError("internal",
            "Error unsubscribing user.");
      });
    }).catch(()=>{
      throw new functions.https.HttpsError("invalid-argument",
          "The function must be called with " +
            "one arguments 'Email' containing the email to unsubscribe");
    });
  } else {
    throw new functions.https.HttpsError("permission-denied",
        "The function must be called " + "by an Administrator.");
  }
});

exports.updateSubscription = functions.https.onCall((data, context)=>{
  if (context.auth.token.admin === true) {
    const email = data.email;
    const days = data.days;
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
        console.log(`${days} subscription started`, user.email);
        return {message: "successfully subscribed user"};
      }).catch(()=>{
        throw new functions.https.HttpsError("internal",
            "Error subscribing user.");
      });
    }).catch(()=>{
      throw new functions.https.HttpsError("invalid-argument",
          "The function must be called with " +
            "one arguments 'Email' containing the email to unsubscribe");
    });
  } else {
    throw new functions.https.HttpsError("permission-denied",
        "The function must be called " + "by an Administrator.");
  }
});

