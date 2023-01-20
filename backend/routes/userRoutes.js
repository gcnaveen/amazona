import express from 'express';
import bcrypt from 'bcryptjs';
import expressAsyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import { isAuth, isAdmin, generateToken } from '../utils.js';
import Otp from '../models/otpModel.js';
import { passwordResetMail } from '../emailConfig.js';

const userRouter = express.Router();

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({ isAdmin: "false" });
    res.send(users);
  })
);

userRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      if (bcrypt.compareSync(req.body.oldPassword, user.password)) {
  
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
          user.password = bcrypt.hashSync(req.body.password, 8);
        }
        user.phone = req.body.phone || user.phone;
  
        const updatedUser = await user.save();
        res.send({
          _id: updatedUser._id,
          phone: updatedUser.phone,
          name: updatedUser.name,
          email: updatedUser.email,
          isAdmin: updatedUser.isAdmin,
          token: generateToken(updatedUser),
        });
      }
      else {
          res.status(404).send({ message: 'Invalid Password' });
      }
    } else {
      res.status(404).send({ message: 'User not found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.isAdmin = Boolean(req.body.isAdmin);
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);




userRouter.patch('/updateUserStatus',  isAuth,isAdmin, expressAsyncHandler(async  (req, res) => {
  
  let { userID, status } = req.body
  let user = await User.findByIdAndUpdate({ _id: userID }, {
    isActive:!status
  })

  if (user) {
    res.send({message:"Status Updated",status:user.isActive})
  }
  

}) )


userRouter.put(
  '/reset-password',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      await user.remove();
      res.send({ message: 'User Deleted' });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);
userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (!user.isActive) {
        console.log("In Active")
         res.status(401).send({ message: 'Your account has been blocked' });
        return
}
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/signup',
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: bcrypt.hashSync(req.body.password),
    });
    const user = await newUser.save();
    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.post(
  '/email-send',
  expressAsyncHandler(async (req, res) => {
    let data = await User.findOne({ email: req.body.email });
    // console.log(data);
    const responseType = {};
    if (data) {



    const isOtp = await Otp.find({
      email: req.body.email,
    });
      if (isOtp) {
          let oldOtp=await    Otp.findOneAndDelete(
              {email: req.body.email})
      }


      let otpCode = Math.floor(Math.random() * 10000 + 1);

const VALID_DURATION= 120000
      let otpData = new Otp({
        email: req.body.email,
        code: otpCode,
        expiredAt: new Date().getTime() + VALID_DURATION,
      });

      // send otm email notification
      passwordResetMail({TO:req.body.email,OTP:otpCode})

      let otpRespond = await otpData.save();
      responseType.statusText = 'Success';
      responseType.message = 'Please check your email id';

      setTimeout(async () => {
   let oldOtp=await  Otp.findOneAndDelete(
              {email: req.body.email})
},VALID_DURATION)

    } else {
      responseType.statusText = 'error';
      responseType.message = 'Email Id not Exist';
    }
    res.status(200).json(responseType);
  })
);
userRouter.post(
  '/change-password',
  // isAuth,
  expressAsyncHandler(async (req, res) => {
    const existingOTP = await Otp.find({
      email: req.body.email,
      code: req.body.otp,
    });

    const response = {};
    if (existingOTP.length === 0) {
        response.message = 'Token Expire';
      res.statusText = 'error';
     
      
    }
    else {
      
      if (existingOTP.length>0) {
        let currentTime = new Date().getTime();
      let diff = new Date(existingOTP[0].expiredAt).getTime() - currentTime;
      if (diff < 0) {
    // let oldOtp=await    Otp.findOneAndDelete(
    //   { email: req.body.email })
        response.message = 'Token Expire';
        res.statusText = 'error';
      } else {
        let user = await User.findOne({ email: req.body.email });
        user.password = req.body.password;
        user.save();
        if (user) {
          let oldOtp=await    Otp.findOneAndDelete(
      { email: req.body.email })
        }

        let updatePassword = await User.findOneAndUpdate({ email: req.body.email }, {
          password: bcrypt.hashSync(req.body.password),
        })
        console.log(updatePassword)
        response.message = 'Password changed successfully';
        response.statusText = 'Success';
      }
    } else {
      response.message = 'Invalid otp';
      response.statusText = 'error';
    }
  }
    res.status(200).json(response);
  })
);
export default userRouter;
