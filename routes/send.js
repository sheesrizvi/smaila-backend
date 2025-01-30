var admin = require("firebase-admin");
const express = require("express");
const router = express.Router();
const User = require("../models/userModel.js");
var serviceAccount = require("../shamila-firebase.json");
 
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// router.post("/send-notification", async (req, res) => {
//   const { token, title, body } = req.body;

//   const registrationToken = token;
//   let payload = {
//     notification: {
//       title: title,
//       body: body,
//     },
//   };

//   const options = {
//     priority: "high",
//     timeToLive: 60 * 60 * 24,
//   };

//   admin
//     .messaging()
//     .sendToDevice(registrationToken, payload, options)
//     .then(function (response) {
//       res.status(201).send(response);
//     })
//     .catch(function (error) {
//       res.status(404);
//       throw new Error(error);
//     });
// });

router.post("/send-notification-all", async (req, res) => {
  const { title, body, image } = req.body;
  const tokens = await User.find({ pushToken: { $exists: true } }).select(
    "pushToken -_id"
  );

  const registrationToken = tokens.map((item) => item.pushToken);

  const message = {
    notification: {
      title: title,
      body: body,
    },
    android: {
      notification: {
        imageUrl: image,
      },
    },
    apns: {
      payload: {
        aps: {
          "mutable-content": 1,
        },
      },
      fcm_options: {
        image: image,
      },
    },
    tokens: registrationToken,
  };

  admin
    .messaging()
    .sendMulticast(message)
    .then(function (response) {
      res.status(201).send(response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
});

module.exports = router;
