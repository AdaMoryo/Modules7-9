import { Request, Response, NextFunction } from 'express';
import { JWKSetStore } from './JWKSetStore'; // הנחה שאתה מייבא מכאן

const setStore = new JWKSetStore(process.env.TENANT_ID!);

export const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    const payload = setStore.verifyToken(token);
    (req as any).user = payload;

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
