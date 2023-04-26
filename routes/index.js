var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  if (!req.app.locals.authed) {
    const url = req.app.locals.oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/userinfo.profile",
    });
    console.log("Url problems.");
    console.log(url);
    res.redirect(url);
  } else {
    var oauth2 = app.locals.google.oauth2({
      auth: oAuth2Client,
      version: "v2",
    });
    oauth2.userinfo.get(function (err, response) {
      if (err) {
        console.log("Error.");
        console.log(err);
      } else {
        console.log("Response data.");
        console.log(response.data);
        res.render("index", { title: "Express", user: response.data });
      }
    });
  }
});

router.get("/auth/google/callback", function (req, res) {
  const code = req.query.code;
  if (code) {
    req.app.locals.oAuth2Client.getToken(code, function (err, tokens) {
      if (err) {
        console.log("Error authenticating");
        console.log(err);
      } else {
        console.log("Successfully authenticated");
        console.log(tokens);
        req.app.locals.oAuth2Client.setCredentials(tokens);
        req.app.locals.authed = true;
        res.redirect("/");
      }
    });
  }
});

module.exports = router;
