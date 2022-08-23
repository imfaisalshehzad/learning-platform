import {BaseExceptionFilter} from "@nestjs/core";
import {ArgumentsHost, Catch} from "@nestjs/common";

@Catch()
export class ExceptionsLoggerFilter extends BaseExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        super.catch(exception, host);
    }
}
