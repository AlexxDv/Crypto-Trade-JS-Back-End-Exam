const { register, login } = require("../services/userService");
const { parseError } = require("../util/parser");

const authController = require('express').Router()

authController.get("/register", (req, res) => {
  //TODO replace with actual view by assignment

  res.render("register", { title: "Register Page" });
});

authController.post("/register", async (req, res) => {
  try {
    if (!req.body.email || !req.body.username || !req.body.password) {
      throw new Error("Please fill out all fields");
    }

    if (req.body.email.length < 10) {
      throw new Error("Email must be at least 10 characters long");
    }

    if (req.body.password.length < 5) {
      throw new Error("Password must be at least 5 characters long");
    }

    if (req.body.password != req.body.repass) {
      throw new Error("Passwords do not match");
    }

    const token = await register(
      req.body.email,
      req.body.username,
      req.body.password
    );

    res.cookie("token", token);
    res.redirect("/");
  } catch (error) {
    console.log(error);
    const errors = parseError(error);

    //TODO add error display to actual templpate from assignment
    res.render("register", {
      title: "Register Page",
      errors,
      body: {
        email: req.body.email,
        username: req.body.username,
      },
    });
  }
});

authController.get("/login", (req, res) => {
  //TODO replace with actual view by assignment
  res.render("login", { title: "Login Page" });
});

authController.post("/login", async (req, res) => {
  try {
    const token = await login(req.body.username, req.body.password);

    res.cookie("token", token);
    res.redirect("/"); //TODO replace with redirect view by assignment
  } catch (error) {
    const errors = parseError(error);

    //TODO add error display to actual templpate from assignment
    res.render("login", {
      title: "Login Page",
      errors,
      body: {
        username: req.body.username,
      },
    });
  }
});

authController.get("/logout", async (req, res) => {
  res.clearCookie('token');
  res.redirect("/"); 
})
module.exports = authController;
