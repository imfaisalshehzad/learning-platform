import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Between, FindManyOptions, MoreThan, Repository} from "typeorm";
import {TeacherEntity} from "./entities/teacher.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {UpdateTeacherDto} from "./dto/update-teacher.dto";
import {PostgresErrorHandling} from "../utils/postgresErrorHandling";
import {currentTimeOnwardsDayEnd} from "../utils/functions/utils.function";
import {UserEntity} from "../users/entities/user.entity";
import {LiveFreelanceSessionEntity} from "../freelance/live/entities/live.entity";
import {RecordFreelanceSessionEntity} from "../freelance/record/entities/record.entity";
import {FreelanceFavourite} from "../freelance/favourite/entities/favourite.entity";
import {FREELANCE_FAVOURITE} from "../utils/enum/enum.types";
import {FreelanceReviewEntity} from "../freelance/reviews/entities/review.entity";
import moment from "moment";


@Injectable()
export class TeacherService {

    private db_relations = [
        'subjects',
        'user',
        'user.profile',
        'experience',
        'availability',
        'daysOff',
        'educations',
    ]

    constructor(
        @InjectRepository(TeacherEntity) private teacherRepository: Repository<TeacherEntity>,
        @InjectRepository(LiveFreelanceSessionEntity) private liveFreelanceRepository: Repository<LiveFreelanceSessionEntity>,
        @InjectRepository(RecordFreelanceSessionEntity) private recordFreelanceRepository: Repository<RecordFreelanceSessionEntity>,
        @InjectRepository(FreelanceFavourite) private favouriteRepository: Repository<FreelanceFavourite>,
        @InjectRepository(FreelanceReviewEntity) private freelanceReviewRepository: Repository<FreelanceReviewEntity>,
    ) {}

    async findAllTeachers(
        offset?: number,
        limit?: number,
        page?: number,
        sort_order?: string,
        order_by?: string,
        subject?: string,
        options?: FindManyOptions<TeacherEntity>
    ) {

        let separateCount = 0;
        const sortQuery = new Map();
        let orderKey = (order_by) ? order_by : "id"
        let sort = (sort_order) ? sort_order : "DESC"
        sortQuery.set(`teacher.${orderKey}`, `${sort}`);
        sortQuery.set('daysOff.id', "DESC");
        sortQuery.set('educations.id', "DESC");
        sortQuery.set('availability.id', "DESC");
        sortQuery.set('experience.id', "DESC");
        sortQuery.set('subjects.id', "DESC");
        const orderBy = Object.fromEntries(sortQuery);

        if (page) {
            separateCount = await this.teacherRepository.count();
        }

        const qb = this.teacherRepository.createQueryBuilder("teacher");
        const results = await qb
            .select()
            .leftJoinAndSelect("teacher.subjects", "subjects")
            .leftJoinAndSelect("teacher.experience", "experience", "teacher.id = experience.teacherId")
            .leftJoinAndSelect("teacher.availability", "availability", "teacher.id = availability.teacherId")
            .leftJoinAndSelect("teacher.daysOff", "daysOff", "teacher.id = daysOff.teacherId")
            .leftJoinAndSelect("teacher.educations", "educations", "teacher.id = educations.teacherId")
            .leftJoinAndSelect("teacher.user", "user", "teacher.id = user.teacherId")
            .leftJoinAndSelect("user.profile", "profile")

            .addSelect(
                qb
                    .subQuery()
                    .select('COUNT(*)', "totalCount")
                    .from(FreelanceFavourite, "favouriteSubQuery")
                    .where(`teacher.id = favouriteSubQuery.teacherId`)
                    .andWhere(`favouriteSubQuery.type != :queryParams`)
                    .getQuery()
                , "favourites_count")

            // .addSelect(
            //     qb
            //         .subQuery()
            //         .select('COUNT(*)', "totalRating")
            //         .from(FreelanceReviewEntity, "reviewSubQuery")
            //         .where(`teacher.id = reviewSubQuery.teacherId`)
            //         .andWhere(`reviewSubQuery.type != :queryParams`)
            //         .getQuery()
            //     , "profile_rating")

            // .where('user.teacherId IS NOT NULL')
            .andWhere((subject) ? `subjects.id = :subjectId` : '1=1', {subjectId: subject})
            .orderBy({
                ...orderBy
            })
            .skip(offset)
            .take(limit)
            .setParameter("queryParams", FREELANCE_FAVOURITE.NONE)

        const items = await results.getMany();
        const count = await results.getCount();

        return {
            items,
            total: page ? separateCount : count,
        }

    }

    async findOne(id: number) {
        const teacher = await this.teacherRepository.findOne({
            where: {
                id,
            },
            relations: this.db_relations,
        });

        if (!teacher) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return teacher
    }

    async update(id: number, updateTeacherDto: UpdateTeacherDto) {

        try {
            const updateQuery = {...updateTeacherDto, id}
            const preloadQuery = await this.teacherRepository.preload(updateQuery)
            await this.teacherRepository.save(preloadQuery)

            return await this.teacherRepository.findOne({
                where: {
                    id,
                },
                relations: this.db_relations,
            })
        } catch (e) {
            PostgresErrorHandling(e);
        }

    }

    async remove(id: number) {
        return `This action removes a #${id} student`;
    }


    async getFreelanceYourDaySessions(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        sort_order?: string,
        order_by?: string,
        options?: FindManyOptions<LiveFreelanceSessionEntity>
    ) {
        const today = moment().format("YYYY-MM-DD");
        const now = currentTimeOnwardsDayEnd(today);
        const where: FindManyOptions<LiveFreelanceSessionEntity>['where'] = {
            teacher: {
                id: user.teacher.id,
            },
            session_start: Between(now.currentMoment, now.tillDayEnd)
        }

        let separateCount = 0;
        let order = (order_by) ? order_by : 'session_start';
        let sort = (sort_order) ? sort_order : 'asc';
        let ordering = {[order]: `${sort}`}

        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.teacherRepository.count();
        }

        const [items, count] = await this.liveFreelanceRepository.findAndCount({
            where,
            order: ordering,
            skip: offset,
            take: limit,
            ...options
        });

        return {
            items,
            total: page ? separateCount : count
        }

    }

    async getFreelanceCalenderSessions(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        sort_order?: string,
        order_by?: string,
        from?: string,
        to?: string,
        options?: FindManyOptions<LiveFreelanceSessionEntity>
    ) {


        try {
            const where: FindManyOptions<LiveFreelanceSessionEntity>['where'] = {}

            let separateCount = 0;
            let order = (order_by) ? order_by : 'id';
            let sort = (sort_order) ? sort_order : 'desc';
            let ordering = {[order]: `${sort}`}

            if (page) {
                where.id = MoreThan(page)
                separateCount = await this.liveFreelanceRepository.count();
            }

            if (from && to) {
                const from_date = moment(from).startOf("day").toDate();
                const to_date = moment(to).endOf("day").toDate();
                where.session_start = Between(from_date, to_date);
            } else {
                const current_time = moment().toDate();
                where.session_start = MoreThan(current_time);

            }

            const [items, count] = await this.liveFreelanceRepository.findAndCount({
                where,
                relations: this.db_relations,
                order: ordering,
                skip: offset,
                take: limit,
                ...options
            });

            return {
                items,
                total: page ? separateCount : count
            }
        } catch (e) {
            PostgresErrorHandling(e);
        }


    }


    async getProfileRating(user: UserEntity) {

    }
}
