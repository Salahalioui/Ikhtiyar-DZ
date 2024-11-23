import { SportConfig, EvaluationMetric } from '../types';

const CONFIG_KEY = 'talent-scout-config';

const DEFAULT_CONFIG: SportConfig[] = [
  {
    id: 'football',
    name: 'Football',
    icon: 'Dumbbell',
    metrics: [
      {
        id: 'speed',
        name: 'Speed',
        description: 'Acceleration and sprint speed',
        min: 1,
        max: 10
      },
      {
        id: 'ballControl',
        name: 'Ball Control',
        description: 'Dribbling and ball handling skills',
        min: 1,
        max: 10
      },
      {
        id: 'passing',
        name: 'Passing',
        description: 'Accuracy and technique in passing',
        min: 1,
        max: 10
      },
      {
        id: 'shooting',
        name: 'Shooting',
        description: 'Power and accuracy in shooting',
        min: 1,
        max: 10
      },
      {
        id: 'tactical',
        name: 'Tactical Understanding',
        description: 'Game awareness and decision making',
        min: 1,
        max: 10
      }
    ]
  },
  {
    id: 'athletics',
    name: 'Athletics',
    icon: 'Timer',
    metrics: [
      {
        id: 'sprint',
        name: 'Sprint',
        description: '100m sprint performance',
        min: 1,
        max: 10
      },
      {
        id: 'endurance',
        name: 'Endurance',
        description: 'Long-distance running capability',
        min: 1,
        max: 10
      },
      {
        id: 'jumping',
        name: 'Jumping',
        description: 'High jump and long jump ability',
        min: 1,
        max: 10
      },
      {
        id: 'throwing',
        name: 'Throwing',
        description: 'Shot put and throwing skills',
        min: 1,
        max: 10
      },
      {
        id: 'coordination',
        name: 'Coordination',
        description: 'Overall body coordination and agility',
        min: 1,
        max: 10
      }
    ]
  }
];

export const config = {
  getSports: (): SportConfig[] => {
    const savedConfig = localStorage.getItem(CONFIG_KEY);
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig) as SportConfig[];
      // Ensure default sports maintain their original metrics
      return parsedConfig.map(sport => {
        if (sport.id === 'football' || sport.id === 'athletics') {
          return DEFAULT_CONFIG.find(s => s.id === sport.id) || sport;
        }
        return sport;
      });
    }
    return DEFAULT_CONFIG;
  },

  saveSports: (sports: SportConfig[]) => {
    // Preserve default sports' metrics when saving
    const sportsToSave = sports.map(sport => {
      if (sport.id === 'football' || sport.id === 'athletics') {
        return DEFAULT_CONFIG.find(s => s.id === sport.id) || sport;
      }
      return sport;
    });
    localStorage.setItem(CONFIG_KEY, JSON.stringify(sportsToSave));
  },

  resetToDefault: () => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
  },

  getMetrics: (sportId: string): EvaluationMetric[] => {
    const sports = config.getSports();
    return sports.find(s => s.id === sportId)?.metrics || [];
  }
}; 