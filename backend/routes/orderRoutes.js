import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import { isAuth, isAdmin, mailgun, payOrderEmailTemplate } from '../utils.js';

const orderRouter = express.Router();

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find().populate('user', 'name');
    res.send(orders);
  })
);

orderRouter.post(
  '/',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const newOrder = new Order({
      orderItems: req.body.orderItems.map((x) => ({ ...x, product: x._id })),
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const order = await newOrder.save();
    res.status(201).send({ message: 'New Order Created', order });
  })
);


orderRouter.get('/handleOrder/:id/:type',isAuth,isAdmin, expressAsyncHandler(async (req, res) => {
  let { id,type } = req.params

    if (type === 'ACCEPTED') {
    let orderStatus = await Order.findByIdAndUpdate( { _id: id } , {
      isOrderAccepted:true
    })
   res.send({ message: 'Order Status Updated' });

  }
  else   if (type === 'REJECTED') {
    let  orderStatus= await Order.findByIdAndUpdate( { _id: id } , {
      isOrderRejected:true
    })
   res.send({ message: 'Order Status Updated' });

  }
  
}))





orderRouter.patch('/updateStatus/:id',isAuth, isAdmin,expressAsyncHandler(async (req, res) => { 
  let { id } = req.params
  let {status}=req.body
  if (status === 'dispatch') {
    let updateDispatchStatus = await Order.findByIdAndUpdate( { _id: id } , {
      isDispatched:true
    })
   res.send({ message: 'Order Status Updated' });

  }
  
  if (status === 'outForDelivery') {
    let updateOutForDeliveryStatus = await Order.findByIdAndUpdate({ _id: id }, {
      isOutForDelivery:true
    })
   res.send({ message: 'Order Status Updated' });

  }
  
  if (status === 'delivered') {
    const currentTime=Date.now()
    let updateDeliveredStatus = await Order.findByIdAndUpdate({ _id: id }, {
      isDelivered: true,
        deliveredAt:currentTime
    })
   res.send({ message: 'Order Status Updated' });

  }
}))

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const orderStatus = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
           isOrderAccepted:{ $push : "$isOrderAccepted"},
           isCancelled:{ $push : "$isCancelled"},
           isOrderRejected:{ $push : "$isOrderRejected"},
           isDelivered:{ $push : "$isDelivered"},
           isDispatched:{ $push : "$isDispatched"},
           isOutForDelivery:{ $push : "$isOutForDelivery"},
        },
      },
    ]);


    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories,orderStatus });
  })
);

orderRouter.get(
  '/mine',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.send(orders);
  })
);

orderRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);


//get user single product using this api to pop up address in edit address
orderRouter.get(
  '/order/:id',isAuth,expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      res.send(order);
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

// cancel order Request
orderRouter.get(
  '/cancel/:id',isAuth,expressAsyncHandler(async (req, res) => {
    const order = await Order.findByIdAndUpdate({ _id: req.params.id }, {
      isCancelled:true
    });
    if (order) {
      console.log(order)
      res.send({message:"Order Cancelled Successfully"});
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
// mark as read
orderRouter.get(
  '/markAsRead/:id',isAuth,expressAsyncHandler(async (req, res) => {
    const order = await Order.findByIdAndUpdate({ _id: req.params.id }, {
      isRead:true
    });
    if (order) {
      res.send({message:"Order Status Updated"});
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/deliver',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    console.log(order);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      await order.save();
      res.send({ message: 'Order Delivered' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

orderRouter.put(
  '/:id/address',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    console.log('order', req.params);
    console.log('data', req.body);
    const {fullName,address,city,postalCode,country,location}=req.body

    try {
      const order = await Order.findById(req.params.id);
      console.log('order', order);
      if (order) {
        order.shippingAddress = {
         fullName,address, city, country, postalCode,
          location: { lat: location.lat, lng:location.lng}
        };

        await order.save();
        res.send({ message: 'Edited Successfully' });
      } else {
        res.status(404).send({ message: 'Order Not Found' });
      }
    } catch (error) {
      console.log(error);
    }
  })
);

orderRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      mailgun()
        .messages()
        .send(
          {
            from: 'Amazona <amazona@mg.yourdomain.com>',
            to: `${order.user.name} <${order.user.email}> `,
            subject: `New order ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );

      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);
const PAGE_SIZE = 50;
orderRouter.get(
  '/search',
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const category = query.category || '';
    const price = query.price || '';
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
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const orders = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);

    const countOrders = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      orders,
      countOrders,
      page,
      pages: Math.ceil(countOrders / pageSize),
    });
  })
);
orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.remove();
      res.send({ message: 'Order Deleted' });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

export default orderRouter;
