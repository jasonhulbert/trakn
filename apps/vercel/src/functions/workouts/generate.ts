import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateRequest } from '@/lib/auth';
import { handleError } from '@/lib/errors';
import { generateWorkout, type WorkoutGeneratorResult } from '@/chains';

export async function handleGenerateWorkout(req: VercelRequest, res: VercelResponse): Promise<void> {
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
