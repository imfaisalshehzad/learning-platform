import {Module} from '@nestjs/common';
import {UsersModule} from "../users/users.module";
import {PassportModule} from "@nestjs/passport";
import {AuthenticationService} from "./authentication.service";
import {LocalStrategy} from "./local.strategy";
import {AuthenticationController} from './authentication.controller';
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtModule} from "@nestjs/jwt";
import {JwtStrategy} from "./jwt.strategy";
import {LocalSerializer} from "./local.serializer";
import {TeacherModule} from "../teacher/teacher.module";

@Module({
    imports: [
        PassportModule,
        ConfigModule,
        UsersModule,
        TeacherModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {
                    expiresIn: `${configService.get('JWT_EXPIRATION_TIME')}s`,
                }
            })
        }),
    ],
    providers: [AuthenticationService, LocalStrategy, JwtStrategy, LocalSerializer],
    controllers: [AuthenticationController],
})
export class AuthenticationModule {}

