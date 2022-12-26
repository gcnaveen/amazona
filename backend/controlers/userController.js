import Otp from '../models/otpModel';
import User from '../models/userModel';

const emailSend = async (req, res) => {
  let data = await User.findOne({ email: req.body.email });
  const responseType = {};
  if (data) {
    let otpCode = Math.floor(Math.random() * 10000 + 1);
    let otpData = new Otp({
      email: req.body.email,
      code: otpCode,
      expiredAt: new Date().getTime() + 300 * 1000,
    });
    let otpRespond = await otpData.save();
    responseType.statusText = 'Success';
    responseType.message = 'Please check yoyur email id';
  } else {
    responseType.statusText = 'error';
    responseType.message = 'Email Id not Exist';
  }
  res.status(200).json(responseType);
};

const changePassword = async (req, res) => {
  const data = await Otp.find({
    email: req.body.email,
    code: req.body.otpCode,
  });
  const response = {};
  if (data) {
    let currentTime = new Date().getTime();
    let diff = data.expireIn - currentTime;
    if (diff < 0) {
      response.message = 'Token Expire';
      res.statusText = 'error';
    } else {
      let user = await User.findOne({ email: req.body.email });
      user.password = req.body.password;
      user.save();
      response.message = 'Password changed successfully';
      response.statusText = 'Success';
    }
  } else {
    response.message = 'Invalid otp';
    response.statusText = 'error';
  }
  res.status(200).json(response);
};
