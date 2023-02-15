const homeController = require("express").Router();

//TODO replace with real controller by assignment

homeController.get("/", (req, res) => {
  res.render("home", {
    title: "Home Page",
    user: req.user,
  });
});


homeController.get("/404", (req, res) => {
  res.render("404", {
    title: "Error Page",
    user: req.user,
  });
});
module.exports = homeController;
