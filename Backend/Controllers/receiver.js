import Receiver from "../Model/receiver.js";

import { createTokenForReceiver } from "../Services/authentication.js";

export const handleReceiverSignUp = async (req, res) => {

    if(!req.body.name || !req.body.email || !req.body.password || !req.body.number || !req.body.address || !req.body.type) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const {name , email, password, number, address, type } = req.body;

    console.log("Receiver signup data: ", { name, email, password, number, address, type });

    try {
        
        const newReceiver = await Receiver.create({ name, email, password, number, address, type  });

        if(newReceiver) {
            console.log("Receiver SignUp successful:", newReceiver);
            return res.status(201).json({ message: "Receiver SignUp Successfull" , Receiver: newReceiver });
        }

        console.error("Receiver SignUp failed");
        return res.status(400).json({ error: "Receiver SignUp Failed" });

    } catch (error) {
        console.error("Error creating Receiver:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const  handleReceiverSignIn = async (req,res) =>{

    if(!req.body.email || !req.body.password) {
        return res.status(400).json({ error: "Email and Password are required" });
    }

    const { email, password } = req.body;
    console.log("Receiver signin data: ", { email, password });

    try {

        const existingReceiver = await Receiver.findOne({ email });

        if(!existingReceiver) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isPasswordMatch = await existingReceiver.comparePassword(password);


        if(!isPasswordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = createTokenForReceiver(existingReceiver);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000 
        });

        console.log("Receiver SignIn successful:", existingReceiver);
        return res.status(200).json({ message: "Receiver SignIn Successfull", Receiver: existingReceiver });

    } catch (error) {
        console.error("Error during Receiver sign-in:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}



export const handleSignUpReceiverViaGoogleAuth = async (req, res) => {
  try {
    const Receiver = req.Receiver; // Comes from Passport Google OAuth 

    if (!Receiver) {
      return res.redirect('http://localhost:5173/login?error=oauth_failed');
    }

    const token = createTokenForReceiver(Receiver);

   
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,    // Set to true in production with HTTPS
      sameSite: "Lax",
      maxAge: 72 * 60 * 60 * 1000, // 3 days
    });

    // Redirect to frontend dashboard or callback page
    return res.redirect('http://localhost:5173/');
    
  }
   catch (err) {
    console.error("OAuth signup error:", err);
    return res.redirect('http://localhost:5173/login?error=oauth_failed');
  }

}


export const handleReceiverLogOut = (req, res) => {

  res.clearCookie("token");

  return res.status(200).json({ msg: "Receiver logged out successfully" });
  
};


