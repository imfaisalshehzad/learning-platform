import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUploadDto} from './dto/create-upload.dto';
import {UpdateUploadDto} from './dto/update-upload.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {UploadEntity} from "./entities/upload.entity";
import {FindManyOptions, MoreThan, Repository} from "typeorm";
import {UserEntity} from "../users/entities/user.entity";

const relations = [
    'record',
    'record.subjects',
    'record.user',
]

@Injectable()
export class UploadService {

    constructor(
        @InjectRepository(UploadEntity)
        private uploadRepository: Repository<UploadEntity>
    ) {}


    async create(createUploadDto: CreateUploadDto) {

        const response = [];
        createUploadDto.asset.forEach(file => {
            const fileResponse = {
                originalName: file.originalName,
                mimetype: file.mimetype,
                file: file.path,
                size: file.size,
                type: createUploadDto.type,
                session: createUploadDto.session,
                profile: createUploadDto.profile,
            };
            response.push(fileResponse);
        });


        const item = await this.uploadRepository.create(response);
        await this.uploadRepository.save(item);
        return item;

    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        options?: FindManyOptions<UploadEntity>
    ) {
        const where: FindManyOptions<UploadEntity>['where'] = {}

        let separateCount = 0;

        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.uploadRepository.count();
        }

        const [items, count] = await this.uploadRepository.findAndCount({
            where,
            relations,
            order: {
                id: "DESC"
            },
            skip: offset,
            take: limit,
            ...options
        });

        return {
            items,
            total: page ? separateCount : count
        }
    }

    async findOne(id: number, user: UserEntity) {
        const res = await this.uploadRepository.findOne({
            where: {
                id
            },
            relations,
        });
        if (!res)
            throw new HttpException('Asset not found', HttpStatus.NOT_FOUND)

        return res;
    }

    async update(id: number, updateUploadDto: UpdateUploadDto) {
        return `This action updates a #${id} upload`;
    }

    async remove(id: number) {
        return `This action removes a #${id} upload`;
    }
}
