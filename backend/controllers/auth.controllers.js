import bycrypt from "bcryptjs"

export const signUp = async (req,res) =>{

try{
  const{userName,email,password,contact}=req.body
} catch (error) {
const checkuserByUserName = await User.findOne({userName})
  if(checkuserByUserName){
    return res.status(400).json({Message:"userName already exist"
    })
  }
const checkuserByUserEmail = await User.findOne({email})
  if(checkuserByUserEmail){
    return res.status(400).json({Message:"email already exist"
    })
  }
    if(password.length<8){
        return res.status(400).json({Message:"password not less then 8"
    })
    }

    const hashedpassword=await bcrypt.hash(password,10)

    const user = await User.create({
    userName,email,password:hashedpassword,contact
    })
  const token = await genToken(user._id)
  
}
}
