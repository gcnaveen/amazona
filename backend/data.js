import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Basir',
      email: 'admin@example.com',
      password: bcrypt.hashSync('1212'),
      isAdmin: true,
    },
    {
      name: 'John',
      email: 'user@example.com',
      password: bcrypt.hashSync('1212'),
      isAdmin: false,
    },
    {
      name: 'Mosh',
      email: 'mosh@gmail.com',
      password: bcrypt.hashSync('1212'),
      isAdmin: false,
    },
  ],
  products: [
    {
      // _id: '1',
      name: 'Nike Slim shirt',
      slug: 'nike-slim-shirt',
      category: 'Shirts',
      image:
        'https://www.empr.com/wp-content/uploads/sites/7/2021/04/Cabenuva_ViIV-860x574.jpg', // 679px × 829px
      price: 120,
      countInStock: 10,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 10,
      description: 'high quality shirt',
      productDiscountedPrice: 10,
    },
    {
      // _id: '2',
      name: 'Adidas Fit Shirt',
      slug: 'adidas-fit-shirt',
      category: 'Tablet',
      image:
        'https://images-platform.99static.com/pAdvWMCIVbla0Zm2jESUBHWsLY4=/40x30:1576x1566/500x500/top/smart/99designs-contests-attachments/119/119211/attachment_119211988',
      price: 250,
      countInStock: 0,
      brand: 'Adidas',
      rating: 4.0,
      numReviews: 10,
      productDiscountedPrice: 10,

      description: 'high quality product',
    },
    {
      // _id: '3',
      name: 'Nike Slim Pant',
      slug: 'nike-slim-pant',
      category: 'Pants',
      image:
        'https://www.empr.com/wp-content/uploads/sites/7/2021/05/Gemtesa_Urovant-Sciences-860x573.jpg',
      price: 25,
      countInStock: 15,
      brand: 'Nike',
      rating: 4.5,
      numReviews: 14,
      productDiscountedPrice: 10,

      description: 'high quality product',
    },
    {
      // _id: '4',
      name: 'Adidas Fit Pant',
      slug: 'adidas-fit-pant',
      category: 'Syrup',
      image:
        'https://www.empr.com/wp-content/uploads/sites/7/2021/04/Cabenuva_ViIV-860x574.jpg',
      price: 65,
      countInStock: 5,
      brand: 'Puma',
      rating: 4.5,
      numReviews: 10,
      productDiscountedPrice: 10,

      description: 'high quality product',
    },
  ],
  sliders: [
    {
      // _id: '11',
      name: 'Susvimo Injection',
      category: 'Injection',
      image:
        'https://www.empr.com/wp-content/uploads/sites/7/2021/10/Susvimo-Genentech-860x573.jpg',
      subCategory: [
        {
          _id: '1',
          name: 'Adidas Slim shirt',
          slug: 'adidas-slim-shirt',
          image:
            'https://www.empr.com/wp-content/uploads/sites/7/2021/03/Evkeeza-1-860x552.jpg',
          price: 120,
          countInStock: 10,
          rating: 4.5,
          numReviews: 10,
          productDiscountedPrice: 10,
        },
        {
          _id: '2',

          name: 'Nike Slim Pant',
          slug: 'nike-slim-pant',
          image:
            'https://www.empr.com/wp-content/uploads/sites/7/2021/05/Gemtesa_Urovant-Sciences-860x573.jpg',
          price: 120,
          countInStock: 10,
          rating: 4.5,
          numReviews: 10,
          productDiscountedPrice: 10,
        },
        {
          _id: '3',

          name: 'Nike Slim shirt',
          slug: 'nike-slim-shirt',

          image:
            'https://www.empr.com/wp-content/uploads/sites/7/2021/04/Cabenuva_ViIV-860x574.jpg',
          price: 120,
          countInStock: 10,
          rating: 4.5,
          numReviews: 10,
          productDiscountedPrice: 10,
        },
        {
          _id: '4',

          name: 'Nike Slim shirt',
          slug: 'nike-slim-shirt',

          image:
            'https://www.empr.com/wp-content/uploads/sites/7/2021/04/Cabenuva_ViIV-860x574.jpg',
          price: 120,
          countInStock: 10,
          rating: 4.5,
          numReviews: 10,
          productDiscountedPrice: 10,
        },
      ],

      brand: 'Nike',

      description: 'high quality shirt',
    },
    {
      // _id: '12',
      name: 'Susvimo ',
      category: 'Injection',
      image:
        'https://cardinalhealth.scene7.com/is/image/corpmarketdms7prod/image-large-cardinal-health-brand-products-chah',
      subCategory: [
        {
          // _id: '1',
          name: 'Susvimo s',
          slug: 'Susvimo-s',
          image:
            'https://www.empr.com/wp-content/uploads/sites/7/2021/03/Evkeeza-1-860x552.jpg',
          price: 120,
          countInStock: 10,
          rating: 4.5,
          numReviews: 10,
          productDiscountedPrice: 10,
        },
        {
          // _id: '2',

          name: 'Susvimo a',
          slug: 'Susvimo-a',
          image:
            'https://www.empr.com/wp-content/uploads/sites/7/2021/05/Gemtesa_Urovant-Sciences-860x573.jpg',
          price: 120,
          countInStock: 10,
          rating: 4.5,
          numReviews: 10,
          productDiscountedPrice: 10,
        },
        {
          // _id: '3',

          name: 'Susvimo n',
          slug: 'Susvimo-n',

          image:
            'https://www.empr.com/wp-content/uploads/sites/7/2021/04/Cabenuva_ViIV-860x574.jpg',
          price: 120,
          countInStock: 10,
          rating: 4.5,
          numReviews: 10,
          productDiscountedPrice: 10,
        },
        {
          // _id: '4',

          name: 'Susvimo z',
          slug: 'Susvimo-z',

          image:
            'https://www.empr.com/wp-content/uploads/sites/7/2021/04/Cabenuva_ViIV-860x574.jpg',
          price: 120,
          countInStock: 10,
          rating: 4.5,
          numReviews: 10,
          productDiscountedPrice: 10,
        },
      ],

      brand: 'Nike',

      description: 'high quality shirt',
    },
  ],
};
export default data;
