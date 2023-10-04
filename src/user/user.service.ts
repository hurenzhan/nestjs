import { HttpException, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logs } from '../logs/logs.entity';
import { conditionUtil_CO } from '../utils/db.helper';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Logs)
        private readonly logsRepository: Repository<Logs>,
    ) {}

    // 查询所有用户
    async findAll(query: getUserDto): Promise<User[]> {
        const {
            limit = 10,
            page = 1,
            username = null,
            gender = null,
            role = null,
        } = query;

        const offset = (page - 1) * limit;

        // const obj = {
        //     'user.username': username,
        //     'profile.gender': gender,
        //     'roles.id': role,
        // };

        const sql = `
            SELECT user.*, profile.*, roles.*
            FROM user
            LEFT JOIN profile ON user.id = profile.userId
            LEFT JOIN user_roles ON user.id = user_roles.userId
            LEFT JOIN roles ON user_roles.rolesId = roles.id
            WHERE (${
                username && `"${username}"`
            } IS NULL OR user.username = "${username}")
            OR profile.gender = ${gender}
            OR roles.id = ${role}
            LIMIT ${limit}
            OFFSET ${offset}
        `;
        return await this.userRepository.query(sql);

        // const obj = {
        //   'user.username': username,
        //   'profile.gender': gender,
        //   'roles.id': role,
        // };
        //
        // const queryBuilder = this.userRepository
        //   .createQueryBuilder('user')
        //   .leftJoinAndSelect('user.profile', 'profile')
        //   .leftJoinAndSelect('user.roles', 'roles');
        //
        // conditionUtil_CO<User>(queryBuilder, obj);
        //
        // return queryBuilder.getMany();
    }

    // 根据用户 id 查询用户信息
    findProfile(id: number): Promise<User> {
        const sql = `
            SELECT user.*, profile.*
            FROM user
            LEFT JOIN profile ON user.id = profile.userId
            WHERE user.id = ${id}
        `;
        return this.userRepository.query(sql);

        // return this.userRepository.findOne({
        //     where: { id },
        //     relations: {
        //         profile: true,
        //     },
        // });
    }

    // 根据 id 查询用户
    findOne(id: number): Promise<User> {
        return this.userRepository.findOne({ where: { id } });
    }

    // 创建用户
    async create(user: User) {
        // 使用sql语句创建用户
        const sql = `
            INSERT INTO user (username, password) VALUES ("${user.username}", "${user.password}")
        `;
        return await this.userRepository.query(sql);

        // const userEntity: User = await this.userRepository.create(user);
        // return await this.userRepository.save(userEntity);
    }

    // 根据 id 更新用户
    async update(id: number, user: Partial<User>): Promise<UpdateResult> {
        // 使用sql语句更新用户
        const sql = `
            UPDATE user SET username = "${user.username}", password = "${user.password}" WHERE id = ${id}
        `;
        return await this.userRepository.query(sql);

        // return this.userRepository.update(id, user);
    }

    // 根据 id 删除用户
    async remove(id: number): Promise<DeleteResult> {
        // 使用sql语句删除用户
        const sql = `
            DELETE FROM user WHERE id = ${id}
        `;
        return await this.userRepository.query(sql);

        // return this.userRepository.delete(id);
        // const user = await this.findOne(id);
        // return this.userRepository.remove(user);
    }

    // 查询用户日志
    async findUserLogs(id: number): Promise<Logs[]> {
        const sql = `
            SELECT logs.*, user.username
            FROM logs
            LEFT JOIN user ON logs.userId = user.id
            WHERE user.id = ${id}
        `;

        return await this.logsRepository.query(sql);

        // const user = await this.findOne(id);
        // return this.logsRepository.find({
        //     where: { user },
        //     relations: {
        //         user: true,
        //     },
        // });
    }

    // 根据 result 查询分组日志数量
    findLogsByGroup(id: number) {
        return this.logsRepository.query(
            `SELECT logs.result, COUNT(logs.result) AS count FROM logs, user WHERE user.id = logs.userId AND user.id = ${id} GROUP BY logs.result ORDER BY COUNT(logs.result) DESC`,
        );
        // return (
        //     this.logsRepository
        //         .createQueryBuilder('logs')
        //         .select('logs.result', 'result')
        //         .addSelect('COUNT(logs.result)', 'count')
        //         .leftJoinAndSelect('logs.user', 'user') // logs.user 为实体 Logs 中的 user 字段也是指向 User 实体的外键
        //         .where('user.id = :id', { id })
        //         .groupBy('logs.result')
        //         .orderBy('count', 'DESC')
        //         .addOrderBy('result', 'DESC') // 添加多个排序条件
        //         // .offset(2)
        //         .limit(3) // 查询前 3 条
        //         .getRawMany()
        // );
    }

    getUsers(num: any): any {
        const res = [];
        for (let i = 0; i < num; i++) {
            res.push(i);
        }
        return res;
    }
}
