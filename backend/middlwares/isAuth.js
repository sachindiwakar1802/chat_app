const isAuth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Token not found" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user info to request
    req.userId = decoded.userId;
    next(); // move to next middleware/controller
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
