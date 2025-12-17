const jwt = require("jsonwebtoken");

const adminJwtMiddleware = (req, res, next) => {
  console.log("Inside Admin JWT middleware");

  if (!req.headers.authorization) {
    return res.status(401).json({
      success: false,
      message: "Authorization header missing"
    });
  }

  const token = req.headers.authorization.split(" ")[1];

  try {
    const jwtResponse = jwt.verify(token, process.env.JWTSecretKey);

    // Optionally, check if the user role is admin (if role info is embedded in token)
    if (jwtResponse.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only"
      });
    }

    req.adminId = jwtResponse.id;           // Admin _id
    req.adminEmail = jwtResponse.userMail;  // Admin email

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = adminJwtMiddleware;
