const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const History = require('../models/historyModel');
const mongoose = require('mongoose');

require('dotenv').config()



const userSignup = async (req, res) => {
  const { username, password, email } = req.body;
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRETKEY, {
      expiresIn: '30d'
    })
  }
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'Invalid email format',
    });
  }

  let user;
  try {
    user = await User.findOne({ email });
    const otp = Math.floor(Math.random() * 9000) + 1000;
    if (user) {
      return res.status(400).json({
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hashSync(password);
    user = new User({
      username,
      email,
      password: hashedPassword,
      otp,
    });
    const token = generateToken(user._id)

    res.cookie('token', token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30000),
      httpOnly: true,
      sameSite: 'none',


    })
    const cookie = req.headers.cookie;
    await user.save();
      res.status(200).json({
      message: user,cookie
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
      
    });
  }
};


const userLogin = async (req, res) => {
  const { email, password } = await req.body;
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRETKEY, {
      expiresIn: '30d'
    })
  }
  let existingUser;
  try {
    existingUser = await User.findOne({ email })
    if (!existingUser) {
      return res.status(404).json({
        message: 'User does not exist',
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }
    const token = generateToken(existingUser._id)

    res.cookie('token', token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 30000),
      httpOnly: true,
      sameSite: 'none',


    })
    // const { password, ...info } = user._doc;
    return res.status(200).json({ status: "200", user: existingUser, token })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}
const getHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId).populate({
      path: 'history',
      options: {
        sort: { createdAt: 'desc' },
        limit: 5
  }});
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const history = user.history
    const history2 = history.map((item) => {
      return {
       
        history: item.history,
       
      }
    })

    
    res.status(200).json({message: history2 });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const addHistory = async (req, res) => {
  const { history } = req.body;
  const userId = req.user.id;

  try {
    const newUser = await User.findById(userId);

    if (!newUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newHistory = new History({
      user: userId,
      history
    });

    

    const session = await mongoose.startSession();
    session.startTransaction();
    newUser.history.push(newHistory);
    await newUser.save({ session });
    await newHistory.save({ session });
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: 'History added successfully',
      newHistory
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



const logout = async (req, res, next) => {
  res.cookie('token', "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'none'


  })
  return res.status(200).json({ msg: "logout sucessfully" })
}


const pass = "@Onlineclass123";
const user_email = "yethukichu55@gmail.com";
let transporter = nodemailer.createTransport({
  service: "outlook",
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "yethukichu55@gmail.com", // generated ethereal user
    pass: "@Onlineclass", // generated ethereal password
  },
});

const resetPassword = async (req, res, next) => {
  const { email } = req.body;
  let user;
  if (!email) {
    return res.status(400).json({ msg: "Please enter email" });
  }
  try {
    user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    if (user.otp) {
      const mailOptions = {
        host: "smtp-mail.outlook.com",
        from: user_email,
        to: email,
        subject: 'Reset Password',
        text: `This is the 4-digit OTP: ${user.otp}`
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log("Error occurred", err);
          return res.status(500).json({ msg: "Server error" });
        } else {
          return res.status(200).json({ msg: user.otp });
        }
      });
    } else {
      const newOtp = Math.floor(Math.random() * 9000) + 1000;
      await User.findByIdAndUpdate({ _id: user._id }, { otp: newOtp });
      const mailOptions = {
        host: "smtp-mail.outlook.com",
        from: user_email,
        to: email,
        subject: 'Reset Password',
        text: `This is the 4-digit OTP: ${newOtp}`
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log("Error occurred", err);
          return res.status(500).json({ msg: "Server error" });
        } else {
          return res.status(200).json({ msg: newOtp });
        }
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

const verifyOtp = async (req, res, next) => {
  const { email, otp } = req.body;
  let user;
 //verify
  if (!email) {
    return res.status(400).json({ msg: "Please enter email" });
  }

  try {
    user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

      res.status(200).json({ msg: "OTP verified successfully" });
      await User.findByIdAndUpdate({_id:user._id}, { otp: "" });
   
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
};

const updatePassword = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  if (!email) {
    return res.status(400).json({ msg: "Please enter email" });
  }
  try {

    user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }
    const hashPassword = await bcrypt.hashsync(password);
    await user.findByIdAndUpdate({ _id: user._id }, { password: hashPassword });

    return res.status(200).json({ msg: "password updated" });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ msg: "Server error" });
  }
};


 


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      message: users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const loginStatus = async (req, res) => {
  // try {
  //   const cookie = req.headers.cookie;
  //   if(!cookie) {
  //     return res.json("u need to authenticate");
  //   }
   
  //     return res.json(true);
    
   
  // } catch (error) {
  //   console.error('Error occurred:', error);
  //   return res.status(500).json({ error: 'Internal server error' });
  // }
  return res.json(true);
};





module.exports = {
    userSignup,
    userLogin,
    logout,
    resetPassword,
    getAllUsers,
    loginStatus,
    addHistory,
    getHistory,
    verifyOtp,
    updatePassword



}
