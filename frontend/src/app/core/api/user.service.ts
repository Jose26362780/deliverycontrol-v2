import userMock from '../mock/user.json';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  avatarUrl: string;
  role: string;
}

class UserService {
  private user: UserProfile = { ...userMock };

  async getUser(): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return { ...this.user };
  }

  async updateUser(updates: Partial<UserProfile>): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    this.user = { ...this.user, ...updates };
    return { ...this.user };
  }
}

export const userService = new UserService();
