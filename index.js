require('dotenv').config();
const { getVideoStats, updateVideoMetadata } = require('./src/youtube');

async function main() {
  const videoId = process.env.VIDEO_ID;
  const titleTemplate = process.env.TITLE_TEMPLATE;
  const descriptionTemplate = process.env.DESCRIPTION_TEMPLATE || '';

  if (!videoId || !titleTemplate) {
    console.error('Error: VIDEO_ID and TITLE_TEMPLATE must be set in the .env file.');
    process.exit(1);
  }

  try {
    console.log(`Fetching stats for video: ${videoId}`);
    const { stats, snippet } = await getVideoStats(videoId);
    
    const views = stats.viewCount;
    const likes = stats.likeCount || 0;
    const comments = stats.commentCount || 0;

    console.log(`Current views: ${views}`);

    // Replace placeholders in the template
    let newTitle = titleTemplate.replace(/{views}/g, views)
                                .replace(/{likes}/g, likes)
                                .replace(/{comments}/g, comments);

    let newDescription = snippet.description;
    if (descriptionTemplate) {
       newDescription = descriptionTemplate.replace(/{views}/g, views)
                                           .replace(/{likes}/g, likes)
                                           .replace(/{comments}/g, comments);
    }

    // Only update if there's an actual change to avoid unnecessary API calls
    if (newTitle === snippet.title && newDescription === snippet.description) {
      console.log('No changes detected in title or description. Skipping update.');
      return;
    }

    console.log(`Updating title to: "${newTitle}"`);
    await updateVideoMetadata(videoId, newTitle, newDescription);
    
    console.log('Update complete.');
  } catch (error) {
    console.error('Execution failed:', error.message);
  }
}

main();
