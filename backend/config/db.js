import mongoose from "mongoose";

const connectDb = async () =>{
  try{
      mongoose.connect(process.env.MONGO_URI)
      console.log("data ka base connect sachin brooooo ")
  }catch(error){
     console.log("kucch error hai bhai")
  }
}
export default connectDb