import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {CreatePostDto} from './dto/create-post.dto';
import {UpdatePostDto} from './dto/update-post.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {FindManyOptions, MoreThan, Repository} from "typeorm";
import {PostEntity} from "./entities/post.entity"
import {PostNotFundException} from "./exception/postNotFund.exception";
import {UserEntity} from "../users/entities/user.entity";
import {PostgresErrorHandling} from "../utils/postgresErrorHandling";

let relations = [
    'author',
    'categories'
]

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(PostEntity)
        private postsRepository: Repository<PostEntity>
    ) {}

    async create(post: CreatePostDto, user: UserEntity) {
        const newPost = await this.postsRepository.create({
            ...post,
            author: user
        });
        await this.postsRepository.save(newPost);
        return newPost;
    }

    async findAll(
        offset?: number,
        limit?: number,
        page?: number,
        options?: FindManyOptions<PostEntity>
    ) {
        const where: FindManyOptions<PostEntity>['where'] = {};
        let separateCount = 0;

        if(page){
            where.id = MoreThan(page);
            separateCount = await this.postsRepository.count();
        }

        const [items, count] = await this.postsRepository.findAndCount({
            where,
            relations,
            order: {
                id: "DESC",
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

    async findOne(id: number): Promise<PostEntity> {
        const res = await this.postsRepository.findOne({
            where: {id},
            relations,
        });

        if (!res)
            throw new PostNotFundException(id)

        return res;
    }

    async update(id: number, post: UpdatePostDto) {

        try {
            const updateQuery = {...post, id}
            const preloadQuery = await this.postsRepository.preload(updateQuery)
            await this.postsRepository.save(preloadQuery)

            return await this.postsRepository.findOne({
                where: {id,},
                relations,
            })
        } catch (e) {
            PostgresErrorHandling(e);
        }
    }

    async remove(id: number) {
        const deleteResponse = await this.postsRepository.delete(id);
        if (!deleteResponse.affected) {
            throw new HttpException("Post not Found", HttpStatus.NOT_FOUND)
        }
    }
}
