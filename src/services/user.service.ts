import { userRepository } from '../repositories/user.repository';
import { User } from '../types/user';

export const userService = {
  async createUser(data: User) {
    const { id, email, username, password, role, classification } = data;

    // Validate all required fields
    if (!id || !email || !username || !password || !role || !classification) {
      throw new Error('Missing required user fields');
    }

    // Validate role
    const validRoles: User['role'][] = ['admin', 'developer', 'user'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid role');
    }

    // Validate classification
    if (classification < 1 || classification > 5) {
      throw new Error('Invalid classification');
    }

    await userRepository.save(data);
    return { message: 'User saved', id };
  },

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  },

  async getAllUsers() {
    return await userRepository.findAll();
  },
};
