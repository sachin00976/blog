import mongoose from "mongoose";


const dbConnect=async ()=>{
    try {
        const connectionInstance= await mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}`)
        if(connectionInstance)
        {
            console.log(`DB CONNECTED || HOST: ${connectionInstance.connection.host} || DB: ${connectionInstance.connection.name}`);
        }
        else
        {
            throw new Error("error occur while connecting to db")
        }
    } catch (error) {
        console.log("ERROR WHILE CONNECTING TO DB: "+`${error.message}`)
        process.exit(1)
    }
}

export {dbConnect}