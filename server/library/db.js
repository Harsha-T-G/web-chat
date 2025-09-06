import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("DataBase Connected");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/Web-chat`);
  } catch (error) {
    console.log(error);
  }
};
