import express from "express";
import { getTokenDetails } from "../Controllers/token.js";

const tokenRouter = express.Router();

// Get token details and user role
tokenRouter.get("/details", getTokenDetails);

export default tokenRouter;
