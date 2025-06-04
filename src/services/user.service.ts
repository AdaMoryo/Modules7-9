import { userRepository } from '../repositories/user.repository';

export const userService = {
  async createUser(data: { id: string; name: string; email: string }) {
    if (!data.id || !data.name || !data.email) {
      throw new Error('Missing user fields');
    }
    await userRepository.save(data);
    return { message: 'User saved', id: data.id };
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
