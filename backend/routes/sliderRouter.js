import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import Slider from '../models/sliderProductModel.js';
import { isAuth, isAdmin } from '../utils.js';

const sliderRouter = express.Router();

sliderRouter.get('/', async (req, res) => {
  const sliders = await Slider.find();
  res.status(200).send(sliders);
});

sliderRouter.get('/admin', isAuth, isAdmin, async (req, res) => {
  try {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || 50;
    const slides = await Slider.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countSlides = await Slider.countDocuments();
    res.status(200).send({
      slides,
      countSlides,
      page,
      pages: Math.ceil(countSlides / pageSize),
    });
    // console.log('slides', slides);
  } catch (error) {
    // console.log(error);
    res.status(404).send({ message: 'Page Not Found' });
  }
  // console.log('inside admin get:::', req);
});

sliderRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newSlider = new Slider({
      name: 'sample name ' + Date.now(),
      image: '/images/p1.jpg',
      subCategory: [
        {
          name: 'sample name ' + Date.now(),
          slug: 'sample-name-' + Date.now(),
          image: '/images/p1.jpg',
          price: 0,
          countInStock: 0,
          rating: 0,
          numReviews: 0,
          productDiscountedPrice: 0,
        },
      ],

      category: 'sample category',
      brand: 'sample brand',

      description: 'sample description',
    });
    const slider = await newSlider.save();
    res.status(200).send({ message: 'Product Created', slider });
  })
);

sliderRouter.put('/:id', isAuth, isAdmin, async (req, res) => {
  const productId = req.params.id;
  const product = await Slider.findById(productId);
  console.log('object');
  if (product) {
    product.name = req.body.name;
    // product.slug = req.body.slug;
    // product.price = req.body.price;
    product.image = req.body.image;
    product.subCategory = req.body.subCategory;
    product.category = req.body.category;
    product.brand = req.body.brand;
    // product.countInStock = req.body.countInStock;
    product.description = req.body.description;
    // product.productDiscountedPrice = req.body.productDiscountedPrice;
    await product.save();
    res.status(200).send({ message: 'Product Updated' });
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

sliderRouter.get('/:id', async (req, res) => {
  console.log(Slider);
  // const __id = data.sliders.map((slide) => {
  //   return slide.subCategory.map((ele) => ele);
  // });
  // const slider = __id[0].find((x) => x._id === req.params.id);
  // console.log(req.params.id);

  //   console.log(slider);
  const slider = await Slider.findById(req.params.id);

  if (slider) {
    res.status(200).send(slider);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

// const PAGE_SIZE = 50;

sliderRouter.get('/slug/:slug', async (req, res) => {
  // console.log(Slider);

  const _slug = data.sliders.map((slide) => {
    return slide.subCategory.map((ele) => ele);
  });
  const slider = _slug[0].find((x) => x.slug === req.params.slug);
  if (slider) {
    res.status(200).send(slider);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

sliderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Slider.findById(req.params.id);
    if (product) {
      await product.remove();
      res.status(200).send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

export default sliderRouter;
