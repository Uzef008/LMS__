const prisma = require('../lib/prisma');

const upsertProgress = async (req, res) => {
  const userId = req.user.id;
  const videoId = req.body.videoId;
  const { lastPositionSeconds, isCompleted } = req.body;

  try {
    const progress = await prisma.videoProgress.upsert({
      where: {
        userId_videoId: { userId, videoId }
      },
      update: {
        lastPositionSeconds,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined
      },
      create: {
        userId,
        videoId,
        lastPositionSeconds,
        isCompleted,
        completedAt: isCompleted ? new Date() : undefined
      }
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProgress = async (req, res) => {
  const userId = req.user.id;
  const videoId = req.params.videoId;

  try {
    const progress = await prisma.videoProgress.findUnique({
      where: {
        userId_videoId: { userId, videoId }
      }
    });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { upsertProgress, getProgress };
