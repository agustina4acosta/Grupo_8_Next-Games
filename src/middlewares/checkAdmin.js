module.exports = (req, res, next) => {
    if (!req.session.userLogin || req.session.userLogin.rol !== 1) {
      return res.redirect("/")
  }
  next()
  }