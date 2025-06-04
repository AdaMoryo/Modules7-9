/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import { RateLimiter } from './rateLimiterClass';

const rateLimiter = new RateLimiter();

export const rateLimiterMiddleware = async(req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers['user-id'] as string;
  const tokenName = req.headers['token-name'] as string;
  if (!userId || !tokenName) {
    res.status(400).json({ error: 'Missing rate limiting headers: x-user-id or x-token-name' });
    return;
  }

  const limit = await rateLimiter.getUserRateLimit(userId, tokenName);
  if (limit <= 0) {
    res.status(429).json({ error: `Rate limit exceeded for user: ${userId}` });
    return;
  } else if(limit === -1) { // user does not exists on the table
    const currentWindow = Math.floor(Date.now() / 1000 / rateLimiter.windowLength);
    await rateLimiter.setUserRateLimit(userId, tokenName, rateLimiter.deafaultTokenValue -1, currentWindow);
    console.log('created new limit for user with id:' + userId);
  }

  await rateLimiter.updateUserRateLimit(userId, tokenName, -1);
  console.log(limit);
  next();
};
