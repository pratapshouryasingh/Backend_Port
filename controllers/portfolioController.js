import { readDatabase } from '../config/db.js';

export const getPortfolio = (req, res) => {
  try {
    const db = readDatabase();
    res.json({
      success: true,
      data: {
        projects: db.projects || [],
        experiences: db.experiences || [],
        skills: db.skills || [],
        homeContent: db.homeContent || {},
        resumeFile: db.resumeFile || null,
        updatedAt: db.updatedAt || new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
