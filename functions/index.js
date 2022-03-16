const functions = require("firebase-functions");
const {initializeApp} = require("firebase-admin/app");
const {getAuth} = require("firebase-admin/auth");
const {getFirestore} = require("firebase-admin/firestore");
const cors = require("cors");
const express = require("express");

initializeApp();
const app = express();

// routes
const gameRoute = require("./routes/game");
const stpSubRoute = require("./routes/stpSubscribe");
const c2bSubRoute = require("./routes/c2bSubscribe");
const membership = require("./routes/membership");

// middleware
app.use(express.json());
app.use(cors());
app.use("/api/game", gameRoute);
app.use("/api/stp-subscribe", stpSubRoute);
app.use("/api/c2b-subscribe", c2bSubRoute);
app.use("/api/membership", membership);

// getting db ref
const db = getFirestore();

exports.app = functions.https.onRequest(app);

exports.sendWelcomeEmail = functions.auth.user().onCreate(async (user)=>{
  try {
    await getAuth().setCustomUserClaims(user.uid, {
      subscriptionEnd: undefined,
      premium: false,
    });
    console.log("new user created: ", user.email);
    return {message: "new user initiated"};
  } catch {
    console.log("Error setting custom claim for new user");
    throw new functions.https.HttpsError("internal",
        "Error setting custom claim for new user.");
  }
});

exports.addAdminRole = functions.https.onCall(async (data, context)=>{
  const email = data.email;
  if (context.auth.token.admin === true) {
    try {
      const user = await getAuth().getUserByEmail((email));
      const subscriptionEnd = user.customClaims["subscriptionEnd"];
      const premium = user.customClaims["premium"];
      const customClaims = {
        subscriptionEnd: subscriptionEnd,
        premium: premium,
        admin: true,
      };
      try {
        await getAuth().setCustomUserClaims(user.uid, customClaims);
        console.log("user has become admin", user.email);
        return {
          message: `success ${user.email} has been made an admin`,
        };
      } catch {
        throw new functions.https.HttpsError("internal",
            "Error making user admin.");
      }
    } catch {
      throw new functions.https.HttpsError("invalid-argument",
          "The function must be called with " +
        "one arguments 'Email' containing the email.");
    }
  } else {
    throw new functions.https.HttpsError("permission-denied",
        "The function must be called " + "by an Administrator.");
  }
});

exports.unsubScribeUser = functions.https.onCall(async (data, context)=>{
  if (context.auth.token.admin === true) {
    const email = data.email;

    try {
      const user = await getAuth().getUserByEmail((email));
      const admin = user.customClaims["admin"];
      const customClaims = {
        subscriptionEnd: undefined,
        premium: false,
        admin: admin,
      };
      try {
        await getAuth().setCustomUserClaims(user.uid, customClaims);
        console.log("user subscription has ended", user.email);
        return {message: "successfully usubscribed user"};
      } catch {
        throw new functions.https.HttpsError("internal",
            "Error unsubscribing user.");
      }
    } catch {
      throw new functions.https.HttpsError("invalid-argument",
          "The function must be called with " +
        "one arguments 'Email' containing the email.");
    }
  } else {
    throw new functions.https.HttpsError("permission-denied",
        "The function must be called " + "by an Administrator.");
  }
});

exports.updateSubscription = functions.https.onCall(async (data, context)=>{
  if (context.auth.token.admin === true) {
    const email = data.email;
    const days = data.days;
    try {
      const user = await getAuth().getUserByEmail((email));
      const now = new Date();
      const subEnd = new Date(now.getTime() + (1000 * 60 * 60 * 24 * days));
      const admin = user.customClaims["admin"];
      const customClaims = {
        subscriptionEnd: subEnd.toDateString(),
        premium: true,
        admin: admin,
      };
      try {
        await getAuth().setCustomUserClaims(user.uid, customClaims);
        console.log(`${days} subscription started`, user.email);
        return {message: "successfully subscribed user"};
      } catch {
        throw new functions.https.HttpsError("internal",
            "Error subscribing user.");
      }
    } catch {
      throw new functions.https.HttpsError("invalid-argument",
          "The function must be called with " +
        "one arguments 'Email' containing the email.");
    }
  } else {
    throw new functions.https.HttpsError("permission-denied",
        "The function must be called " + "by an Administrator.");
  }
});

exports.addDarajaDetails = functions.https.onCall(async (data, context)=>{
  if (context.auth.token.admin === true) {
    const email = data.email;
    const consumerKey = data.consumerKey;
    const consumerSecret = data.consumerSecret;
    const passkey = data.passkey;
    const shortCode = data.shortCode;
    try {
      const user = await getAuth().getUserByEmail((email));
      db.collection("users").
          doc(user.uid).collection("daraja").doc("darajaKeys")
          .set({
            consumerKey,
            consumerSecret,
            passkey,
            shortCode,
          }).then(() => {
            console.log("API keys added successfully");
            return {message: "API keys added successfully"};
          }).catch(() => {
            throw new functions.https.HttpsError("internal",
                "Could not add Api keys.");
          });
    } catch {
      throw new functions.https.HttpsError("invalid-argument",
          "The function must be called with " +
        "one arguments 'Email' containing the email.");
    }
  } else {
    throw new functions.https.HttpsError("permission-denied",
        "The function must be called " + "by an Administrator.");
  }
});

