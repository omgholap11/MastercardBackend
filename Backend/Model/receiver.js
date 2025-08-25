import mongoose from "mongoose";
import bcrypt from "bcrypt";

const receiverSchema = new mongoose.Schema({
    google_id:{
 type: String, required: false
  },
  name: { type: String, required: true },
  email: { type: String, unique: true },
  password: { type: String, required: true },
  number: { type: String },
  address: { type: String },
  type: { type: String, enum: ["ngo", "school"], required: true }, //"hostel", "oldagehome", "community"
}, { timestamps: true });




receiverSchema.pre("save", async function (next) {

  const user = this;
  if (!user.isModified("password")) {
    return next();
  }

  const saltLength = 12;
  const hashedPassword = await bcrypt.hash(user.password, saltLength);

  this.password = hashedPassword;

  next();
});


receiverSchema.methods.comparePassword = async function (candidatePassword) {

    if (!candidatePassword) {
      throw new Error("No password provided in Compare password method!");
    }

    const user = this;
    const isMatch = await bcrypt.compare(candidatePassword, user.password);
    return isMatch;
};





const Receiver = mongoose.model("Receiver", receiverSchema);
export default Receiver;