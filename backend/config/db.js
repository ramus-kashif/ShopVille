import mongoose from "mongoose";


const connectDB = async () => {
  try {
    const con = await mongoose.connect(`${process.env.MONGO_URL}`);
    console.log(`Connected to MongoDB ${con.connection.host}`.bgBlue);
  } catch (error) {
    console.log(`Mongoose Connection Error - ${error}`);
  }
};

export default connectDB;
