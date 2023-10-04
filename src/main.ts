import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import 'winston-daily-rotate-file';
import { AllExceptionFilter } from './filters/all-exception.filter';
import helmet from 'helmet';
import retelimit from 'express-rate-limit';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        // 关闭整个nestjs日志
        // logger: false,
        // logger: ['error', 'warn'],
        cors: true,
    });

    const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    app.useLogger(winstonLogger); // 使用 nest-winston 覆盖默认的日志
    app.setGlobalPrefix('api/v1');

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionFilter(winstonLogger, httpAdapter)); // 全局注册异常过滤器

    // helmet 头部安全
    app.use(helmet());

    // rateLimit 限流
    app.use(
        retelimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
        }),
    );

    await app.listen(8081);
}

bootstrap();
