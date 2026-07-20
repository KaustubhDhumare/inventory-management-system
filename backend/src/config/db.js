import mongoose from "mongoose";

const connectDb = async ()=>{
    try{
        const connectionInstance   = await mongoose.connect(process.env.MONGO_URI)
        console.log(
            `Mongo DB Connected: ${connectionInstance.connection.host}`
        );
    }catch(error){
        console.error(error);
        process.exit(1);
    }
}


export default connectDb;