import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from '../logs/logs.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Logs)
        private readonly logsRepository: Repository<Logs>,
    ) {}

    // 查询所有用户
    findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    // 根据用户 id 查询用户信息
    findProfile(id: number): Promise<User> {
        return this.userRepository.findOne({
            where: { id },
            relations: {
                profile: true,
            },
        });
    }

    // 根据 id 查询用户
    findOne(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }

    // 创建用户
    async create(user: User): Promise<User> {
        const userEntity: User = await this.userRepository.create(user);
        return this.userRepository.save(userEntity);
    }

    // 根据 id 更新用户
    async update(id: number, user: Partial<User>): Promise<UpdateResult> {
        return this.userRepository.update(id, user);
    }

    // 根据 id 删除用户
    remove(id: number): Promise<DeleteResult> {
        return this.userRepository.delete(id);
    }

    async findUserLogs(id: number): Promise<Logs[]> {
        const user = await this.findOne(id);
        return this.logsRepository.find({
            where: { user },
            relations: {
                user: true,
            },
        });
    }

    getUsers(num: any): any {
        const res = [];
        for (let i = 0; i < num; i++) {
            res.push(i);
        }
        return res;
    }
}
