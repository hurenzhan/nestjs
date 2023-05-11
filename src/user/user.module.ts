import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Logs } from '../logs/logs.entity';

@Module({
    imports: [
        // 注入 User 和 Logs 实体
        TypeOrmModule.forFeature([User, Logs]),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
