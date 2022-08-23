import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {Equal, FindManyOptions, MoreThan, Not, Repository} from "typeorm";
import {USER_ROLE} from "../utils/enum/enum.types";
import {getKeyByValue} from "../utils/functions/utils.function";
import * as bcrypt from 'bcrypt';
import {MailService} from "../mail/mail.service";


@Injectable()
export class UsersService {

    private db_relation = [
        'teacher',
    ]

    constructor(
        @InjectRepository(UserEntity) private userRepository: Repository<UserEntity>,
        private mailService: MailService,
    ) {}

    async create(createUserDto: CreateUserDto) {
        const user = await this.userRepository.create(createUserDto);
        const saveUser = await this.userRepository.save(user);
        return saveUser;
    }

    async findAll(
        offset?: number,
        limit?: number,
        page?: number,
        sort_order?: string,
        order_by?: string,
        role?: string,
        options?: FindManyOptions<UserEntity>
    ) {

        const where: FindManyOptions<UserEntity>['where'] = {}

        let separateCount = 0;
        let order = (order_by) ? order_by : 'id';
        let sort = (sort_order) ? sort_order : 'desc';
        let ordering = {[order]: `${sort}`}

        if (page) {
            where.id = MoreThan(page)
            separateCount = await this.userRepository.count();
        }

        if (role) {
            const part = getKeyByValue(USER_ROLE, role);
            where.role = Equal(USER_ROLE[part])
        } else {
            where.role = Not(USER_ROLE.ADMIN)
        }

        const [items, count] = await this.userRepository.findAndCount({
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

    async findOne(id: number) {
        const res = await this.userRepository.findOne(
            {where: {id,}}
        );
        if (!res)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)

        return res;
    }

    async findByEmail(email: string) {
        const res = await this.userRepository.findOne({
            where: {
                email,
            }
        });

        if (!res)
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)

        return res;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        return `This action updates a #${id} user`;
    }

    async remove(id: number) {
        return `This action removes a #${id} user`;
    }

    async markPhoneNumberAsConfirmed(userId: number) {
        return this.userRepository.update({id: userId}, {
            isPhoneNumberConfirmed: 1
        })
    }

    async setCurrentRefreshToken(refreshToken: string, userId: number) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(userId, {
            currentHashedRefreshToken
        });
    }


    async getTeacherOrStudent(user: UserEntity) {
        const current = await this.userRepository.findOneOrFail({
            where: {
                id: user.id
            },
            relations: [
                'teacher',
                'teacher.school',
                'student',
                'student.school',
                'school',
            ],
        });

        return current;
    }
}
