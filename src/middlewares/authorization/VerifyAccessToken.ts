import { Request, Response, NextFunction } from 'express';
import { JWKSetStore } from './JWKSetStore';

const setStore = new JWKSetStore('78820852-55fa-450b-908d-45c0d911e76b');

export const verifyAccessToken = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Missing or invalid Authorization header' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const payload = await setStore.verifyToken(token);

    (req as any).user = payload;
    next();
  } catch (err: any) {
    res.status(401).json({ error: 'Invalid or expired token', details: err.message });
  }
};
