import express from "express";
const donorRouter = express.Router();

import {handleDonorSignIn , handleDonorSignUp , handleSignUpDonorViaGoogleAuth , handleDonorLogOut} from "../Controllers/donor.js";


donorRouter.post("/signin", handleDonorSignIn);

donorRouter.post("/signup", handleDonorSignUp);

// donorRouter.get("/google",passport.authenticate("google",{scope : ["profile","email"]}));

// donorRouter.get("/google/callback",passport.authenticate("google",{session : false}),handleSignUpDonorViaGoogleAuth);

donorRouter.post("/logout", handleDonorLogOut);

export default donorRouter;