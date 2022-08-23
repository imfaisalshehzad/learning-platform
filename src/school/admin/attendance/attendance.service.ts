import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {TimetableBlocksEntity} from "../../academic/timetables/blocks/entities/timetable.blocks.entity";
import {Repository} from "typeorm";
import {getStartEndDates} from "../../../utils/functions/utils.function";
import moment from "moment";
import {UserEntity} from "../../../users/entities/user.entity";
import {TimetableBlockFeedbackEntity} from "../../academic/timetables/blocks/block-feedback/entities/block-feedback.entity";

@Injectable()
export class AttendanceService {

    constructor(
        @InjectRepository(TimetableBlocksEntity) private timetableBlocksRepository: Repository<TimetableBlocksEntity>,
        @InjectRepository(TimetableBlockFeedbackEntity) private timetableBlocksFeedbackRepository: Repository<TimetableBlockFeedbackEntity>,
    ) {}

    async findAll(
        user: UserEntity,
        id: number,
        from?: string,
        to?: string,
        role?: string,
    ) {
        if (!(typeof from != "undefined" && typeof to != "undefined") && (moment(from).isValid() && moment(to).isValid())) {
            from = moment().startOf('week').toISOString();
            to = moment().endOf('week').toISOString();
        }
        const getDates = getStartEndDates(from, to);

        const items =
            await this.timetableBlocksRepository.createQueryBuilder("block")
                .select()
                .leftJoinAndSelect("block.student", "student")
                .leftJoinAndSelect(
                    "student.blockFeedback",
                    "blockFeedback",
                    "blockFeedback.blocksId = block.id"
                )
                .leftJoinAndSelect("block.yearGroup", "yearGroup")
                .leftJoinAndSelect("block.formGroup", "formGroup")
                .leftJoinAndSelect("block.classGroup", "classGroup")
                .leftJoinAndSelect("block.department", "department")
                .leftJoinAndSelect("block.subject", "subject")
                .leftJoinAndSelect("block.teacher", "teacher")

                .where('block.block_date_start_time BETWEEN :start AND :end', {
                    start: getDates.start_date,
                    end: getDates.end_date,
                })

                .andWhere((role === "yearGroup") ? `block.yearGroupId = :yearGroupId` : '1=1', {yearGroupId: id})
                .andWhere((role === "formGroup") ? `block.formGroupId = :formGroupId` : '1=1', {formGroupId: id})
                .andWhere((role === "classGroup") ? `block.classGroupId = :classGroupId` : '1=1', {classGroupId: id})
                .andWhere((role === "department") ? `block.departmentId = :departmentId` : '1=1', {departmentId: id})
                .andWhere((role === "subject") ? `block.subjectId = :subjectId` : '1=1', {subjectId: id})
                .andWhere((role === "student") ? `student.id = :studentId` : '1=1', {studentId: id})
                .andWhere((role === "teacher") ? `teacher.id = :teacherId` : '1=1', {teacherId: id})

                .andWhere(`block.schoolId = :userId`, {userId: user.id})
                .orderBy('block.id', 'DESC')
                .getMany().catch(function (error) {
                    throw new HttpException('No record found.', HttpStatus.BAD_REQUEST)
                })

        let totalRegisters = 0,
            markedRegisters = 0,
            unmarkedRegisters = 0,
            totalEntries = 0,
            markedEntries = 0,
            totalPresent = 0,
            totalAbsent = 0,
            totalLate = 0,
            totalOnTime = 0,
            totalMerit = 0,
            totalSanction = 0,
            totalComments = 0;

        items.map(async function (data) {
            if (data) { totalRegisters++; }
            await data?.student.map(async function (students) {
                if (students){ totalEntries++ }
                if (students?.blockFeedback[0]){ markedRegisters++; } else { unmarkedRegisters++; }
                if (students?.blockFeedback[0]?.attendance === "ABSENT"){ totalAbsent++; markedEntries++; }
                if (students?.blockFeedback[0]?.attendance === "PRESENT"){ totalPresent++; totalOnTime++; markedEntries++; }
                if (students?.blockFeedback[0]?.attendance === "LATE"){ totalLate++; totalPresent++; markedEntries++; }
                if (students?.blockFeedback[0]?.status === "Sanction"){ totalSanction++; }
                if (students?.blockFeedback[0]?.status === "Merit"){ totalMerit++; }
                if (students?.blockFeedback[0]?.status === "Comment"){ totalComments++; }
            });
        });

        return {
            details: {
                from : moment(from).format('YYYY-MM-DD'),
                to: moment(to).format('YYYY-MM-DD'),
                role: (role) ? role : 'school',
            },
            graph: {
                register: {
                    totalRegisters,
                    markedRegisters,
                    unmarkedRegisters,
                },
                entries: {
                    totalEntries,
                    markedEntries,
                    unmarkedEntries: (totalEntries - markedEntries),
                },
                attendance: {
                    totalAttendance: totalPresent,
                    totalPresent,
                    totalAbsent,
                    totalLate,
                    totalOnTime,
                    totalMerit,
                    totalSanction,
                    totalComments,
                },
                percentage: {
                    presence: ((totalPresent / markedEntries) * 100) || 0,
                    absence: ((totalAbsent / markedEntries) * 100) || 0,
                    late: ((totalLate / totalPresent) * 100) || 0,
                    punctuality: ((totalOnTime / totalPresent) * 100) || 0,
                }
            },
        }

    }

}
