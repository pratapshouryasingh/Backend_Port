import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import {
  defaultProjects,
  defaultExperiences,
  defaultSkills,
  defaultHomeContent,
  defaultResume
} from '../data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_DATA_DIR = path.join(__dirname, '..', 'data');
// Set DATA_DIR to the Render persistent disk mount (for example /var/data).
const DATA_DIR = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : DEFAULT_DATA_DIR;
export const DB_FILE = path.join(DATA_DIR, 'database.json');
export const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');
const LEGACY_DB_FILE = path.join(DEFAULT_DATA_DIR, 'database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
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
      // Preserve data already written to the old source-tree location when
      // the service is first switched to a mounted persistent disk.
      if (DB_FILE !== LEGACY_DB_FILE && fs.existsSync(LEGACY_DB_FILE)) {
        const existing = JSON.parse(fs.readFileSync(LEGACY_DB_FILE, 'utf-8'));
        writeDatabase(existing);
        return existing;
      }
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
    // Write to a temporary file first so a process interruption cannot leave
    // database.json truncated and cause the next startup to restore defaults.
    const tempFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(updated, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return updated;
  } catch (error) {
    console.error('Failed to write database file:', error);
    throw error;
  }
};
