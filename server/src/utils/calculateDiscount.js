import Discount from '../models/discountSchema.js';

const calculateDiscount = async (doctorId, patientId, consultationFee, discountPercentage) => {
  try {
    // Check if the patient has already used the discount for this doctor
    const existingUsage = await Discount.findOne({ doctorId, usedByPatientIds: patientId });

    if (existingUsage) {
      // No discount available if the patient has already used it
      return {
        discountedFee: consultationFee,
        discountApplied: false,
        discount_message: 'No discount available. First-time discount already used.',
      };
    } else {
      // Calculate the discount amount
      const discountAmount = (consultationFee * discountPercentage) / 100;
      const discountedFee = consultationFee - discountAmount;

      // Record the discount usage
      const discountUsage = new Discount({
        doctorId,
        discountAmount,
        usedByPatientIds: [patientId],
      });

      await discountUsage.save();

      return {
        discountedFee,
        discountApplied: true,
        discount_message: `Discount of ${discountPercentage}% applied successfully.`,
      };
    }
  } catch (error) {
    console.error('Error calculating discount:', error);
    throw new Error('Error calculating discount');
  }
};

export default calculateDiscount;
