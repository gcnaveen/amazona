

import mongoose from 'mongoose';


const slideProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  images: [String],
    brand: { type: String, required: true },
    category: { type: String, required: true },
    subCategory:{ type: String},
    sliderType: { type: String, required: true },
    description: { type: String, required: true },
    productID:{   type: String}
   
  },
  {
    timestamps: true,
  }
);
const ProductSlider = mongoose.model('ProductSlider', slideProductSchema);
export default ProductSlider;


