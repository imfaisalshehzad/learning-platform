import {
    Body, ClassSerializerInterceptor,
    Controller,
    Get,
    HttpCode,
    Post,
    Req,
    UseGuards, UseInterceptors,
} from '@nestjs/common';
import {AuthenticationService} from "./authentication.service";
import {RegisterDto} from "./dto/resgister.dto";
import RequestWithUser from "./requestWithUser.interface";
import {CookieAuthenticationGuard} from "./cookie-authentication.guard";
import {LogInWithCredentialsGuard} from "./logInWithCredentialsGuard";
import JwtAuthenticationGuard from "./jwt-authentication.guard";
import {UsersService} from "../users/users.service";
import {ApiBearerAuth, ApiBody, ApiOperation, ApiTags} from "@nestjs/swagger";
import {LogInDto} from "./dto/login.dto";



@ApiBearerAuth()
@ApiTags('Authentication')
@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController {
    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly usersService: UsersService,
    ) {}

    @Post('register')
    @ApiOperation({ summary: 'Registration' })
    async register(@Body() registrationData: RegisterDto) {
        return this.authenticationService.register(registrationData);
    }

    @HttpCode(200)
    @UseGuards(LogInWithCredentialsGuard)
    @Post('login')
    @ApiOperation({ summary: 'Login' })
    @ApiBody({ type: LogInDto })
    async login(@Req() req: RequestWithUser) {
        const {user} = req;
        const accessTokenCookie = await this.authenticationService.getCookieWithJwtAccessToken(user.id);
        const {cookie, token} = await this.authenticationService.getCookieWithJwtRefreshToken(user.id);
        await this.usersService.setCurrentRefreshToken(token, user.id);
        req.res.setHeader('Set-Cookie', [accessTokenCookie, cookie]);
        return user;
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    async authenticate(@Req() request: RequestWithUser) {
        return request.user;
    }

    @HttpCode(200)
    @UseGuards(CookieAuthenticationGuard)
    @Post('logout')
    async logOut(@Req() request: RequestWithUser) {
        request.logOut();
        request.session.cookie.maxAge = 0;
    }

}
