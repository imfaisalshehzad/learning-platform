import {Module} from '@nestjs/common';
import {UploadService} from './upload.service';
import {UploadController} from './upload.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UploadEntity} from "./entities/upload.entity";
import {FileSystemStoredFile, NestjsFormDataModule} from "nestjs-form-data";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [
        TypeOrmModule.forFeature([UploadEntity]),
        NestjsFormDataModule.configAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                storage: FileSystemStoredFile,
                fileSystemStoragePath: './tmp/uploads/',
                autoDeleteFile: false,
                limits: {
                    files: configService.get('UPLOADED_FILES_LIMIT'),
                }
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [UploadController],
    providers: [UploadService],
    exports: [UploadService]
})
export class UploadModule {}
