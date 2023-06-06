import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
} from '@nestjs/common';
import { QueryFailedError, TypeORMError } from 'typeorm';
import { SQLErrorEnum } from '../enum/error.enum';

@Catch(TypeORMError)
export class TypeormFilter implements ExceptionFilter {
    catch(exception, host: ArgumentsHost) {
        const ctx = host.switchToHttp();

        let code = 500;
        let msg = exception['message'];

        if (exception instanceof QueryFailedError) {
            code = exception.driverError.errno;

            const enumMsg = SQLErrorEnum[exception.driverError.errno];
            if (enumMsg) msg = enumMsg;
        }

        // 获取响应对象
        const response = ctx.getResponse();
        response.status(500).json({
            code,
            timestamp: new Date().toISOString(),
            message: msg,
        });
    }
}
