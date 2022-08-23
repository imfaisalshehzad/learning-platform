import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateExamDto} from './dto/create-exam.dto';
import {UpdateExamDto} from './dto/update-exam.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {SchoolExamEntity} from "./entities/exam.entity";
import {FindManyOptions, In, MoreThan, Repository} from "typeorm";
import {UserEntity} from "../users/entities/user.entity";
import {PostgresErrorHandling} from "../utils/postgresErrorHandling";
import {UsersService} from "../users/users.service";
import {SchoolExamResultEntity} from "./entities/exam.results.entity";
import {CreateExamResultsDto} from "./dto/create-exam-results.dto";
import {UpdateExamResultsDto} from "./dto/update-exam-results.dto";

@Injectable()
export class ExamsService {

    private examResultAlias = 'examResult'
    private examAlias = 'exam'

    private db_relations = [
        'classGroup',
        'subject',
        'teacher',
        'terms',
        'student',
        'student.results',
    ]

    constructor(
        @InjectRepository(SchoolExamEntity) private examRepository: Repository<SchoolExamEntity>,
        @InjectRepository(SchoolExamResultEntity) private examResultsRepository: Repository<SchoolExamResultEntity>,
        private readonly userService: UsersService,
    ) {}

    async create(createExamDto: CreateExamDto, user: UserEntity) {

        const loggedIn = await this.userService.getTeacherOrStudent(user);

        const exam = await this.examRepository.create({
            ...createExamDto,
            teacher: loggedIn?.teacher,
        });

        await this.examRepository.save(exam).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );

