import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { genToken } from "../config/token.js";
// SIGNUP
export const signUp = async (req,res)=>{
try{

const {userName,email,contact,password} = req.body;

// check username
const checkUserName = await User.findOne({userName});
if(checkUserName){
    return res.status(400).json({
        message:"username already exists"
    });
}

// check email
const checkEmail = await User.findOne({email});
if(checkEmail){
    return res.status(400).json({
        message:"email already exists"
    });
}

// check contact
const checkContact = await User.findOne({contact});
if(checkContact){
    return res.status(400).json({
        message:"contact already exists"
    });
}

// password validation
if(password.length < 8){
    return res.status(400).json({
        message:"password must be 8 characters"
    });
}

// hash password
const hashedPassword = await bcrypt.hash(password,10);

// create user
const user = await User.create({
    userName,
    email,
    contact,
    password:hashedPassword
});

// generate token
const token = genToken(user._id);

// cookie
res.cookie("token",token,{
    httpOnly:true,
    secure:false,
    sameSite:"strict",
    maxAge:7*24*60*60*1000
});

res.status(201).json({
    message:"signup successful",
    user
});

}catch(error){
console.log(error);
res.status(500).json({message:"server error"});
}
};



// LOGIN
export const login = async (req,res)=>{
try{

const {email,contact,password} = req.body;

// find user using email OR contact
const user = await User.findOne({
    $or:[{email},{contact}]
});

if(!user){
    return res.status(400).json({
        message:"user not found"
    });
}

// compare password
const isMatch = await bcrypt.compare(password,user.password);

if(!isMatch){
    return res.status(400).json({
        message:"invalid password"
    });
}

// generate token
const token = genToken(user._id);

res.cookie("token",token,{
    httpOnly:true,
    secure:false,
    sameSite:"strict",
    maxAge:7*24*60*60*1000
});

res.status(200).json({
    message:"login successful",
    user
});

}catch(error){
console.log(error);
res.status(500).json({message:"server error"});
}
};

// logout

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
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
};