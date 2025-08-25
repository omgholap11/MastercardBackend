import mongoose from "mongoose";
import bcrypt from "bcrypt";

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  google_id:{
 type: String, required: false
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  number: { type: String, required: true },
  address: { type: String },
  type: { type: String, enum: ["individual", "ngo", "corporate"], required: true }, 
}, { timestamps: true });




donorSchema.pre("save", async function (next) {

  const donor = this;
  if (!donor.isModified("password")) {
    return next();
  }

  const saltLength = 12;
  const hashedPassword = await bcrypt.hash(donor.password, saltLength);

  this.password = hashedPassword;

  next();
});


donorSchema.methods.comparePassword = async function (candidatePassword) {

    if (!candidatePassword) {
      throw new Error("No password provided in Compare password method!");
    }

    const user = this;
    const isMatch = await bcrypt.compare(candidatePassword, user.password);
    return isMatch;
};



const Donor = mongoose.model("Donor", donorSchema);
export default Donor;