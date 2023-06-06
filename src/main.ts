import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import 'winston-daily-rotate-file';
import { AllExceptionFilter } from './filters/all-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        // 关闭整个nestjs日志
        // logger: false,
        // logger: ['error', 'warn'],
    });

    const winstonLogger = app.get(WINSTON_MODULE_NEST_PROVIDER);
    app.useLogger(winstonLogger); // 使用 nest-winston 覆盖默认的日志
    app.setGlobalPrefix('api/v1');

    const httpAdapter = app.get(HttpAdapterHost);
    app.useGlobalFilters(new AllExceptionFilter(winstonLogger, httpAdapter)); // 全局注册异常过滤器

    await app.listen(8081);
}

bootstrap();
