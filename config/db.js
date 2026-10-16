import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  defaultProjects,
  defaultExperiences,
  defaultSkills,
  defaultHomeContent,
  defaultResume
} from '../data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getInitialDatabase = () => ({
  projects: defaultProjects,
  experiences: defaultExperiences,
  skills: defaultSkills,
  homeContent: defaultHomeContent,
  resumeFile: defaultResume,
  updatedAt: new Date().toISOString()
});

export const readDatabase = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDatabase();
      writeDatabase(initial);
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    console.error('Error reading JSON database, falling back to initial data:', error);
    const initial = getInitialDatabase();
    writeDatabase(initial);
    return initial;
  }
};

export const writeDatabase = (data) => {
  try {
    const updated = {
      ...data,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (error) {
    console.error('Failed to write database file:', error);
    throw error;
  }
};
