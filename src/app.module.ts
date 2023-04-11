import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/config.enum';
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
import { Roles } from './roles/roles.entity';
import { Logs } from './logs/logs.entity';
// import configuration from './configuration';

const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;

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
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService], // 读取配置文件
            useFactory: (configService: ConfigService) =>
                ({
                    type: configService.get(ConfigEnum.DB_TYPE),
                    host: configService.get(ConfigEnum.DB_HOST),
                    port: configService.get(ConfigEnum.DB_PORT),
                    username: configService.get(ConfigEnum.DB_USERNAME),
                    password: configService.get(ConfigEnum.DB_PASSWORD),
                    database: configService.get(ConfigEnum.DB_DATABASE),
                    entities: [User, Profile, Roles, Logs],
                    synchronize: configService.get(ConfigEnum.DB_SYNC),
                    logging: ['error'],
                } as TypeOrmModuleOptions),
        }),
        UserModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
