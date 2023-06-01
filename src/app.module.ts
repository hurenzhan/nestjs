import { Global, Logger, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsModule } from './logs/logs.module';
import { RolesModule } from './roles/roles.module';
import * as process from 'process';
import { connectionParams } from '../ormconfig';

// import configuration from './configuration';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

@Global() // 把当前模块(app.module)注入的模块作为全局模块注册
@Module({
    imports: [
        // 配置文件加载及校验
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath,
            load: [() => dotenv.config({ path: '.env' })], // 加载默认配置
            // load: [configuration],
            validationSchema: Joi.object({
                NODE_ENV: Joi.string()
                    .valid('development', 'production')
                    .default('development'),
                DB_PORT: Joi.number().default(8081),
                DB_HOST: Joi.string().ip(),
                DB_TYPE: Joi.string().valid('mysql', 'postgres'),
                DB_DATABASE: Joi.string().required(),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_SYNC: Joi.boolean().default(false),
            }),
        }),
        // 通过配置连接数据库
        TypeOrmModule.forRoot(connectionParams),
        // 注入日志模块
        // LoggerModule.forRoot({
        //     pinoHttp: {
        //         transport:
        //             process.env.NODE_ENV === 'development'
        //                 ? {
        //                       target: 'pino-pretty', // 使用 pino-pretty 格式化日志中间件
        //                       options: {
        //                           colorize: true, // 将日志格式化为可读的格式
        //                       },
        //                   }
        //                 : {
        //                       target: 'pino-roll',
        //                       options: {
        //                           file: join('logs', 'log.txt'), // 日志文件
        //                           frequency: 'daily', // 生产文件的频率
        //                           size: '10m', // 每个日志文件的大小
        //                           mkdir: true, // 自动创建日志文件夹
        //                       },
        //                   },
        //     },
        // }),
        UserModule,
        LogsModule,
        RolesModule,
    ],
    controllers: [],
    providers: [
        // 当前模块注入日志
        Logger,
    ],
    exports: [
        // 导出日志模块
        Logger,
    ],
})
export class AppModule {}
