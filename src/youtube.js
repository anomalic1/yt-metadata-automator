const { google } = require('googleapis');
const { authorize } = require('./auth');

async function getYouTubeClient() {
  const auth = await authorize();
  return google.youtube({ version: 'v3', auth });
}

async function getVideoStats(videoId) {
  try {
    const youtube = await getYouTubeClient();
    const res = await youtube.videos.list({
      part: 'statistics,snippet',
      id: videoId
    });

    if (!res.data.items || res.data.items.length === 0) {
      throw new Error(`Video with ID ${videoId} not found.`);
    }

    // Returning both stats and snippet since we need categoryId etc. for updates
    return {
      stats: res.data.items[0].statistics,
      snippet: res.data.items[0].snippet
    };
  } catch (error) {
    console.error('Error fetching video stats:', error.message);
    throw error;
  }
}

async function updateVideoMetadata(videoId, newTitle, newDescription) {
  try {
    const { snippet } = await getVideoStats(videoId);
    
    // We must include the existing categoryId when updating the snippet
    const categoryId = snippet.categoryId;
    const youtube = await getYouTubeClient();

    const res = await youtube.videos.update({
      part: 'snippet',
      requestBody: {
        id: videoId,
        snippet: {
          title: newTitle,
          description: newDescription,
          categoryId: categoryId
        }
      }
    });

    console.log(`Successfully updated video metadata for: ${videoId}`);
    return res.data;
  } catch (error) {
    console.error('Error updating video metadata:', error.message);
    throw error;
  }
}

module.exports = {
  getVideoStats,
  updateVideoMetadata
};
