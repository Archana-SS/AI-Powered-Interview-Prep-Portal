/*const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        console.log("Incoming Token:", req.headers.authorization);

if (token && token.startsWith("Bearer")) {
  token = token.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log("Decoded Token:", decoded);

  req.user = await User.findById(decoded.id).select("-password");
  console.log("Authenticated User:", req.user);
}


        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        }else{
            res.status(401).json({ message: "Not authorized, no token" });
        }
    }catch (error) {
        res.status(401).json({ message: "Token failed", error: error.message });
    }
};

module.exports = { protect };*/

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log("Incoming Token:", token);

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded Token:", decoded);

      const userId = decoded.id || decoded._id; // handle either case
      if (!userId) {
        return res.status(401).json({ message: "Invalid token payload" });
      }
      let user = await User.findById(userId).select("-password");

      if (!user) {
        console.log("User not found in DB. Creating new user...");

        // Basic fallback creation – you can enhance with decoded.name/email later
        user = await User.create({
          _id: userId, // Use the same ID as in the token
          name: "SSO User",
          email: `user${userId.slice(-4)}@sso.com`,
          password: "sso", // Not used — placeholder
          profileImageUrl: "",
          isSSO: true, // Optional flag for tracking
        });

        console.log("New SSO user created:", user);
      }

      req.user = user;
      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

module.exports = { protect };
