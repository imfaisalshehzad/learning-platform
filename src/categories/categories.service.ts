import {HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {CreateCategoryDto} from './dto/create-category.dto';
import {UpdateCategoryDto} from './dto/update-category.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {CategoryEntity} from "./entities/category.entity";
import {Repository} from "typeorm";
import {makeSlugify} from "../utils/recursivelyStripNullValues";

class CategoryNotFoundException extends NotFoundException {
    constructor(catId: number) {
        super(`Category with id ${catId} not found.`);
    }
}

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(CategoryEntity)
        private categoryRepository: Repository<CategoryEntity>
    ) {}

    async create(createCategoryDto: CreateCategoryDto) {
        const cats = await this.categoryRepository.create(createCategoryDto);
        const slug = makeSlugify(cats.name);
        const row = {
            ...cats,
            slug
        }
        return await this.categoryRepository.save(row);
    }

    async findAll() {
        const [items, count] =  await this.categoryRepository.findAndCount({
            relations: [
                'posts',
                'posts.author',
            ],
        });

        return{
            items,
            count
        }
    }

    async findOne(id: number) {
        try {
            const ctx = await this.categoryRepository.findOneOrFail({
                where: {
                    id,
                },
                relations: [
                    'posts',
                    'posts.author',
                ],
            })
            return ctx
        } catch (e) {
            throw new HttpException('Not Found', HttpStatus.BAD_REQUEST)
        }
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto) {
        const slug = makeSlugify(updateCategoryDto.name)
        const updateCategory = {
            ...updateCategoryDto,
            slug,
        }
        await this.categoryRepository.update(id, updateCategory);
        const updateCat = this.categoryRepository.findOne({
            where:{
                id,
            },
            relations: ['posts'],
        });
        if (updateCat){
            return updateCat;
        }
        throw new CategoryNotFoundException(id);
    }

    async remove(id: number) {
        const removeCat = await this.categoryRepository.delete(id)
        if (!removeCat.affected) {
            throw new HttpException("Category not Found", HttpStatus.NOT_FOUND)
        }
    }
}
