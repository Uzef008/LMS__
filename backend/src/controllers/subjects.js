const prisma = require('../lib/prisma');

const getAllSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      where: { isPublished: true },
    });
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubjectBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const subject = await prisma.subject.findUnique({
      where: { slug, isPublished: true },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            videos: {
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });

    if (!subject) return res.status(404).json({ error: 'Subject not found' });
    res.json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubjectTree = async (req, res) => {
  const { slug } = req.params;
  const userId = req.user.id;

  try {
    const subject = await prisma.subject.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' },
          include: {
            videos: {
              orderBy: { orderIndex: 'asc' },
              include: {
                progress: {
                  where: { userId },
                },
              },
            },
          },
        },
      },
    });

    if (!subject) return res.status(404).json({ error: 'Subject not found' });

    // Flatten all videos for easy indexing
    const allVideos = subject.sections.flatMap(s => s.videos);
    
    // Add locking logic
    const sections = subject.sections.map((section, sIdx) => ({
      ...section,
      videos: section.videos.map((video, vIdx) => {
        // Calculate global video index
        const globalIdx = allVideos.findIndex(v => v.id === video.id);
        const prevVideo = globalIdx > 0 ? allVideos[globalIdx - 1] : null;
        
        let locked = false;
        let unlockReason = "";

        if (globalIdx > 0) {
          const prevProgress = allVideos[globalIdx - 1].progress.length > 0 ? allVideos[globalIdx - 1].progress[0] : null;
          if (!prevProgress?.isCompleted) {
            locked = true;
            unlockReason = "Previous video must be completed";
          }
        }

        return {
          ...video,
          locked,
          unlockReason,
          previousVideoId: prevVideo?.id || null,
          nextVideoId: allVideos[globalIdx + 1]?.id || null,
          isCompleted: video.progress.length > 0 ? video.progress[0].isCompleted : false
        };
      })
    }));

    res.json({ ...subject, sections });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getVideoById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const video = await prisma.video.findUnique({
      where: { id },
      include: {
        progress: {
          where: { userId },
        },
        section: {
          include: {
            subject: true
          }
        }
      },
    });

    if (!video) return res.status(404).json({ error: 'Video not found' });

    // Check if locked
    const subject = await prisma.subject.findUnique({
       where: { id: video.section.subjectId },
       include: {
          sections: {
            orderBy: { orderIndex: 'asc' },
            include: {
              videos: {
                orderBy: { orderIndex: 'asc' },
                include: {
                  progress: { where: { userId } }
                }
              }
            }
          }
       }
    });

    const allVideos = subject.sections.flatMap(s => s.videos);
    const globalIdx = allVideos.findIndex(v => v.id === video.id);
    
    let locked = false;
    let unlockReason = "";
    if (globalIdx > 0) {
      const prevProgress = allVideos[globalIdx - 1].progress.length > 0 ? allVideos[globalIdx - 1].progress[0] : null;
      if (!prevProgress?.isCompleted) {
        locked = true;
        unlockReason = "Previous video must be completed";
      }
    }

    res.json({
      ...video,
      locked,
      unlockReason,
      previousVideoId: allVideos[globalIdx-1]?.id || null,
      nextVideoId: allVideos[globalIdx+1]?.id || null,
      currentProgress: video.progress[0] || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllSubjects, getSubjectBySlug, getSubjectTree, getVideoById };
