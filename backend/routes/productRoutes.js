import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { fileUploader } from '../middlewares/fileUploader.js';
import Category from '../models/productCategoryModel.js';
import Product from '../models/productModel.js';
import { isAuth, isAdmin } from '../utils.js';

const productRouter = express.Router();



productRouter.get('/productIds', async (req, res) => {
  const products = await Product.find({}, {_id:1});
  res.send(products);
});


productRouter.delete('/deleteCategory/:id', expressAsyncHandler(async (req, res) => {
  const {id}=req.params
  

  try {
  let deletedCat=await Category.findByIdAndDelete({_id:id})
  res.status(200).send({ message: 'Category Deleted' });
} catch (error) {
    res.status(400).send({ message: 'Something went wrong' });
  
}



}))
productRouter.get('/getAllCats', expressAsyncHandler(async (req, res) => {
  let categories=await Category.find({})
  if (categories) {
    
    res.send(categories)
  }
  else{
      res.status(404).send({ message: 'Categories Not Found' });
    
  }

}))

productRouter.post('/newCategory', expressAsyncHandler( async (req, res) => {
  const { name, subCategory,slug } = req.body
  console.log("creat cate ",req.body)

 if (!name || !slug) {
    res.status(422).send({ message: 'Insufficient Details' });
    return
  }


try {
    let newCategory = new Category({
    name,
    slug,
    subCategory:subCategory
    })
  let createdCategory=await newCategory.save()
  res.send({ message: 'Category Created' });
} catch (error) {
    res.status(400).send({ message: 'Something went wrong' });
}
}))

productRouter.put('/updateCategory/:id', expressAsyncHandler( async (req, res) => {

  const { id } = req.params
   const { name, subCategory,slug } = req.body

 if (!name || !slug) {
    res.status(422).send({ message: 'Insufficient Details' });
    return
  }


try {
    let updatedCat = await Category.findByIdAndUpdate({ _id:id },
  {name,slug,subCategory})

  res.send({ message: 'Category Updated' });

} catch (error) {
    res.status(400).send({ message: 'Something went wrong' });
}
}))







productRouter.post('/createProduct', fileUploader, expressAsyncHandler(async (req, res) => {
const files= req.filesURL
  let rating = 0
  let numReviews = 0
  const image=files?.splice(0,1)[0]
  const images = files
  
  const { name, slug, brand, category, subCategory, description, price, countInStock, productDiscountedPrice, categoryID } = req.body
 if (!name || !slug ||  !brand ||   !category  || !description || !price || !countInStock || !productDiscountedPrice || !categoryID) {
    res.status(422).send({ message: 'Insufficient Details' });
    return
  }

 try {
   let newProduct = new Product({
    name, slug, brand, category, subCategory,
    description, price, countInStock,
    productDiscountedPrice, rating, numReviews,image,images,categoryID
    })
  let createProduct=await newProduct.save()
  res.status(200).send({ message: 'Product Created' });
 
 } catch (error) {
    res.status(400).send({ message: 'Something went wrong' });
 }
  


  // else {
  //   res.status(422).send({ message: 'Insufficient Details' });

  // }

}))








productRouter.get('/', async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newProduct = new Product({
      name: 'sample name ' + Date.now(),
      slug: 'sample-name-' + Date.now(),
      image: '/images/p1.jpg',
      price: 0,
      category: 'sample category',
      brand: 'sample brand',
      countInStock: 0,
      rating: 0,
      numReviews: 0,
      productDiscountedPrice: 0,
      description: 'sample description',
    });
    const product = await newProduct.save();
    res.send({ message: 'Product Created', product });
  })
);

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  fileUploader,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const files= req.filesURL

 
    const { name, slug, brand, category, subCategory, description, price, countInStock, productDiscountedPrice, categoryID,IMAGE_STATUS} = req.body
    // console.log("body",req.body)
 if (!name || !slug ||  !brand ||   !category || !description || !price || !countInStock || !productDiscountedPrice || !categoryID) {
    res.status(422).send({ message: 'Insufficient Details' });
    return
  }
    try {
      const product = await Product.findById(req.params.id);
      let image = product.image
      let images = product.images
      if (IMAGE_STATUS === "ALL_IMAGES") {
        image = files?.splice(0, 1)[0]
        images = files
      }
      else if (IMAGE_STATUS === "ADDITIONAL_IMAGE") {
        images = files
      }
      else if (IMAGE_STATUS === "ADDITIONAL_IMAGE") {
        image = files?.splice(0, 1)[0]
      }
     
   let updateProduct = await Product.findByIdAndUpdate({_id:productId},{
    name, slug, brand, category, subCategory,
    description, price, countInStock,
    productDiscountedPrice,categoryID,image,images
    })
   res.status(200).send({ message: 'Product Updated' });
   
 } catch (error) {
      console.log(error)
       res.status(400).send({ message: 'Something went wrong' });
 }
  })
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.remove();
      res.send({ message: 'Product Deleted' });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

productRouter.post(
  '/:id/reviews',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      if (product.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }

      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((a, c) => c.rating + a, 0) /
        product.reviews.length;
      const updatedProduct = await product.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedProduct.reviews[updatedProduct.reviews.length - 1],
        numReviews: product.numReviews,
        rating: product.rating,
      });
    } else {
      res.status(404).send({ message: 'Product Not Found' });
    }
  })
);

const PAGE_SIZE = 50;

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;

    const products = await Product.find()
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    const countProducts = await Product.countDocuments();
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const subCategory = query.subCategory || '';
    const categoryID = query.categoryID || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const subCategoryFilter = subCategory && subCategory !== 'all' ? { subCategory } : {};
    const categoryIDFilter = categoryID && categoryID !== 'all' ? { categoryID } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...categoryIDFilter,
      ...subCategoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
    });
  })
);

productRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct('category');
    res.send(categories);
  })
);

productRouter.get('/slug/:slug', async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});
productRouter.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product Not Found' });
  }
});

export default productRouter;