        return exam;
    }

    async findAll(
        offset?: number,
        limit?: number,
        page?: number,
        sort_order?: string,
        order_by?: string,
        subject?: string,
        options?: FindManyOptions<SchoolExamEntity>
    ) {
        let separateCount = 0;
        const sortQuery = new Map();
        let orderKey = (order_by) ? order_by : "id"
        let sort = (sort_order) ? sort_order : "DESC"
        sortQuery.set(`exam.${orderKey}`, `${sort}`);
        sortQuery.set('results.id', "DESC");
        const orderBy = Object.fromEntries(sortQuery);

        if (page) {
            separateCount = await this.examRepository.count();
        }

        const examPercentage = await this.examRepository.createQueryBuilder('exam')
            .select('exam.id')
            .addSelect([`AVG(COALESCE(examResult.percentage,0))::numeric(10,2) AS "examPercentage"`])
            .from(SchoolExamResultEntity, this.examResultAlias)
            .groupBy(`"${this.examResultAlias}"."examId"`)
            .addGroupBy(`"${this.examAlias}"."id"`)
            .having(`"${this.examResultAlias}"."examId" = "${this.examAlias}"."id"`)
            .getRawMany()

        const [items, count] =
            await this.examRepository.createQueryBuilder("exam")
                .select()
                .leftJoinAndSelect("exam.classGroup", "classGroup")
                .leftJoinAndSelect("exam.subject", "subject")
                .leftJoinAndSelect("exam.teacher", "teacher")
                .leftJoinAndSelect("exam.terms", "terms")
                .leftJoinAndSelect("exam.student", "student")
                .leftJoinAndSelect("student.results", "results", "exam.id = results.examId")

                .where(subject ? `subject.id > :subjectId` : '1=1', {subjectId: subject})
                .orderBy({
                    ...orderBy
                })
                .skip(offset)
                .take(limit)
                .getManyAndCount().catch(function (error) {
                    throw new HttpException('No record found.', HttpStatus.BAD_REQUEST)
                })

        items.map((item, index) => {
            let addPercentage = examPercentage.find(x => x.id === item.id)?.examPercentage;
            item['examAverage'] = (addPercentage) ? addPercentage : 0;
        });

        return {
            items,
            total: page ? separateCount : count
        }
    }

    async findOne(id: number, user: UserEntity) {

        const examPercentage = await this.examRepository.createQueryBuilder('exam')
            .select('exam.id')
            .addSelect([`AVG(COALESCE(examResult.percentage,0))::numeric(10,2) AS "examPercentage"`])
            .from(SchoolExamResultEntity, this.examResultAlias)
            .groupBy(`"${this.examResultAlias}"."examId"`)
            .addGroupBy(`"${this.examAlias}"."id"`)
            .having('examResult.examId = :id', {id: id})
            .getRawOne()

        const exam = await this.examRepository.createQueryBuilder("exam")
            .leftJoinAndSelect("exam.classGroup", "classGroup")
            .leftJoinAndSelect("exam.subject", "subject")
            .leftJoinAndSelect("exam.teacher", "teacher")
            .leftJoinAndSelect("exam.terms", "terms")
            .leftJoinAndSelect("exam.student", "student")
            .leftJoinAndSelect("student.results", "results", "exam.id = results.examId")

            .addSelect((subQuery) => {
                return subQuery
                    .select("AVG(COALESCE(examResult.percentage,0))::numeric(10,2)", "avg")
                    .from(SchoolExamResultEntity, "examResult")
                    .where('examResult.examId = :id', {id: id})
                    .groupBy('examResult.examId')
            }, "examAverage")

            .where(`exam.id = :id`, {id: id})
            .getOneOrFail().catch(function (error) {
                throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
            })

        exam['examAverage'] = (examPercentage?.examPercentage) ? examPercentage?.examPercentage : 0;

        if (!exam) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }

        return exam
    }

    async update(id: number, updateExamDto: UpdateExamDto, user: UserEntity) {
        try {
            let tempStudent = []

            //delete students
            if (updateExamDto?.student) {
                const record = await this.examRepository.findOneOrFail({
                    where: {id},
                    relations: ['student']
                });
                record?.student?.map(function (data) {
                    tempStudent.push(data.id)
                });

                await this.examRepository
                    .createQueryBuilder()
                    .relation('student')
                    .of(record)
                    .remove(tempStudent)
            }

            const updateQuery = {...updateExamDto, user, id}
            const preloadQuery = await this.examRepository.preload(updateQuery);
            await this.examRepository.save(preloadQuery);
            const get = await this.examRepository.findOne({
                where: {
                    id,
                },
                relations: this.db_relations,
            });
            return get;

        } catch (e) {
            PostgresErrorHandling(e);
        }
    }

    async remove(id: number, user: UserEntity) {
        const deleteResponse = await this.examRepository
            .createQueryBuilder()
            .softDelete()
            .where("id = :id", {id: id})
            .execute();

        if (!deleteResponse.affected) {
            throw new HttpException("Record not Found", HttpStatus.NOT_FOUND)
        }

        return {
            affected: deleteResponse.affected
        };
    }

    /**
     * Enter student exam results.
     **/
    async createResults(createExamResultsDto: CreateExamResultsDto, user: UserEntity) {

        const examResult = await this.examResultsRepository.create({
            ...createExamResultsDto,
        });

        await this.examResultsRepository.save(examResult).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );

        return examResult;
    }

    /**
     * update student exam results.
     **/
    async updateResults(id: number, updateExamResultsDto: UpdateExamResultsDto, user: UserEntity) {
        const update = await this.examResultsRepository.update({
                id,
            },
            updateExamResultsDto
        );

        if (!update.affected)
            throw new HttpException('Record not found', HttpStatus.BAD_REQUEST);

        return await this.examResultsRepository.findOne({
            where: {
                id,
            },
        })
    }

    /**
     * softDelete student exam results.
     **/
    async removeResults(id: number, user: UserEntity) {
        const deleteResponse = await this.examResultsRepository
            .createQueryBuilder()
            .softDelete()
            .where("id = :id", {id: id})
            .execute();

        if (!deleteResponse.affected) {
            throw new HttpException("Record not Found", HttpStatus.NOT_FOUND)
        }

        return {
            affected: deleteResponse.affected
        };
    }


}
