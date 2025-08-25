import { validateTokenForDonor, validateTokenForReceiver } from "../Services/authentication.js";

export function getTokenDetails(req,res){
    // Check for token in cookies first, then Authorization header
    let token = req.cookies["token"];
    
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove 'Bearer ' prefix
        }
    }
    
    if(!token)
    {
        return res.status(401).json({error : "User is not Authenticated!!!" , role : null});
    }
    
    try{
        // Try to validate as donor first, then as receiver
        let userPayload;
        try {
            userPayload = validateTokenForDonor(token);
        } catch (donorError) {
            try {
                userPayload = validateTokenForReceiver(token);
            } catch (receiverError) {
                throw new Error("Invalid token");
            }
        }
        
        req.user = userPayload;
        console.log(userPayload);
        return res.status(200).json({
            msg: "Success", 
            role: userPayload.role, 
            userId: userPayload.userId
        });
    }catch(error)
    {
        console.log("Error in middleware while checking token!",error);
        return res.status(401).json({error : "Error Occured in accessing token details!", role: null});
    }
}

