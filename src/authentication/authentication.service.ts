import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {UsersService} from "../users/users.service";
import * as bcrypt from "bcrypt"
import {RegisterDto} from "./dto/resgister.dto";
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from "@nestjs/config";
import {PostgresErrorHandling} from "../utils/postgresErrorHandling";
import {ENUM_ACTIVE, USER_ROLE} from "../utils/enum/enum.types";

@Injectable()
export class AuthenticationService {

    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    public async register(registrationData: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 8);
        try {
            if (registrationData.role === USER_ROLE.ADMIN) {
                registrationData = {
                    ...registrationData,
                    isActive: ENUM_ACTIVE.TRUE,
                    isPhoneNumberConfirmed: ENUM_ACTIVE.TRUE,
                }
            } else if (registrationData.role === USER_ROLE.TEACHER) {
                registrationData = {
                    ...registrationData,
                    isActive: ENUM_ACTIVE.TRUE,
                    isPhoneNumberConfirmed: ENUM_ACTIVE.TRUE,
                }
            } else if (registrationData.role === USER_ROLE.STUDENT) {
                registrationData = {
                    ...registrationData,
                    isActive: ENUM_ACTIVE.TRUE,
                    isPhoneNumberConfirmed: ENUM_ACTIVE.TRUE,
                }
            }


            if (registrationData?.profile) {
                registrationData = {
                    ...registrationData,
                }
            } else {
                registrationData = {
                    ...registrationData,
                    profile: [{
                        "id": 1, //freelance
                    }],
                }
            }
            // console.log(registrationData);
            const createdUser = await this.userService.create({
                ...registrationData,
                password: hashedPassword,
            });
            createdUser.password = undefined;
            return createdUser;
        } catch (error) {
            PostgresErrorHandling(error)
        }
    }

    public async getAuthenticatedUser(email: string, plainPassword: string) {
        try {
            const user = await this.userService.findByEmail(email);
            await this.verifyPassword(plainPassword, user.password);
            await this.profileIsActive(user);
            await this.profilePhoneConfirmation(user);
            return user;
        } catch (e) {
            throw new HttpException('Login failed. ' + e, HttpStatus.BAD_REQUEST)
        }
    }

    public async profileIsActive(profile: any) {
        if (profile && profile.isActive === ENUM_ACTIVE.FALSE) {
            throw new HttpException('Profile is pending for approval.', HttpStatus.BAD_REQUEST)
        }
    }

    public async profilePhoneConfirmation(profile: any) {
        if (profile && profile.isPhoneNumberConfirmed === ENUM_ACTIVE.FALSE) {
            throw new HttpException('Profile phone confirmation is pending.', HttpStatus.BAD_REQUEST)
        }
    }

    public async verifyPassword(plainPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(
            plainPassword,
            hashedPassword
        );
        if (!isPasswordMatching) {
            throw new HttpException('Wrong credential provided.', HttpStatus.BAD_REQUEST)
        }
    }

    public async getCookieWithJwtAccessToken(userId: number) {
        const payload: TokenPayloadInterface = {
            userId
        };
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_SECRET'),
            expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`
        });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`
    }

    public async getCookieWithJwtRefreshToken(userId: number) {
        const payload: TokenPayloadInterface = {userId};
        const token = this.jwtService.sign(payload, {
            secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`
        });
        const cookie = `Refresh=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
        return {
            cookie,
            token
        }
    }

}
