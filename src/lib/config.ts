import { EvaluationMetric } from '../types';

interface MetricConfig {
  football: EvaluationMetric[];
  athletics: EvaluationMetric[];
}

const CONFIG_KEY = 'talent-scout-config';

const DEFAULT_CONFIG: MetricConfig = {
  football: [
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
  ],
  athletics: [
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
};

export const config = {
  getMetrics: (sport: 'football' | 'athletics'): EvaluationMetric[] => {
    const savedConfig = localStorage.getItem(CONFIG_KEY);
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig) as MetricConfig;
      return parsedConfig[sport];
    }
    return DEFAULT_CONFIG[sport];
  },

  saveMetrics: (sport: 'football' | 'athletics', metrics: EvaluationMetric[]) => {
    const currentConfig = localStorage.getItem(CONFIG_KEY);
    const configToSave = currentConfig 
      ? { ...JSON.parse(currentConfig), [sport]: metrics }
      : { ...DEFAULT_CONFIG, [sport]: metrics };
    
    localStorage.setItem(CONFIG_KEY, JSON.stringify(configToSave));
  },

  resetToDefault: () => {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
  }
}; 