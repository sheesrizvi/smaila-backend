var admin = require("firebase-admin");
const express = require("express");
const router = express.Router();

var serviceAccount = require("../shamila-firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

router.post("/send-notification", async (req, res) => {
  const { token, title, body } = req.body;

  const registrationToken = token;
  let payload = {
    notification: {
      title: title,
      body: body,
    },
  };

  const options = {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  };

  admin
    .messaging()
    .sendToDevice(registrationToken, payload, options)
    .then(function (response) {
      res.status(201).send(response);
    })
    .catch(function (error) {
      res.status(404);
      throw new Error(error);
    });
});

router.post("/send-notification-all", async (req, res) => {
  const { title, body, image } = req.body;
  const tokens = await User.find({ pushToken: { $exists: true } }).select(
    "pushToken -_id"
  );
  const user = await User.find({ pushToken: { $exists: true } }).select("_id");
  const registrationToken = tokens.map((item) => item.pushToken);
  const users = user.map((item) => item._id);

  const createNoti = async () => {
    const notification = await Notification.create({
      title,
      description: body,
      users,
    });
    if (notification) {
      console.log("success");
    } else {
      res.status(404);
      throw new Error("Error");
    }
  };

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
    .then((response) => {
      // Response is a message ID string.
      createNoti().then(() => {
        console.log("Successfully sent message:", response);
        res.json("success");
      });
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
});

module.exports = router;
