import User from '../models/User.js';
import { generateTokenAndSetCookie } from '../utils/generateToken.js';

export const register = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    console.log('REGISTER ATTEMPT:', { fullName, username, email, password });
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username or email already exists' });
    }

    const newUser = new User({ fullName, username, email, password });
    if (newUser) {
      await newUser.save();
      generateTokenAndSetCookie(newUser._id, res);

      res.status(201).json({
        success: true,
        data: {
          _id: newUser._id,
          fullName: newUser.fullName,
          username: newUser.username,
          email: newUser.email,
          profilePicture: newUser.profilePicture,
        }
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    console.log('Error in register controller', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    
    const user = await User.findOne({ 
      $or: [{ username: emailOrUsername }, { email: emailOrUsername }] 
    });
    
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
      }
    });
  } catch (error) {
    console.log('Error in login controller', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const logout = (req, res) => {
  try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('jwt', '', {
      maxAge: 0,
      httpOnly: true,
      sameSite: isProduction ? 'none' : 'strict',
      secure: isProduction,
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    console.log('Error in logout controller', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getMe = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    console.log('Error in getMe controller', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
