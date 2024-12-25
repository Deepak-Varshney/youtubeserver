import mongoose from 'mongoose';
import { User } from '../models/user.model.js';


export const getUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Validate the user ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id).select('-password'); // Exclude password

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile/update

export const updateUserProfile = async (req, res) => {
  const { username, email, about, channelName, profilePicture } = req.body;

  try {
    // Fetch the user from the database
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's profile fields
    user.username = username || user.username;
    user.email = email || user.email;
    user.about = about || user.about;
    user.channelName = channelName || user.channelName;
    user.profilePicture = profilePicture || user.profilePicture;
    await user.save();

    res.status(200).json({
      message: 'User profile updated successfully',
      user: { username: user.username, email: user.email, about: user.about, channelName: user.channelName },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Delete user account
// @route   DELETE /api/users/profile/delete
export const deleteUser = async (req, res) => {
  try {
    // Find the user by their ID (from the JWT token)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.deleteOne({ _id: req.user.id });

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/users/subscribe/channelId
// @desc Subscribe to a channel
export const subscribe = async (req, res) => {
  try {
    const userId = req.user.id;
    const channelId = req.params.channelId;
    // Validate the channel ID
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ message: 'Invalid channel ID' });
    }

    // Check if the user is already subscribed to the channel
    const user = await User.findById(userId);
    if (user.subscribedTo.includes(channelId)) {
      return res.status(400).json({ message: 'You are already subscribed to this channel' });
    }

    // Add the channel to the user's subscriptions
    user.subscribedTo.push(channelId);
    await user.save();

    // Increment the subscriber count of the channel
    const channel = await User.findById(channelId);
    channel.subscribers += 1;
    await channel.save();


    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route PUT /api/users/subscribe/channelId
// @desc Unsubscribe from a channel
export const unsubscribe = async (req, res) => {
  try {
    const userId = req.user.id;
    const channelId = req.params.channelId;

    // Validate the channel ID
    if (!mongoose.Types.ObjectId.isValid(channelId)) {
      return res.status(400).json({ message: 'Invalid channel ID' });
    }

    // Check if the user is subscribed to the channel
    const user = await User.findById(userId);
    if (!user.subscribedTo.includes(channelId)) {
      return res.status(400).json({ message: 'You are not subscribed to this channel' });
    }

    // Remove the channel from the user's subscriptions
    user.subscribedTo.pull(channelId);
    await user.save();

    // Decrement the subscriber count of the channel
    const channel = await User.findById(channelId);
    channel.subscribers -= 1;
    await channel.save();

    res.status(200).json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




