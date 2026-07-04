module.exports = function (req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ error: "Not logged in" });

  req.userId = token.replace("Bearer ", "");
  next();
};
