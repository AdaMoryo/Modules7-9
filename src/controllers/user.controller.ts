import { Request, Response } from 'express';
import { userService } from '../services/user.service';

export const userController = {
  async createUser(req: Request, res: Response) {
    try {
      const result = await userService.createUser(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async getUserById(req: Request, res: Response) {
    try {
      const result = await userService.getUserById(req.params.id);
      res.json(result);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  },

  async getAllUsers(_req: Request, res: Response) {
    try {
      const result = await userService.getAllUsers();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
