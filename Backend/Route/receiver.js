import express from "express";
const receiverRouter = express.Router();

import {handleReceiverSignIn  , handleReceiverSignUp , handleReceiverLogOut} from "../Controllers/receiver.js";


receiverRouter.post("/signin", handleReceiverSignIn);

receiverRouter.post("/signup", handleReceiverSignUp);

// receiverRouter.get("/profile",);

receiverRouter.post("/logout", handleReceiverLogOut);

export default receiverRouter;