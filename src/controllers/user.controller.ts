import { Request, Response } from 'express';
import { userService } from '../services/user.service';

export const userController = {
  async createUser(req: Request, res: Response) {
    const result = await userService.createUser(req.body);
    res.json(result);
  },

  async getUserById(req: Request, res: Response) {
    const result = await userService.getUserById(req.params.id);
    res.json(result);
  },

  async getAllUsers(_req: Request, res: Response) {
    const result = await userService.getAllUsers();
    res.json(result);
  },
};
