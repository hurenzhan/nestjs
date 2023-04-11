import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';

@Controller('user')
export class UserController {
    constructor(
        private userService: UserService,
        private configService: ConfigService,
    ) {}

    @Get('queryAll')
    async getUsers(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Post('create')
    addUser(@Body() body: any): any {
        const { username, password } = body;

        const user = {
            username,
            password,
        } as User;

        return this.userService.create(user);
    }

    @Post('update')
    updateUser(@Body() body: any): any {
        const { id, username, password } = body;

        const user = {
            username,
            password,
        } as User;

        return this.userService.update(id, user);
    }

    @Post('remove')
    removeUser(@Body() body: any): any {
        const { id } = body;

        return this.userService.remove(id);
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
