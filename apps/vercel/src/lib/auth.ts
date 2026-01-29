import type { VercelRequest } from '@vercel/node';
import type { User } from '@supabase/supabase-js';
import { verifyToken } from './supabase';
import { AuthenticationError } from './errors';

export interface AuthenticatedRequest extends VercelRequest {
  user: User;
  accessToken: string;
}

export async function authenticateRequest(req: VercelRequest): Promise<AuthenticatedRequest> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new AuthenticationError('Missing or invalid Authorization header');
  }

  const accessToken = authHeader.substring(7);
  const user = await verifyToken(accessToken);

  if (!user) {
    throw new AuthenticationError('Invalid or expired token');
  }

  return Object.assign(req, { user, accessToken }) as AuthenticatedRequest;
}
