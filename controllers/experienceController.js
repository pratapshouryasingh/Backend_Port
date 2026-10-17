import { readDatabase, writeDatabase } from '../config/db.js';
import { addMissingSkills } from '../utils/syncSkills.js';

export const getExperiences = (req, res) => {
  try {
    const db = readDatabase();
    res.json({ success: true, data: db.experiences || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addExperience = (req, res) => {
  try {
    const { role, organization, type, period, location, description, highlights, link } = req.body;
    if (!role || !organization) {
      return res.status(400).json({ success: false, message: 'Role and organization are required' });
    }

    const db = readDatabase();
    const newExperience = {
      id: Date.now().toString(),
      role: role.trim(),
      organization: organization.trim(),
      type: type || 'Experience',
      period: period || '',
      location: location || '',
      description: description || '',
      highlights: Array.isArray(highlights) ? highlights : (highlights ? highlights.split(',').map(h => h.trim()).filter(Boolean) : []),
      link: link || '#',
      createdAt: new Date().toISOString()
    };

    const updatedExperiences = [newExperience, ...(db.experiences || [])];
    const { skills, additions } = addMissingSkills(db.skills || [], newExperience.highlights);
    writeDatabase({ ...db, experiences: updatedExperiences, skills });

    res.status(201).json({ success: true, data: newExperience, addedSkills: additions, message: 'Experience added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExperience = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();
    const experiences = db.experiences || [];
    const index = experiences.findIndex(e => e.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Experience not found' });
    }

    const updated = {
      ...experiences[index],
      ...req.body,
      id,
      highlights: Array.isArray(req.body.highlights) 
        ? req.body.highlights 
        : (req.body.highlights ? req.body.highlights.split(',').map(h => h.trim()).filter(Boolean) : experiences[index].highlights)
    };

    experiences[index] = updated;
    writeDatabase({ ...db, experiences });

    res.json({ success: true, data: updated, message: 'Experience updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExperience = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();
    const experiences = (db.experiences || []).filter(e => e.id !== id);

    writeDatabase({ ...db, experiences });
    res.json({ success: true, message: 'Experience deleted successfully', id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
