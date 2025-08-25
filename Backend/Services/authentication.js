import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export function  createTokenForDonor(donor){

    const payload = {
        userId : donor._id,
        role : "donor",
    }

    const token = JWT.sign(payload , JWT_SECRET);
    return token ;
}

export function validateTokenForDonor(token){
    const payload = JWT.verify(token , JWT_SECRET);
    return payload;
}

export function  createTokenForReceiver(receiver){

    const payload = {
        userId : receiver._id,
        role : "receiver",
    }

    const token = JWT.sign(payload , JWT_SECRET);
    return token ;
}

export function validateTokenForReceiver(token){
    const payload = JWT.verify(token , JWT_SECRET);
    return payload;
}
