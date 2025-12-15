const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
  console.log("Inside JWT middleware");

  // 🔴 Check token existence
  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing"
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const jwtResponse = jwt.verify(token, process.env.JWTSecretKey);

    // ✅ Attach user info to request
    req.userId = jwtResponse.id;       // user ObjectId
    req.userMail = jwtResponse.userMail;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = jwtMiddleware;
