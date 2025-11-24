export const EQUIPMENT_TYPES = [
  'barbell',
  'dumbbells',
  'kettlebell',
  'bodyweight',
  'bench',
  'squat rack',
  'pull-up bar',
  'dip bars',
  'cable',
  'machine',
  'ab wheel',
  'resistance bands',
] as const;

export type EquipmentType = typeof EQUIPMENT_TYPES[number];

export const EQUIPMENT_LABELS: Record<EquipmentType, string> = {
  barbell: 'Barbell',
  dumbbells: 'Dumbbells',
  kettlebell: 'Kettlebell',
  bodyweight: 'Bodyweight',
  bench: 'Bench',
  'squat rack': 'Squat Rack',
  'pull-up bar': 'Pull-up Bar',
  'dip bars': 'Dip Bars',
  cable: 'Cable Machine',
  machine: 'Machine',
  'ab wheel': 'Ab Wheel',
  'resistance bands': 'Resistance Bands',
};
