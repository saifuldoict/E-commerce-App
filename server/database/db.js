import mongoose from "mongoose"
const connectDB =async()=>{
    try{
     await mongoose.connect(`${process.env.MONGO_URI}/E-com`)
     console.log('MongoDB connected successfully');
    }catch(err){
        console.log('MongoDb connection error', err);
    }
}
export default connectDB;