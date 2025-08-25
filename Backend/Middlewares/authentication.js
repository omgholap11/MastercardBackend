import {validateTokenForDonor , validateTokenForReceiver , createTokenForDonor , createTokenForReceiver} from "../Services/authentication.js"

export function checkForAuthenticationCookieDonor(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue = req.cookies[cookieName];
        console.log("Token cookie value: ",tokenCookieValue);
        
        if(!tokenCookieValue)
        {
            return res.status(401).json({ error: "Authentication token missing" });
        }

        try{
            const donorPayload = validateTokenForDonor(tokenCookieValue);
            req.user = donorPayload;
        }catch(error)
        {
            console.log("Error in middleware while checking token!",error);
        }
        next();
    }
}

export function checkForAuthenticationCookieForReceiver(cookieName){
    return (req,res,next)=>{
        const tokenCookieValue = req.cookies[cookieName];
        console.log("Token cookie value: ",tokenCookieValue);
        
        if(!tokenCookieValue)
        {
            return res.status(401).json({ error: "Authentication token missing" });
        }

        try{
            const receiverPayload = validateTokenForReceiver(tokenCookieValue);
            req.user = receiverPayload;
        }catch(error)
        {
            console.log("Error in middleware while checking token!",error);
        }
        next();
    }
}