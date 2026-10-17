/** Add project or experience technologies to the permanent skill list. */
export const addMissingSkills = (skills = [], names = []) => {
  const knownNames = new Set(skills.map((skill) => skill.name.trim().toLowerCase()));
  const additions = names
    .map((name) => String(name).trim())
    .filter((name) => name && !knownNames.has(name.toLowerCase()))
    .map((name, index) => {
      knownNames.add(name.toLowerCase());
      return {
        id: `skill-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
        name,
        icon: 'Code',
        color: 'text-cyan-400',
        orbit: 0,
        createdAt: new Date().toISOString()
      };
    });

  return { skills: [...skills, ...additions], additions };
};
