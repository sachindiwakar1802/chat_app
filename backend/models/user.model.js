import mongoose from "mongoose"

const userSchema  = new mongoose.Schema({
  name:{
    type:String,
  },
  userName:{
    type:String,
    required:true,
    unique:true
  },
    email:{
    type:String,
    required:true,
    unique:true
  },
  contact:{
    type:Number,
    required:true,
    unique:true
  },
   password:{
      type:String,
       required:true,
   },
   image:{
   type:String,
   default:""
   }
  }
,{timestamp:true})

// from here the above we created a schema of a use now will create a model fro the user 

// model fro this user 

const User = mongoose.model("User",userSchema)

export default User