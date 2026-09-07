import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    // Get all users except current user
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
    res.status(200).json({ success: true, data: filteredUsers });
  } catch (error) {
    console.error('Error in getUsersForSidebar:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePicture } = req.body;
    const userId = req.user._id;

    if (!profilePicture) {
      return res.status(400).json({ success: false, message: 'Profile picture is required' });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePicture);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePicture: uploadResponse.secure_url },
      { new: true }
    ).select('-password');

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Error in updateProfile:', error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
