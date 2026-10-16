import { readDatabase, writeDatabase } from '../config/db.js';

export const getHomeContent = (req, res) => {
  try {
    const db = readDatabase();
    res.json({ success: true, data: db.homeContent || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHomeContent = (req, res) => {
  try {
    const db = readDatabase();
    const updated = {
      ...db.homeContent,
      ...req.body
    };

    writeDatabase({ ...db, homeContent: updated });
    res.json({ success: true, data: updated, message: 'Homepage content updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
