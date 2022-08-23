import {PostgresErrorCode} from "../database/postgresErrorCodes.enum";
import {HttpException, HttpStatus} from "@nestjs/common";
export function PostgresErrorHandling(error: any): unknown {
    switch (error && error.code) {

        case (PostgresErrorCode.EmptyViolation):
            throw new HttpException(error.code + ': ' + 'Database error message.', HttpStatus.BAD_REQUEST);
        case (PostgresErrorCode.UniqueViolation):
            throw new HttpException(error.code + ': ' + 'Similar data already exists.', HttpStatus.BAD_REQUEST)
        case (PostgresErrorCode.ConstraintViolation):
            throw new HttpException(error.code + ': ' + 'Constraint not found.', HttpStatus.BAD_REQUEST)
        default:
            throw new HttpException(error.code + ': ' + 'Something went wrong.', HttpStatus.INTERNAL_SERVER_ERROR)

    }
}
