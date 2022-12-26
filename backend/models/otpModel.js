import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    expiredAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Otp = mongoose.model('Otp', otpSchema);
export default Otp;
