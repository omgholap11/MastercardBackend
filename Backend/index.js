import express from "express";
import {   connectMongoDB  } from "./Controllers/DBconnection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";
import donorRouter from "./Route/donor.js";
import receiverRouter from "./Route/receiver.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//database connection
connectMongoDB();

//Routers
app.use("/donor",  donorRouter);
app.use("/receiver", receiverRouter);

//Middlewares 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
