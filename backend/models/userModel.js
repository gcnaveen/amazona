import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, require: true, unique: true },
    isAdmin: { type: Boolean, default: false, required: true },
    isActive:{type:Boolean,default:true}
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
