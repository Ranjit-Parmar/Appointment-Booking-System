import User from "../models/userSchema.js";

const deductFromWallet = async ({ patientId, amount }) => {
    const patient = await User.findById(patientId);
  
    if (!patient) {
      throw new Error("Patient not found");
    }
  
    if (patient.walletBalance < amount) {
      return {
        sufficient_balance: false,
        message: "Insufficient balance",
      };
    }
  
    patient.walletBalance -= amount;
    await patient.save();
  
    return {
      sufficient_balance: true,
      message: "Amount deducted successfully",
    };
  };
  

  export default deductFromWallet;