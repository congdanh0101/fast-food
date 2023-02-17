const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res.status(401).json({
      mess: "Unauthorize",
      success: false,
    });
  try {
    const decode = jwt.verify(token, process.env.API_SECRET_KEY);
    console.log(decode);
    req.userID = decode["userID"];
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({
      message: "Access Denied!",
      error: err,
      success: false,
    });
  }
};

module.exports = verifyToken;