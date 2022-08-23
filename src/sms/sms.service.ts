import {BadRequestException, Injectable} from '@nestjs/common';
import {Twilio} from "twilio";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class SmsService {
    private twilioClient: Twilio;

    constructor(private readonly configService: ConfigService) {
        const accountSid = configService.get('TWILIO_ACCOUNT_SID')
        const authToken = configService.get('TWILIO_AUTH_TOKEN')

        this.twilioClient = new Twilio(accountSid, authToken);
    }

    initiatePhoneNumberVerification(phone: string) {
        const serviceSid = this.configService.get(('TWILIO_VERIFICATION_SERVICE_SID'));
        return this.twilioClient.verify.services(serviceSid).verifications.create({
            to: phone,
            channel: 'sms'
        });

    }

    async confirmPhoneNumber(userId: number, phoneNumber: string, verificationCode: string) {
        const serviceSid = this.configService.get('TWILIO_VERIFICATION_SERVICE_SID');
        const result = await this.twilioClient.verify.services(serviceSid).verificationChecks.create({
            to: phoneNumber,
            code: verificationCode,
        });

        if (!result.valid || result.status !== 'approved') {
            throw new BadRequestException('Wrong code provided');
        }

        return result;
    }

    async sendMessage(receiverPhoneNumber: string, message: string) {
        const senderPhoneNumber = this.configService.get('');
        return this.twilioClient.messages.create({
            body: message,
            from: senderPhoneNumber,
            to: receiverPhoneNumber
        })
    }

}
