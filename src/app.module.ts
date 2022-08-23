import {CacheModule, Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ConfigModule} from '@nestjs/config';
import {DatabaseModule} from './database/database.module';
import {PostModule} from './post/post.module';
import {UsersModule} from './users/users.module';
import {AuthenticationModule} from './authentication/authentication.module';
import {APP_FILTER, RouterModule, Routes} from "@nestjs/core";
import {ExceptionsLoggerFilter} from "./utils/exceptionsLogger.filter";
import {CategoriesModule} from './categories/categories.module';
import {SmsService} from './sms/sms.service';
import {SmsController} from './sms/sms.controller';
import {EducationModule} from './education/education.module';
import {ExperienceModule} from './experience/experience.module';
import {AvailabilityModule} from './availability/availability.module';
import {DaysOffModule} from './daysoff/daysoff.module';
import {FreelanceSubjectModule} from './freelance/subject/subject.module';
import {RecordFreelanceModule} from './freelance/record/record.module';
import {LiveFreelanceModule} from './freelance/live/live.module';
import {UploadModule} from './upload/upload.module';
import {TeacherModule} from './teacher/teacher.module';
import {StudentModule} from './student/student.module';
import {SchoolModule} from './school/school.module';
import {FreelanceReviewsModule} from './freelance/reviews/reviews.module';
import {RolesModule} from './roles/roles.module';
import {PurchaseModule} from './purchase/purchase.module';
import {ScheduleModule} from "@nestjs/schedule";
import {NotificationModule} from './notification/notification.module';
import {SchoolHomeworkModule} from './homework/homework.module';
import {SchoolExamsModule} from './exams/exams.module';
import {SchoolFeedbackModule} from './feedback/feedback.module';
import {FavouriteModule} from './freelance/favourite/favourite.module';
import {ChallengeModule} from './freelance/challenge/challenge.module';
import {MailModule} from './mail/mail.module';
import {MailController} from "./mail/mail.controller";
import {MailService} from "./mail/mail.service";
import configuration from "./config/configuration";
import * as Joi from "joi";
import './utils/polyfill';

const routers: Routes = [
    {
        path: 'freelance',
        module: RecordFreelanceModule,
    },
    {
        path: 'freelance',
        module: LiveFreelanceModule,
    },
    {
        path: 'freelance',
        module: FreelanceReviewsModule,
    },
    {
        path: 'freelance',
        module: FreelanceSubjectModule,
    },
    {
        path: 'freelance',
        module: FavouriteModule,
    },
]

@Module({
    imports: [
        CacheModule.register(),
        ScheduleModule.forRoot(),
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
            validationSchema: Joi.object({
                DB_HOST: Joi.string().required(),
                DB_PORT: Joi.number().required(),
                DB_USERNAME: Joi.string().required(),
                DB_PASSWORD: Joi.string().required(),
                DB_DATABASE: Joi.string().required(),
                DB_SYNCHRONIZE: Joi.boolean().required(),
                SERVER_PORT: Joi.number().required(),
                NODE_ENV: Joi.string().required(),

                JWT_SECRET: Joi.string().required(),
                JWT_EXPIRATION_TIME: Joi.string().required(),
                JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
                JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),

                SEND_GRID_KEY: Joi.string().required(),

                MASTERCARD_MID: Joi.string().required(),
                MASTERCARD_MERCHANT: Joi.string().required(),
                MASTERCARD_BASE_URL: Joi.string().required(),
                MASTERCARD_PASSWORD: Joi.string().required(),

                SESSION_SECRET: Joi.string().required(),
                TWILIO_ACCOUNT_SID: Joi.string().required(),
                TWILIO_AUTH_TOKEN: Joi.string().required(),
                TWILIO_SENDER_PHONE_NUMBER: Joi.string().required(),
                TWILIO_VERIFICATION_SERVICE_SID: Joi.string().required(),
                UPLOADED_FILES_DESTINATION: Joi.string().required(),
                UPLOADED_FILES_LIMIT: Joi.number().required(),

                GRAPHQL_PLAYGROUND: Joi.number(),

            })
        }),
        DatabaseModule,
        RouterModule.register(routers),
        PostModule,
        UsersModule,
        AuthenticationModule,
        CategoriesModule,
        EducationModule,
        ExperienceModule,
        AvailabilityModule,
        DaysOffModule,
        FreelanceSubjectModule,
        RecordFreelanceModule,
        LiveFreelanceModule,
        UploadModule,
        TeacherModule,
        StudentModule,
        SchoolModule,
        FreelanceReviewsModule,
        RolesModule,
        PurchaseModule,
        NotificationModule,
        SchoolHomeworkModule,
        SchoolExamsModule,
        SchoolFeedbackModule,
        FavouriteModule,
        ChallengeModule,
        MailModule,
    ],
    controllers: [AppController, SmsController, MailController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: ExceptionsLoggerFilter,
        },
        AppService,
        SmsService,
        MailService,
    ],
})
export class AppModule {}




