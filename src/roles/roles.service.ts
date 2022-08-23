import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreateRoleDto} from './dto/create-role.dto';
import {UpdateRoleDto} from './dto/update-role.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {RoleEntity} from "./entities/role.entity";
import {Repository} from "typeorm";
import {PostgresErrorHandling} from "../utils/postgresErrorHandling";

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RoleEntity)
        private roleRepository: Repository<RoleEntity>
    ) {}

    async create(createRoleDto: CreateRoleDto) {
        try {
            const record = await this.roleRepository.create(createRoleDto);
            await this.roleRepository.save(record);
            return record;
        } catch (error) {
            PostgresErrorHandling(error)
        }
    }

    async findAll() {
        return await this.roleRepository.find();
    }

    async findOne(id: number) {
        const record = await this.roleRepository.findOne({
            where: {
                id,
            }
        });
        if (!record)
            throw new HttpException('Record not found.', HttpStatus.BAD_REQUEST)

        return record
    }

    async update(id: number, updateRoleDto: UpdateRoleDto) {
        try {
            const updateQuery = {...updateRoleDto, id}
            const preloadQuery = await this.roleRepository.preload(updateQuery)
            await this.roleRepository.save(preloadQuery)

            return await this.roleRepository.findOne({
                where: {id}
            })
        } catch (e) {
            PostgresErrorHandling(e);
        }
    }

    async remove(id: number) {
        const deleteSession = await this.roleRepository.delete({
            id,
        });
        if (!deleteSession.affected)
            throw new HttpException("Record not found", HttpStatus.BAD_REQUEST);
    }
}
