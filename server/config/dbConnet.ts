import mongoose from "mongoose";

export const dbConnect = async () => {
  try {
    let connectionString = "";
    if (process.env.NODE_ENV === "development")
      connectionString = process.env.MONGODB_URI_LOCAL!;
    if (process.env.NODE_ENV === "production")
      connectionString = process.env.MONGODB_URI!;

    mongoose.connect(connectionString).then(() => {
      console.log("database is connected.");
    });
  } catch (error) {
    console.log("Error on connecting database", error);
  }
};
