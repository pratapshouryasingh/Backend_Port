import { readDatabase, writeDatabase } from '../config/db.js';
import { addMissingSkills } from '../utils/syncSkills.js';

export const getProjects = (req, res) => {
  try {
    const db = readDatabase();
    res.json({ success: true, data: db.projects || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addProject = (req, res) => {
  try {
    const { title, description, image, tags, github, demo } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const db = readDatabase();
    const newProject = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description || '',
      image: image || '',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
      github: github || '#',
      demo: demo || '#',
      createdAt: new Date().toISOString()
    };

    const updatedProjects = [newProject, ...(db.projects || [])];
    const { skills, additions } = addMissingSkills(db.skills || [], newProject.tags);
    writeDatabase({ ...db, projects: updatedProjects, skills });

    res.status(201).json({ success: true, data: newProject, addedSkills: additions, message: 'Project added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProject = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();
    const projects = db.projects || [];
    const index = projects.findIndex(p => p.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const updated = {
      ...projects[index],
      ...req.body,
      id,
      tags: Array.isArray(req.body.tags) 
        ? req.body.tags 
        : (req.body.tags ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : projects[index].tags)
    };

    projects[index] = updated;
    writeDatabase({ ...db, projects });

    res.json({ success: true, data: updated, message: 'Project updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteProject = (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();
    const projects = (db.projects || []).filter(p => p.id !== id);

    writeDatabase({ ...db, projects });
    res.json({ success: true, message: 'Project deleted successfully', id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
