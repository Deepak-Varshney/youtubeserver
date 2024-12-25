import { Video } from '../models/video.model.js';

export const uploadVideo = async (req, res) => {
  try {
    const { title, description, videoLink, videoType, thumbnail, tags } = req.body;
    const video = new Video({ title, description, videoLink, videoType, thumbnail, user: req.user._id, tags });
    await video.save();
    res.status(201).json({ message: 'Video uploaded successfully', success: true, video });
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

// @route  GET /api/videos/all
// @desc   Get all videos
export const getAllVideos = async (req, res) => {
  try {

    const videos = await Video.find().populate('user', 'username channelName profilePicture').sort({ updatedAt: -1 });
    res.status(201).json({ message: 'Videos fetched successfully', success: true, total: videos.length, videos  });

  }
  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' });
  }
}

// @route  GET /api/videos/find/:id
// @desc   Get a video by id
export const getVideoById = async (req, res) => {
  try {
    let { id } = req.params
    const video = await Video.findById(id).populate('user', 'username channelName profilePicture createdAt subscribedTo subscribers')
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.status(201).json({ message: 'Video fetched successfully', success: true, video });
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' });
  }
}

// @route  GET /api/videos/channel/channelId
// @desc   Get a video by id

export const getAllVideosByUserId = async (req, res) => {
  try {
    let { channelId } = req.params;
    const videos = await Video.find({ user: channelId }).populate('user', 'username channelName profilePicture about').sort({ updatedAt: -1 });
    res.status(201).json({ message: 'Videos fetched successfully', success: true, total: videos.length, videos  });
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' });
  }
}

export const getVideosByType = async (req, res) => {
  try {
    let { videoType } = req.params;
    const videos = await Video.find({ videoType: videoType }).populate('user', 'username channelName profilePicture about').sort({ updatedAt: -1 });
    res.status(200).json({ message: 'Videos fetched successfully', success: true, total: videos.length, videos });
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
}

// @desc    Delete a video
// @route   DELETE /api/videos/delete/:id
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    if (video.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized action' });
    }

    await Video.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Like a video
// @route   PUT /api/videos/like/:id
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if the user has already liked the video
    if (video.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already liked this video' });
    }

    // Remove the user from dislikes if they have disliked the video
    video.dislikes.pull(req.user.id);

    // Add the user to likes
    video.likes.push(req.user.id);

    await video.save();
    res.status(200).json({ message: 'Video liked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Dislike a video
// @route   PUT /api/videos/dislike/:id
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Check if the user has already disliked the video
    if (video.dislikes.includes(req.user.id)) {
      return res.status(400).json({ message: 'You have already disliked this video' });
    }

    // Remove the user from likes if they have liked the video
    video.likes.pull(req.user.id);

    // Add the user to dislikes
    video.dislikes.push(req.user.id);

    await video.save();
    res.status(200).json({ message: 'Video disliked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc    Get videos sorted by views
// @route   GET /api/videos/trending
export const getTrendingVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ views: -1 }).limit(44);
    res.status(200).json({ message: 'Videos fetched successfully', success: true, total: videos.length, videos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get videos by tags
// @route   GET /api/videos/tags
export const getVideosByTags = async (req, res) => {
  const tags = req.query.tags.split(',');
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(10).sort({ updatedAt: -1 });
    res.status(200).json({ message: 'Videos fetched successfully', success: true, total: videos.length, videos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search videos by title  
// @route   GET /api/videos/search
export const searchVideos = async (req, res) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({ title: { $regex: query, $options: 'i' } }).limit(44).sort({ updatedAt: -1 });
    res.status(200).json({ message: 'Videos fetched successfully', success: true, total: videos.length, videos });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Increase view count
// @route   PUT /api/videos/view/:id
export const increaseViewCount = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.views += 1;
    await video.save();

    res.status(200).json({ message: 'View count increased', success: true, views: video.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};