import Donor from "../Model/donor.js";
import { createTokenForDonor } from "../Services/authentication.js";

export const handleDonorSignUp = async (req, res) => {

    if(!req.body.name || !req.body.email || !req.body.password || !req.body.number || !req.body.address || !req.body.type) {
        return res.status(400).json({ error: "All fields are required" });
    }

    const {name , email, password, number, address, type } = req.body;

    console.log("Donor signup data: ", { name, email, password, number, address, type });

    try {
        
        const newDonor = await Donor.create({ name, email, password, number, address, type  });

        if(newDonor) {
            console.log("Donor SignUp successful:", newDonor);
            return res.status(201).json({ message: "Donor SignUp Successfull" , Donor: newDonor });
        }

        console.error("Donor SignUp failed");
        return res.status(400).json({ error: "Donor SignUp Failed" });

    } catch (error) {
        console.error("Error creating Donor:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};


export const  handleDonorSignIn = async (req,res) =>{

    if(!req.body.email || !req.body.password) {
        return res.status(400).json({ error: "Email and Password are required" });
    }

    const { email, password } = req.body;
    console.log("Donor signin data: ", { email, password });

    try {

        const existingDonor = await Donor.findOne({ email });

        if(!existingDonor) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isPasswordMatch = await existingDonor.comparePassword(password);


        if(!isPasswordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = createTokenForDonor(existingDonor);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, 
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000 
        });

        console.log("Donor SignIn successful:", existingDonor);
        return res.status(200).json({ message: "Donor SignIn Successfull", Donor: existingDonor });

    } catch (error) {
        console.error("Error during Donor sign-in:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}



export const handleSignUpDonorViaGoogleAuth = async (req, res) => {
  try {
    const Donor = req.Donor; // Comes from Passport Google OAuth 

    if (!Donor) {
      return res.redirect('http://localhost:5173/login?error=oauth_failed');
    }

    const token = createTokenForDonor(Donor);

   
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


export const handleDonorLogOut = (req, res) => {

  res.clearCookie("token");

  return res.status(200).json({ msg: "Donor logged out successfully" });
  
};


