import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest } from '../_lib/auth.js';
import { handleError } from '../_lib/errors.js';
import { generateWorkout } from '../_chains/index.js';
import type { WorkoutGeneratorResult } from 'trkn-shared';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Only allow POST
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      res.status(405).json({ error: { message: 'Method not allowed' } });
      return;
    }

    // Authenticate
    await authenticateRequest(req);

    // Generate workout using LangChain
    const result: WorkoutGeneratorResult = await generateWorkout(req.body);

    // Success response
    res.status(200).json(result);
  } catch (error) {
    handleError(error, res);
  }
}
