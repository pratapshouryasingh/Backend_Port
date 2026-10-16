import { readDatabase, writeDatabase } from '../config/db.js';

export const getSkills = (req, res) => {
  try {
    const db = readDatabase();
    res.json({ success: true, data: db.skills || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addSkill = (req, res) => {
  try {
    const { name, icon, color, orbit } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Skill name is required' });
    }

    const db = readDatabase();
    const newSkill = {
      id: Date.now().toString(),
      name: name.trim(),
      icon: icon || 'Code',
      color: color || 'text-cyan-400',
      orbit: Number(orbit) || 0,
      createdAt: new Date().toISOString()
    };

    const updatedSkills = [...(db.skills || []), newSkill];
    writeDatabase({ ...db, skills: updatedSkills });

    res.status(201).json({ success: true, data: newSkill, message: 'Skill added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSkill = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();
    const skills = db.skills || [];
    const index = skills.findIndex(s => s.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    const updated = {
      ...skills[index],
      ...req.body,
      id,
      orbit: req.body.orbit !== undefined ? Number(req.body.orbit) : skills[index].orbit
    };

    skills[index] = updated;
    writeDatabase({ ...db, skills });

    res.json({ success: true, data: updated, message: 'Skill updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteSkill = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();
    const skills = (db.skills || []).filter(s => s.id !== id);

    writeDatabase({ ...db, skills });
    res.json({ success: true, message: 'Skill deleted successfully', id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
