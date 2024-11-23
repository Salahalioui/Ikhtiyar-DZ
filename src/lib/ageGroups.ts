export const ageGroups = {
  calculateAgeGroup: (dateOfBirth: string): string => {
    const age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
    if (age <= 10) return 'U10';
    if (age <= 12) return 'U12';
    if (age <= 14) return 'U14';
    if (age <= 16) return 'U16';
    return 'U18';
  },

  getAgeGroupLimits: (ageGroup: string): { min: number; max: number } => {
    const groups: Record<string, { min: number; max: number }> = {
      'U10': { min: 8, max: 10 },
      'U12': { min: 11, max: 12 },
      'U14': { min: 13, max: 14 },
      'U16': { min: 15, max: 16 },
      'U18': { min: 17, max: 18 }
    };
    return groups[ageGroup] || { min: 0, max: 99 };
  }
}; 