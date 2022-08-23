import {Controller, Post, Query} from '@nestjs/common';
import { MailService } from './mail.service';
import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";



@ApiBearerAuth()
@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // @Post('send')
  // async sendEmail(@Query('email') email) {
  //   const mail = {
  //     to: email,
  //     subject: 'Greeting Message from NestJS Sendgrid',
  //     from: '<send_grid_email_address>',
  //     text: 'Hello World from NestJS Sendgrid',
  //     html: '<h1>Hello World from NestJS Sendgrid</h1>'
  //     to: 'recipient@example.org',
  //     from: 'sender@example.org',
  //     templateId: 'd-f43daeeaef504760851f727007e0b5d0',
  //     dynamic_template_data: {
  //       subject: 'Testing Templates',
  //       name: 'Some One',
  //       city: 'Denver',
  //     },
  //   };
  //
  //   return await this.mailService.send(mail);
  // }


}
