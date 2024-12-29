import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    validate: {
      validator: (val) => validator.isEmail(val),
      message: "Please enter a valid email address",
    },
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'please enter password'],
  },
  role: {
    type: String,
    enum: ["patient", "doctor"],
    required: true,
    default: "patient",
  },
  walletBalance: { 
    type: Number, 
    default: 0 
  }
},
{ timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



const User = mongoose.model("User", userSchema);

export default User;
