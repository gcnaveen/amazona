import express from 'express';
import data from '../data.js';
import Product from '../models/productModel.js';
import Slider from '../models/sliderProductModel.js';
import User from '../models/userModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
  await Product.remove({});
  const createProducts = await Product.insertMany(data.products);
  await User.remove({});
  const createdUsers = await User.insertMany(data.users);
  await Slider.remove({});
  const createdSliders = await Slider.insertMany(data.sliders);
  res.send({ createProducts, createdUsers, createdSliders });
});
export default seedRouter;
