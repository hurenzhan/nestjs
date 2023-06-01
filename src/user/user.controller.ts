import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Logger,
    Param,
    Patch,
    Post,
    Query,
    Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { Logs } from '../logs/logs.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { request } from 'express';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
        @Inject(WINSTON_MODULE_NEST_PROVIDER) // 注入全局注册的日志实例
        private readonly logger: Logger, // 全局注册的日志实例
    ) {
        this.logger.log('UserController init');
    }

    // 查询所有用户
    // @Get('queryAll')
    // async getUsers(): Promise<User[]> {
    //     this.logger.warn('请求 getUsers 接口成功');
    //     return this.userService.findAll();
    // }

    // 查询用户
    @Get()
    async getUsers(@Query() query: getUserDto): Promise<User[]> {
        this.logger.warn('请求 getUsers 接口成功');
        return this.userService.findAll(query);
    }

    // 根据 id 查询用户信息
    @Get('profile')
    async getProfile(@Req() request): Promise<User> {
        const { id }: any = request.query;
        return this.userService.findProfile(id);
    }

    // 创建用户
    @Post('create')
    addUser(@Body() body: any): any {
        const { username, password } = body;

        const user = {
            username,
            password,
        } as User;

        return this.userService.create(user);
    }

    // 更新用户
    @Post('update/:id')
    updateUser(@Body() body: any, @Param('id') id: number): any {
        const { username, password } = body;

        const user = {
            username,
            password,
        } as User;

        return this.userService.update(id, user);
    }

    // 删除用户
    @Delete('/:id')
    removeUser(@Param('id') id: number): any {
        return this.userService.remove(id);
    }

    // 根据 id 查询用户日志
    @Get('logs')
    async getLogs(@Req() request): Promise<Logs[]> {
        const { id }: any = request.query;
        return this.userService.findUserLogs(id);
    }

    // 根据用户 id 查询日志结果分组统计
    @Get('logsByGroup')
    async getLogsByGroup(@Req() request): Promise<Logs[]> {
        const { id }: any = request.query;
        const res: any = await this.userService.findLogsByGroup(id);
        return res?.map((item) => ({ result: item.result, count: item.count }));
    }

    // @Get()
    // getUsers(@Req() request: any): any {
    //     console.log(request, 'request');
    //     const DATABASE_USER = this.configService.get(ConfigEnum.DATABASE_USER);
    //     const DATABASE_PASSWORD = this.configService.get(
    //       ConfigEnum.DATABASE_PASSWORD,
    //     );
    //     const TEST_COMMON = this.configService.get('TEST_COMMON');
    //     console.log(DATABASE_USER, 'DATABASE_USER');
    //     console.log(DATABASE_PASSWORD, 'DATABASE_PASSWORD');
    //     console.log(TEST_COMMON, 'TEST_COMMON');
    //     const db = this.configService.get('db');
    //     console.log(db, 'db');
    //     const { num }: any = request.query;
    //     return this.userService.getUsers(num);
    // }
}
