import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateHomeworkDto} from './dto/create-homework.dto';
import {UpdateHomeworkDto} from './dto/update-homework.dto';
import {UserEntity} from "../users/entities/user.entity";
import {InjectEntityManager, InjectRepository} from "@nestjs/typeorm";
import {SchoolHomeworkEntity} from "./entities/homework.entity";
import {EntityManager, FindManyOptions, In, MoreThan, Repository} from "typeorm";
import {joinDateAndTime} from "../utils/functions/utils.function";
import {PostgresErrorHandling} from "../utils/postgresErrorHandling";
import {SubmitHomeworkDto} from "./dto/submit/submit-homework.dto";
import {MarkHomeworkDto} from "./dto/mark/mark-homework.dto";
import {SchoolHomeworkSubmissionsEntity} from "./entities/homework.submissions.entity";
import {SchoolHomeworkMarkEntity} from "./entities/homework.mark.entity";
import moment from "moment";
import {UsersService} from "../users/users.service";

@Injectable()
export class HomeworkService {

    private db_relations = [
        'subject',
        'student',
        'student.submissions',
        'student.submissions.mark',
        'student.submissions.mark.teacher',
        'teacher',
        'resource',
        'classGroup',
    ]

    constructor(
        @InjectRepository(SchoolHomeworkEntity) private homeworkRepository: Repository<SchoolHomeworkEntity>,
        @InjectRepository(SchoolHomeworkSubmissionsEntity) private homeworkSubmissionRepository: Repository<SchoolHomeworkSubmissionsEntity>,
        @InjectRepository(SchoolHomeworkMarkEntity) private homeworkMarkRepository: Repository<SchoolHomeworkMarkEntity>,
        private readonly userService: UsersService,
    ) {}

    async create(createHomeworkDto: CreateHomeworkDto, user: UserEntity) {

        const date = createHomeworkDto.due_date;
        const time = createHomeworkDto.due_time;

        const homework = await this.homeworkRepository.create({
            ...createHomeworkDto,
            teacher: user,
            school: user.teacher.school,
            due_date_time: joinDateAndTime(date, time)
        });

        await this.homeworkRepository.save(homework).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );

