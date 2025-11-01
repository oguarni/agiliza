import { User } from '../models';
import UserModel from '../models/User';

// User data transfer object for creation
interface CreateUserDTO {
  name: string;
  email: string;
  password_hash: string;
}

// UserRepository class - Data Access Layer
class UserRepository {
  /**
   * Find a user by email
   * @param email - User's email address
   * @returns User instance or null if not found
   */
  async findByEmail(email: string): Promise<UserModel | null> {
    try {
      const user = await User.findOne({
        where: { email },
      });
      return user;
    } catch (error) {
      throw new Error(`Error finding user by email: ${error}`);
    }
  }

  /**
   * Find a user by ID
   * @param id - User's ID
   * @returns User instance or null if not found
   */
  async findById(id: number): Promise<UserModel | null> {
    try {
      const user = await User.findByPk(id);
      return user;
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error}`);
    }
  }

  /**
   * Create a new user
   * @param userData - User creation data
   * @returns Created user instance
   */
  async create(userData: CreateUserDTO): Promise<UserModel> {
    try {
      const user = await User.create(userData);
      return user;
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }
}

export default UserRepository;
