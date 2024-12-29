import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        await  mongoose.connect(process.env.MONGODB_CONNECTION_STRING,{
            dbName: "Appoinment_Booking_App",
         })
         console.log("database connected successfully");
    } catch (error) {
        console.log("error connecting database", error);
        process.exit(1);
    }
}
