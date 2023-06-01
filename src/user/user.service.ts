import { Injectable } from '@nestjs/common';
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
    findAll(query: getUserDto): Promise<User[]> {
        const {
            limit = 10,
            page,
            username = null,
            gender = null,
            role = null,
        } = query;

        // return this.userRepository.find({
        //     select: {
        //         id: true,
        //         username: true,
        //         profile: {
        //             gender: true,
        //         },
        //         roles: {
        //             name: true,
        //         },
        //     },
        //     relations: {
        //         profile: true,
        //         roles: true,
        //     },
        //     where: {
        //         username,
        //         profile: {
        //             gender,
        //         },
        //         roles: {
        //             id: role,
        //         },
        //     },
        //     take: limit, // 每页显示多少条
        //     skip: (page - 1) * limit, // 跳过多少条
        // });

        // SELECT `User`.`id` AS `User_id`, `User`.`username` AS `User_username`, `User`.`password` AS `User_password`, `User__User_profile`.`id` AS `User__User_profile_id`, `User__User_profile`.`gender` AS `User__User_profile_gender`
        // 	, `User__User_profile`.`photo` AS `User__User_profile_photo`, `User__User_profi
        // le`.`address` AS `User__User_profile_address`, `User__User_profile`.`userId` AS `User__User_profile_userId`, `User__User_roles`.`id` AS `User__User_roles_id`, `User__User_roles`.`name` AS `User__User_roles_name`
        // FROM `user` `User`
        // 	LEFT JOIN `profile` `User__User_profile` ON `User__User_profile`.`userId` = `Use
        // r`.`id`
        // 	LEFT JOIN `user_roles` `User_User__User_roles` ON `User_User__User_roles`.`userId` = `User`.`id`
        // 	LEFT JOIN `roles` `User__User_roles` ON `User__User_roles`.`id` = `User_User__User_roles`.`rolesId`
        // WHERE `User__User_profile`.`gender` = ?
        // 	AND `User__User_roles`.`id` = ?
        // 	AND `User`.`id` IN (1)

        const obj = {
            'user.username': username,
            'profile.gender': gender,
            'roles.id': role,
        };

        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .leftJoinAndSelect('user.roles', 'roles');

        conditionUtil_CO<User>(queryBuilder, obj);

        return queryBuilder.getMany();

        // return queryBuilder.getMany();

        // return this.userRepository
        //     .createQueryBuilder('user')
        //     .leftJoinAndSelect('user.profile', 'profile')
        //     .leftJoinAndSelect('user.roles', 'roles')
        //     .where(username ? 'user.username = :username' : 'TRUE', {
        //         username,
        //     })
        //     .andWhere(gender ? 'profile.gender = :gender' : 'TRUE', { gender })
        //     .andWhere(role ? 'roles.id = :role' : 'TRUE', { role })
        //     .getMany();
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

    // 查询用户日志
    async findUserLogs(id: number): Promise<Logs[]> {
        const user = await this.findOne(id);
        return this.logsRepository.find({
            where: { user },
            relations: {
                user: true,
            },
        });
    }

    // 根据 result 查询分组日志数量
    findLogsByGroup(id: number) {
        // return this.logsRepository.query(
        //     `SELECT logs.result, COUNT(logs.result) AS count FROM logs, user WHERE user.id = logs.userId AND user.id = ${id} GROUP BY logs.result`,
        // );
        return (
            this.logsRepository
                .createQueryBuilder('logs')
                .select('logs.result', 'result')
                .addSelect('COUNT(logs.result)', 'count')
                .leftJoinAndSelect('logs.user', 'user') // logs.user 为实体 Logs 中的 user 字段也是指向 User 实体的外键
                .where('user.id = :id', { id })
                .groupBy('logs.result')
                .orderBy('count', 'DESC')
                .addOrderBy('result', 'DESC') // 添加多个排序条件
                // .offset(2)
                .limit(3) // 查询前 3 条
                .getRawMany()
        );
    }

    getUsers(num: any): any {
        const res = [];
        for (let i = 0; i < num; i++) {
            res.push(i);
        }
        return res;
    }
}
