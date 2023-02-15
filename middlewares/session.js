const { verifyToken } = require("../services/userService");

module.exports = () => (req, res, next) => {
  const token = req.cookies["token"];
  if (token) {
    // console.log(token);
    try {
      const userData = verifyToken(token);
      //  console.log("Read seccessful, user", userData.username);
       req.user = userData
       res.locals.username = userData.username
    } catch (err) {
      console.log("Invalid token");
      res.clearCookie("token");
      res.redirect("/404");
      return
    }
  }
  next();
};
