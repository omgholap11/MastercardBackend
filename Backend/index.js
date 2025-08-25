import express from "express";
import {   connectMongoDB  } from "./Controllers/DBconnection.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";
import donorRouter from "./Route/donor.js";
import receiverRouter from "./Route/receiver.js";
import requestRouter from "./Route/request.js";
import donationRouter from "./Route/donation.js";
import adminRouter from "./Route/admin.js";
import tokenRouter from "./Route/token.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

//database connection
connectMongoDB();

//Middlewares (must come BEFORE routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}));

//Routers (must come AFTER middlewares)
app.use("/donor",  donorRouter);
app.use("/receiver", receiverRouter);
app.use("/request", requestRouter);
app.use("/donation", donationRouter);
app.use("/admin", adminRouter);
app.use("/token", tokenRouter);




app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
