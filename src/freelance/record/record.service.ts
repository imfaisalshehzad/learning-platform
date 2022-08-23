import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateRecordDto} from './dto/create-record.dto';
import {UpdateRecordDto} from './dto/update-record.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {RecordFreelanceSessionEntity} from "./entities/record.entity";
import {FindManyOptions, Repository} from "typeorm";
import {UserEntity} from "../../users/entities/user.entity";
import {PostgresErrorHandling} from "../../utils/postgresErrorHandling";
import {stringToArray} from "../../utils/functions/utils.function";
import {UpdateAdminRecordApprovedDto} from "./dto/update-admin-record-approved.dto";
import {FreelanceFavourite} from "../favourite/entities/favourite.entity";
import {FREELANCE_FAVOURITE} from "../../utils/enum/enum.types";
import {TeacherEntity} from "../../teacher/entities/teacher.entity";

@Injectable()
export class RecordService {
    private relations: object = [
        'teacher',
        'subjects',
        'resource'
    ];

    constructor(
        @InjectRepository(RecordFreelanceSessionEntity) private recordFreelanceRepository: Repository<RecordFreelanceSessionEntity>,
        @InjectRepository(TeacherEntity) private teacherRepository: Repository<TeacherEntity>,
    ) {
    }

    async create(createRecordDto: CreateRecordDto, user: UserEntity) {

        try {
            const record = await this.recordFreelanceRepository.create({
                ...createRecordDto,
                teacher: user.teacher,
            });
            await this.recordFreelanceRepository.save(record);
            return record;
        } catch (error) {
            PostgresErrorHandling(error)
        }

    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        order_by?: string,
        sort_order?: string,
        from?: string,
        to?: string,
        subject?: string,
        rating?: string,
        price?: string,
    ) {

        let subjectArray;
        let separateCount = 0;
        const sortQuery = new Map();
        let orderKey = (order_by) ? order_by : "id"
        let sort = (sort_order) ? sort_order : "DESC"
        sortQuery.set(`record.${orderKey}`, `${sort}`);
        sortQuery.set(`subjects.id`, `DESC`);
        sortQuery.set(`teacher_favourites_count`, `DESC`);

        if (page)
            separateCount = await this.recordFreelanceRepository.count();

        if (subject)
            subjectArray = stringToArray(subject, ',');

        const orderBy = Object.fromEntries(sortQuery);
        const qb = await this.recordFreelanceRepository.createQueryBuilder("record");
        const results = await qb
            .leftJoinAndSelect("record.subjects", "subjects")
            .leftJoinAndSelect("record.resource", "resource")
            .leftJoinAndSelect("record.teacher", "teacher")

            .addSelect(
                qb
                    .subQuery()
                    .select('COUNT(*)')
                    .from(FreelanceFavourite, "favouriteQuery")
                    .where(`record.teacherId = favouriteQuery.teacherId`)
                    .andWhere(`"favouriteQuery"."type" != :queryParams`)
                    .getQuery()
                , "teacher_favourites_count"
            )

            .where(page ? `record.id > :pageNumber` : '1=1', {pageNumber: page})

            .andWhere((subject) ? `subjects.id IN (:...subjectsId)` : '1=1', {subjectsId: subjectArray})
            .andWhere((price) ? `record.price <= :priceParam` : '1=1', {priceParam: price})

            // .andWhere(
            //     qb
            //         .subQuery()
            //         .select('COUNT(*)')
            //         .from(FreelanceFavourite, "favouriteQuery")
            //         .where(`record.teacherId = favouriteQuery.teacherId`)
            //         .andWhere(`"favouriteQuery"."type" != :queryParams`)
            //         .getSql()
            //
            //     + " <= " + (rating) ? rating : 5
            // )

            .andWhere("record.isApproved = :sessionStatus", {
                sessionStatus: (process.env.NODE_ENV !== 'development')
            })
            .orderBy({...orderBy})
            .skip(offset)
            .take(limit)
            .setParameter("queryParams", FREELANCE_FAVOURITE.NONE)

        const items = await results.getMany();
        const count = await results.getCount();

        return {
            items,
            total: page ? separateCount : count
        }

    }

    async findOne(id: number, user: UserEntity) {

        const session = await this.recordFreelanceRepository.findOne({
            where: {
                id,
                teacher: {
                    id: user.teacher.id
                }
            },
            relations: this.relations,
        });

        if (!session) {
            throw new HttpException('Session not found.', HttpStatus.BAD_REQUEST)
        }
        return session

    }

    async updateApproved(id: number, updateAdminRecordApprovedDto: UpdateAdminRecordApprovedDto, user: UserEntity) {
        const update = await this.recordFreelanceRepository.update({
                id,
            },
            updateAdminRecordApprovedDto
        );

        if (!update.affected)
            throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);

        return await this.recordFreelanceRepository.findOne({
            where: {
                id,
            }
        })
    }

    async update(id: number, updateRecordDto: UpdateRecordDto, user: UserEntity) {

        try {

            const updateQuery = {...updateRecordDto, user, id}
            const preloadQuery = await this.recordFreelanceRepository.preload(updateQuery);
            await this.recordFreelanceRepository.save(preloadQuery);

            return await this.recordFreelanceRepository.findOne({
                where: {
                    id,
                    teacher: {
                        id: user.teacher.id
                    }
                },
                relations: this.relations,
            });

        } catch (e) {

            PostgresErrorHandling(e);
        }

    }

    async remove(id: number, user: UserEntity) {
        const deleteSession = await this.recordFreelanceRepository.delete({
            id,
            teacher: {
                id: user.teacher.id
            }
        });
        if (!deleteSession.affected) {
            throw new HttpException("Session not found", HttpStatus.BAD_REQUEST);
        }
    }

}
