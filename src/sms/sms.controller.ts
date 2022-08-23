import {BadRequestException, Body, Controller, Post, Req, UseGuards} from '@nestjs/common';
import {SmsService} from "./sms.service";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RequestWithUser from "../authentication/requestWithUser.interface";
import {CheckVerificationDto} from "./dto/check-verification.dto";
import {UsersService} from "../users/users.service";
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";



@ApiBearerAuth()
@ApiTags('SMS')
@Controller('sms')
export class SmsController {
    constructor(
        private readonly smsService: SmsService,
        private readonly userService: UsersService
    ) {}

    @Post('send')
    @UseGuards(JwtAuthenticationGuard)
    async initiatePhoneNumberVerification(@Req() request: RequestWithUser) {
        if (request.user.isPhoneNumberConfirmed) {
            throw new BadRequestException('Phone number already confirmed')
        }
        await this.smsService.initiatePhoneNumberVerification(request.user.phone)
    }

    @Post('verify')
    @UseGuards(JwtAuthenticationGuard)
    async checkVerificationCode(@Req() request: RequestWithUser, @Body() verificationData: CheckVerificationDto) {
        if (request.user.isPhoneNumberConfirmed) {
            throw new BadRequestException('Phone number already confirmed');
        }
        await this.smsService.confirmPhoneNumber(request.user.id, request.user.phone, verificationData.code);
        await this.userService.markPhoneNumberAsConfirmed(request.user.id)
    }
}
