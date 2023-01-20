import mongoose from 'mongoose';




const productSubCategorySchema = new mongoose.Schema(
  {
        name: { type: String, required: true },
     slug: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);




const productCategorySchema = new mongoose.Schema(
  {
        name: { type: String, required: true },
      subCategory:[productSubCategorySchema],
      
     slug: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);








const Category = mongoose.model('Category', productCategorySchema);
export default Category;
