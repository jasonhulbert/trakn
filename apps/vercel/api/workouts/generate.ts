import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleGenerateWorkout } from '../../src/functions/workouts/generate';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  return handleGenerateWorkout(req, res);
}
