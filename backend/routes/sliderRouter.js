import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../data.js';
import { fileUploader } from '../middlewares/fileUploader.js';
import ProductSlider from '../models/SliderModel.js';
import Slider from '../models/sliderProductModel.js';
import { isAuth, isAdmin } from '../utils.js';

const sliderRouter = express.Router();







sliderRouter.get('/', async (req, res) => {
  const sliders = await ProductSlider.find();
  res.status(200).send(sliders);
});



sliderRouter.get('/admin', isAuth, isAdmin, async (req, res) => {
  try {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || 50;
    const slides = await ProductSlider.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countSlides = await ProductSlider.countDocuments();
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



sliderRouter.post('/createSlider', fileUploader, expressAsyncHandler(async (req, res) => {
const {name,brand,category,subCategory,productID,description,sliderType}=req.body

  console.log(req.body)
    if (!name || !brand || !category  || !description) {
      res.status(422).send({ message: 'Insufficient Details' });
      return
  }

  try {
      const newSlider = new ProductSlider({
      name,brand,category,subCategory,productID,description,sliderType,images:req.filesURL
    })
  
    const slider = await newSlider.save();
    res.status(200).send({ message: 'Slider Created', slider });
  } catch (error) {
    console.log(error)
    res.status(422).send({ message: 'Insufficient Details' });
  }
  }))











// sliderRouter.post(
//   '/',
//   isAuth,
//   isAdmin,
//   expressAsyncHandler(async (req, res) => {
//     const newSlider = new Slider({
//       name: 'sample name ' + Date.now(),
//       image: '/images/p1.jpg',
//       subCategory: [
//         {
//           name: 'sample name ' + Date.now(),
//           slug: 'sample-name-' + Date.now(),
//           image: '/images/p1.jpg',
//           price: 0,
//           countInStock: 0,
//           rating: 0,
//           numReviews: 0,
//           productDiscountedPrice: 0,
//         },
//       ],

//       category: 'sample category',
//       brand: 'sample brand',

//       description: 'sample description',
//     });
//     const slider = await newSlider.save();
//     res.status(200).send({ message: 'Product Created', slider });
//   })
// );


// update slider by id
sliderRouter.put('/:id', isAuth, isAdmin, async (req, res) => {
  const sliderID = req.params.id;
  const { name, brand, category, subCategory, productID, description,sliderType } = req.body
  if (!name || !brand || !category || !description) {
    res.status(422).send({ message: 'Insufficient Details' });
    return
  }

 try {
   const product = await ProductSlider.findById(sliderID);
   if (product) {
     let updatedSlider = await ProductSlider.findByIdAndUpdate({ _id: sliderID }, {
       name, brand, category, subCategory, productID, description,sliderType
     })
     res.status(200).send({ message: 'Slider Updated', updatedSlider });
   }
      // const slider = await updatedSlider.save();
 } catch (error) {
  
   res.status(404).send({ message: 'Product Not Found' });
 }

});

sliderRouter.get('/:id', async (req, res) => {
  // const __id = data.sliders.map((slide) => {
  //   return slide.subCategory.map((ele) => ele);
  // });
  // const slider = __id[0].find((x) => x._id === req.params.id);
  // console.log(req.params.id);

  //   console.log(slider);
  const slider = await ProductSlider.findById(req.params.id);

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
    const product = await ProductSlider.findById(req.params.id);
    if (product) {
      await product.remove();
      res.status(200).send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);






export default sliderRouter;
