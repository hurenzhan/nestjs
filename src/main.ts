import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger } from 'winston';
import * as winston from 'winston';
import { utilities, WinstonModule } from 'nest-winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
    // 创建日志实例
    const instance = createLogger({
        transports: [
            new winston.transports.Console({
                level: 'info',
                // 日志输出格式(字符串拼接)
                format: winston.format.combine(
                    winston.format.timestamp(), // 时间戳
                    utilities.format.nestLike(), // nest 风格
                ),
            }),
            new winston.transports.DailyRotateFile({
                level: 'warn',
                dirname: 'logs', // 日志文件夹
                filename: 'application-%DATE%.log',
                datePattern: 'YYYY-MM-DD-HH', // 按小时切割
                zippedArchive: true, // 是否压缩
                maxSize: '20m', // 单个文件最大大小
                maxFiles: '14d', // 最多保留 14 天的日志
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.simple(),
                ),
            }),
            new winston.transports.DailyRotateFile({
                level: 'info',
                dirname: 'logs', // 日志文件夹
                filename: 'info-%DATE%.log',
                datePattern: 'YYYY-MM-DD-HH', // 按小时切割
                zippedArchive: true, // 是否压缩
                maxSize: '20m', // 单个文件最大大小
                maxFiles: '14d', // 最多保留 14 天的日志
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.simple(),
                ),
            }),
        ],
    });
    const app = await NestFactory.create(AppModule, {
        // logger: ['error', 'warn'], // 日志级别
        logger: WinstonModule.createLogger({ instance }), // 重构官方日志实例
        bufferLogs: true, // 是否缓冲日志
    });
    app.setGlobalPrefix('api/v1');
    await app.listen(8081);
}

bootstrap();
