function hasUser() {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect("/404");
    }
  };
}

function isGuest() {
  return (req, res, next) => {
    if (req.user) {
      res.redirect("/"); //TODO check the assignment for correct redirect path
    } else {
      next();
    }
  };
}

module.exports = {
  hasUser,
  isGuest,
};
