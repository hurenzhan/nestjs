import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    find(username: string): Promise<User> {
        return this.userRepository.findOne({ where: { username } });
    }

    async create(user: User): Promise<User> {
        const userEntity: User = await this.userRepository.create(user);
        return this.userRepository.save(userEntity);
    }

    async update(id: number, user: Partial<User>): Promise<UpdateResult> {
        return this.userRepository.update(id, user);
    }

    remove(id: number): Promise<DeleteResult> {
        return this.userRepository.delete(id);
    }

    getUsers(num: any): any {
        const res = [];
        for (let i = 0; i < num; i++) {
            res.push(i);
        }
        return res;
    }
}
