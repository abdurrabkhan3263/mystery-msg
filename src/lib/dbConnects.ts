import mongoose from "mongoose";

// ! --> ConnectionObject  is optional if you not add not any problem but in type script we have to say what type of data came

type ConnectionObject = {
  isConnected?: number; // ?: --> this means isConnected value is optional means it is not always return this
};

const connection: ConnectionObject = {};

// dbConnect():Promise --> Means it will return a promise and inside the promise we does not know what came so we are writing void

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already Connected to database");
    return;
  }
  try {
    const db = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}` || ""
    );
    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("Database connection failed:- ", error);
    process.exit(1);
  }
}

export default dbConnect;
