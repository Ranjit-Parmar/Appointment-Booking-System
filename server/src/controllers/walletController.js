import User from "../models/userSchema.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";

// Add amount to the wallet

export const addToWallet = asyncErrorHandler(async (req, res, next) => {
  const { patientId, amount } = req.body;

  const patient = await User.findById(patientId);

  patient.walletBalance += amount;
  await patient.save();

  res.status(200).json({
    success: true,
    message: "Amount added successfully",
  });
});
