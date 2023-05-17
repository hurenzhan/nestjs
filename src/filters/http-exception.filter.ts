import {
    Catch,
    ArgumentsHost,
    ExceptionFilter,
    HttpException,
    LoggerService,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private logger: LoggerService) {}

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        // 获取响应对象
        const response = ctx.getResponse();
        // 获取请求对象
        const request = ctx.getRequest();
        // 获取异常状态码
        const status = exception.getStatus();
        this.logger.error(
            exception.message,
            exception.stack,
            'HttpExceptionFilter',
        );

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: exception.message ?? HttpException.name,
        });
    }
}
