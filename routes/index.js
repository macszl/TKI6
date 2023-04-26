var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  if (!authed) {
    res.render("index");
  } else {
    var oauth2 = google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    });
    oauth2.userinfo.get(function (err, response) {
      if (err) {
        console.log("Error receiving response.");
        console.log(err);
      } else {
        console.log("Response data.");
        console.log(response.data);
        res.render("loggedin", { title: "Express", user: response.data });
      }
    });
  }
});

router.get("/login", function (req, res, next) {
  console.log("Authed: " + authed);
  console.log("Oauth2Client: " + oAuth2Client);
  console.log("Google: " + google);
  try {
    if (!authed) {
      const url = oAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/userinfo.profile",
      });
      console.log("Url received.");
      console.log(url);
      res.redirect(url);
    } else {
      var oauth2 = google.oauth2({
        auth: oAuth2Client,
        version: "v2",
      });
      oauth2.userinfo.get(function (err, response) {
        if (err) {
          console.log("Error receiving response.");
          console.log(err);
        } else {
          console.log("Response data.");
          console.log(response.data);
          res.render("loggedin", { title: "Express", user: response.data });
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/logout", function (req, res) {
  try {
    console.log("logging out");
    authed = false;
    oAuth2Client.setCredentials(null);
    res.redirect("/");
  } catch (err) {
    console.log("logout failed");
    console.log(err);
  }
});

router.get("/auth/google/callback", function (req, res) {
  try {
    const code = req.query.code;
    if (code) {
      oAuth2Client.getToken(code, function (err, tokens) {
        if (err) {
          console.log("Error authenticating");
          console.log(err);
        } else {
          console.log("Successfully authenticated");
          console.log(tokens);
          oAuth2Client.setCredentials(tokens);
          authed = true;
          res.redirect("/login");
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
