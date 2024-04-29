import mongoose from "mongoose";

const connectionString = `mongodb+srv://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@access-linkedin-upgrade.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000`;

if (!connectionString) {
  throw new Error("ATTENTION: Please provide a valid connection string");
}

const connectDB = async () => {
  if (mongoose.connection?.readyState >= 1) {
    console.log("---- Already connected to MongoDB ----");
    return;
  }

  try {
    console.log("---- SUCCESS: Connecting to MongoDB ----");
    await mongoose.connect(connectionString);
  } catch (error) {
    console.error("ATTENTION: Error connecting to MongoDB", error);
  }
};

export default connectDB;

// mongodb+srv://<user>:<password>@access-linkedin-upgrade.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000