        return await this.findOne(homework.id, user);
    }

    async findAll(
        user: UserEntity,
        offset?: number,
        limit?: number,
        page?: number,
        sort_order?: string,
        order_by?: string,
        from?: string,
        to?: string,
        options?: FindManyOptions<SchoolHomeworkEntity>
    ) {

        const loggedInUser = await this.userService.getTeacherOrStudent(user);

        let separateCount = 0;
        const sortQuery = new Map();
        let orderKey = (order_by) ? order_by : "id"
        let sort = (sort_order) ? sort_order : "DESC"
        sortQuery.set(`homework.${orderKey}`, `${sort}`);
        sortQuery.set('submissions.id', "DESC");
        const orderBy = Object.fromEntries(sortQuery);

        if (page) {
            separateCount = await this.homeworkRepository.count();
        }

        const [items, count] = await this.homeworkRepository.createQueryBuilder("homework")
            .leftJoinAndSelect("homework.student", "student")
            .leftJoinAndSelect(
                "student.submissions",
                "submissions",
                "homework.id = submissions.homeworkId"
            )
            .leftJoinAndSelect("submissions.resource", "submissions_resource")
            .leftJoinAndSelect("submissions.mark", "mark")
            .leftJoinAndSelect("homework.subject", "subject")
            .leftJoinAndSelect("homework.teacher", "teacher")
            .leftJoinAndSelect("homework.resource", "resource")
            .leftJoinAndSelect("homework.classGroup", "classGroup")

            .andWhere(page ? `homework.id > :pageNumber` : '1=1', {pageNumber: page})
            .andWhere((user.role === "teacher") ? `teacher.id = :teacherId` : '1=1', {teacherId: loggedInUser?.teacher?.id})
            .andWhere((user.role === "student") ? `student.id = :studentId` : '1=1', {studentId: loggedInUser?.student?.id})

            .orderBy({
                ...orderBy
            })
            .skip(offset)
            .take(limit)
            .getManyAndCount()

        // await this.homeworkManager.fi

        return {
            items,
            total: page ? separateCount : count
        }
    }

    async findOne(id: number, user: UserEntity) {

        const homework = await this.homeworkRepository.createQueryBuilder("homework")
            .leftJoinAndSelect("homework.student", "student")
            .leftJoinAndSelect(
                "student.submissions",
                "submissions",
                "homework.id = submissions.homeworkId"
            )
            .leftJoinAndSelect("submissions.resource", "submissions_resource")
            .leftJoinAndSelect("submissions.mark", "mark")
            .leftJoinAndSelect("homework.subject", "subject")
            .leftJoinAndSelect("homework.teacher", "teacher")
            .leftJoinAndSelect("homework.resource", "resource")
            .leftJoinAndSelect("homework.classGroup", "classGroup")
            .where(`homework.id = :id`, {id: id})
            .orderBy("submissions.id", 'DESC')
            .getOneOrFail()

        if (!homework) {
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)
        }
        return homework;
    }

    async update(id: number, updateHomeworkDto: UpdateHomeworkDto, user: UserEntity) {

        try {
            let tempStudent = []
            //delete students
            if (updateHomeworkDto?.student) {
                const record = await this.homeworkRepository.findOneOrFail({
                    where: {id},
                    relations: ['student']
                });
                record?.student?.map(function (data) {
                    tempStudent.push(data.id)
                });

                await this.homeworkRepository
                    .createQueryBuilder()
                    .relation('student')
                    .of(record)
                    .remove(tempStudent)
            }

            let updateQuery = {
                ...updateHomeworkDto,
                id
            }

            if (updateHomeworkDto.due_date && updateHomeworkDto.due_time) {
                const date = updateHomeworkDto.due_date;
                const time = updateHomeworkDto.due_time;
                const date_time = joinDateAndTime(date, time);
                updateQuery = {
                    ...updateHomeworkDto,
                    due_date_time: date_time.toISOString(),
                    id
                }
            }

            const preloadQuery = await this.homeworkRepository.preload(updateQuery);
            await this.homeworkRepository.save(preloadQuery);
            const getRow = await this.homeworkRepository.findOne({
                where: {
                    id,
                },
                relations: this.db_relations,
            });
            return getRow;

        } catch (e) {
            PostgresErrorHandling(e);
        }

    }

    async remove(id: number, user: UserEntity) {
        const deleteResponse = await this.homeworkRepository
            .createQueryBuilder()
            .softDelete()
            .where("id = :id", {id: id})
            .andWhere("teacherId = :teacherId", {teacherId: user.id})
            .execute();

        if (!deleteResponse.affected) {
            throw new HttpException("Record not Found", HttpStatus.NOT_FOUND)
        }

        return {
            affected: deleteResponse.affected
        };
    }


    async homeworkSubmit(submitHomeworkDto: SubmitHomeworkDto, user: UserEntity) {

        const submission = await this.homeworkSubmissionRepository.create({
            ...submitHomeworkDto,
            student: user,
            submitted: moment().toISOString(),
        });

        await this.homeworkSubmissionRepository.save(submission).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );

        return submission;

    }


    async homeworkMark(markHomeworkDto: MarkHomeworkDto, user: UserEntity) {

        const teacher = await this.userService.getTeacherOrStudent(user);
        const marking = await this.homeworkMarkRepository.create({
            ...markHomeworkDto,
            teacher: teacher.teacher,
        })

        await this.homeworkMarkRepository.save(marking).catch(
            function (error) {
                throw new HttpException(
                    'Record already found.',
                    HttpStatus.BAD_REQUEST
                );
            }
        );

        return marking;
    }
}
