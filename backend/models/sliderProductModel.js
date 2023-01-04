import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  images: [String],
  price: { type: Number, required: true },
  countInStock: { type: Number, required: true },
  productDiscountedPrice: { type: Number, required: true },
  numReviews: { type: Number, required: true },
  reviews: [reviewSchema],
});
const slideProductSchema = new mongoose.Schema(
  {
    // _id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: [categorySchema],
    description: { type: String, required: true },
    // price: { type: Number, required: true },
    // countInStock: { type: Number, required: true },
    // rating: { type: Number, required: true },
    // numReviews: { type: Number, required: true },
    // productDiscountedPrice: { type: Number, required: true },
    // reviews: [reviewSchema],
  },
  {
    timestamps: true,
  }
);

const Slider = mongoose.model('Slider', slideProductSchema);
export default Slider;
