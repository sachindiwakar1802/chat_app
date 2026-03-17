import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { genToken } from "../config/token.js";

// SIGNUP (Email/Password)
export const signUp = async (req, res) => {
  try {
    const { userName, name, email, contact, password } = req.body;

    // Check username
    const checkUserName = await User.findOne({ userName });
    if (checkUserName) {
      return res.status(400).json({
        message: "Username already exists"
      });
    }

    // Check email
    const checkEmail = await User.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // Check contact
    const checkContact = await User.findOne({ contact });
    if (checkContact) {
      return res.status(400).json({
        message: "Contact already exists"
      });
    }

    // Password validation
    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      userName,
      name: name || "", // Optional field
      email,
      contact,
      password: hashedPassword,
      image: ""
    });

    // Generate token
    const token = genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        _id: user._id,
        userName: user.userName,
        name: user.name,
        email: user.email,
        contact: user.contact,
        image: user.image
      }
    });

  } catch (error) {
    console.log("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN (Email/Phone)
export const login = async (req, res) => {
  try {
    const { email, contact, password } = req.body;

    // Find user using email OR contact
    const user = await User.findOne({
      $or: [{ email }, { contact }]
    });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }

    // Generate token
    const token = genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        userName: user.userName,
        name: user.name,
        email: user.email,
        contact: user.contact,
        image: user.image
      },
      token
    });

  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GOOGLE AUTH (Signup/Login)
export const googleAuth = async (req, res) => {
  try {
    const { email, userName, name, googleId, image, password } = req.body;

    // Check if user exists with this email
    let user = await User.findOne({ email });

    if (user) {
      // User exists - login
      // Check if this is first time Google login for existing user
      if (!user.googleId) {
        // Update existing user with Google info
        user.googleId = googleId;
        user.image = image || user.image;
        await user.save();
      }
      
      // Generate token
      const token = genToken(user._id);

      // Set cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          userName: user.userName,
          name: user.name,
          email: user.email,
          contact: user.contact,
          image: user.image
        },
        token
      });
    }

    // Check if username is taken
    let finalUserName = userName;
    let counter = 1;
    while (await User.findOne({ userName: finalUserName })) {
      finalUserName = `${userName}${counter}`;
      counter++;
    }

    // Generate a unique dummy contact for Google users
    // Format: 1 + timestamp + random number to ensure uniqueness
    const dummyContact = parseInt(`1${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 100)}`);
    
    // Ensure dummy contact is unique
    let finalContact = dummyContact;
    while (await User.findOne({ contact: finalContact })) {
      finalContact = dummyContact + Math.floor(Math.random() * 1000);
    }

    // Hash the generated password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await User.create({
      userName: finalUserName,
      name: name || email.split('@')[0],
      email,
      contact: finalContact,
      password: hashedPassword,
      image: image || "",
      googleId
    });

    // Generate token
    const token = genToken(newUser._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json({
      message: "Signup successful",
      user: {
        _id: newUser._id,
        userName: newUser.userName,
        name: newUser.name,
        email: newUser.email,
        contact: newUser.contact,
        image: newUser.image
      },
      token
    });

  } catch (error) {
    console.log("Google auth error:", error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        message: `${field} already exists. Please try again.`
      });
    }
    
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: false
    });

    return res.status(200).json({
      message: "Logout successful"
    });

  } catch (error) {
    console.log("Logout error:", error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};