import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {UserEntity} from "../../../users/entities/user.entity";
import moment from "moment";
import {getStartEndDates} from "../../../utils/functions/utils.function";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {TimetableBlockFeedbackEntity} from "../timetables/blocks/block-feedback/entities/block-feedback.entity";

@Injectable()
export class SessionsService {

    async findAll(
        user: UserEntity,
        id: number,
        from?: string,
        to?: string,
        role?: string,
    ) {
        // if (!(typeof from != "undefined" && typeof to != "undefined") && (moment(from).isValid() && moment(to).isValid())) {
        //     from = moment().startOf('week').toISOString();
        //     to = moment().endOf('week').toISOString();
        // }
        // const getDates = getStartEndDates(from, to);
        //
        // const items =
        //     await this.timetableBlocksRepository.createQueryBuilder("block")
        //         .select()
        //
        //         .where('block.block_date_start_time BETWEEN :start AND :end', {
        //             start: getDates.start_date,
        //             end: getDates.end_date,
        //         })
        //
        //         .andWhere((role === "yearGroup") ? `block.yearGroupId = :yearGroupId` : '1=1', {yearGroupId: id})
        //         .andWhere((role === "formGroup") ? `block.formGroupId = :formGroupId` : '1=1', {formGroupId: id})
        //         .andWhere((role === "classGroup") ? `block.classGroupId = :classGroupId` : '1=1', {classGroupId: id})
        //         .andWhere((role === "department") ? `block.departmentId = :departmentId` : '1=1', {departmentId: id})
        //         .andWhere((role === "subject") ? `block.subjectId = :subjectId` : '1=1', {subjectId: id})
        //         .andWhere((role === "student") ? `student.id = :studentId` : '1=1', {studentId: id})
        //         .andWhere((role === "teacher") ? `teacher.id = :teacherId` : '1=1', {teacherId: id})
        //
        //         .andWhere(`block.schoolId = :userId`, {userId: user.id})
        //         .orderBy('block.id', 'DESC')
        //         .getMany().catch(function (error) {
        //             throw new HttpException('No record found.', HttpStatus.BAD_REQUEST)
        //         })



    }


}
