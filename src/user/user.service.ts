import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOne(userId: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { userId } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return await this.userRepository.save(user);
  }

  async update(userId: string, userData: Partial<User>): Promise<User> {
    await this.userRepository.update(userId, userData);
    return this.userRepository.findOne({ where: { userId } });
  }

  async delete(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
