import { z } from 'zod';

export const GymEquipmentAccessSchema = z.enum(['full_gym', 'limited_equipment', 'bodyweight_only']);

export const ConditioningEquipmentAccessSchema = z.enum([
  'cardio_machines',
  'outdoor_space',
  'minimal_space',
  'pool_access',
]);

export const GymEquipmentSchema = z.object({
  equipment_access: GymEquipmentAccessSchema.describe('Type of gym equipment available'),
  equipment_notes: z.string().optional().describe('Additional notes about specific equipment available'),
});

export const ConditioningEquipmentSchema = z.object({
  equipment_access: ConditioningEquipmentAccessSchema.describe('Type of conditioning equipment/space available'),
  equipment_notes: z.string().optional().describe('Additional notes about specific equipment available'),
});

export type GymEquipmentAccess = z.infer<typeof GymEquipmentAccessSchema>;
export type ConditioningEquipmentAccess = z.infer<typeof ConditioningEquipmentAccessSchema>;
export type GymEquipment = z.infer<typeof GymEquipmentSchema>;
export type ConditioningEquipment = z.infer<typeof ConditioningEquipmentSchema>;
