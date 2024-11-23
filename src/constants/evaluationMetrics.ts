import { EvaluationMetric } from '../types';

export const FOOTBALL_METRICS: EvaluationMetric[] = [
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
];

export const ATHLETICS_METRICS: EvaluationMetric[] = [
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
];