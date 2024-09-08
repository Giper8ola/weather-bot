import {
    ExceptionFilter,
    Catch,
    Logger,
    BadRequestException
} from '@nestjs/common';

@Catch(BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: BadRequestException) {
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        // Логируем информацию об исключении
        this.logger.error(`HTTP Exception thrown:
      Status: ${status},
      Response: ${JSON.stringify(exceptionResponse)}`);
    }
}
