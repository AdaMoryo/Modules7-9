import { NextFunction, Request, Response } from 'express';
import { Authoriser } from './authorisor';
import { User } from '../../types/user';
import { Rule } from './rules';
const authorisor = new Authoriser();
authorisor.addRule({ id : '1', role: 'admin', clasifiction: 2, action: 'get-request' } as Rule);

export const authoriseRequest  = (req: Request, res: Response, next: NextFunction)  => {
  const user = (req as any).user as User;
  console.log(user);
  const { action } = req.body;
  if(!user || !action) {
    res.status(401).json('missing user info or action');
  };

  if(authorisor.authoriseRequest(action, user.role, user.classification)) {
    next();
  } else {
    res.status(500).json('rejected: low classification level or role');
    return;
  }
};
