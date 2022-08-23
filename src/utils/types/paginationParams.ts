import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from "class-validator";
import {Type} from "class-transformer";
import {LIVE_FREELANCE_ORDER_BY, QUERY_SORT_ORDER} from "../enum/enum.types";

export class PaginationParams {
    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    public offset?: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    public limit?: number

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    public page?: number;

    @IsOptional()
    @Type(() => String)
    @IsString()
    @IsEnum(LIVE_FREELANCE_ORDER_BY, {
        message: `Value should be ` + Object.values(LIVE_FREELANCE_ORDER_BY).join(', ')
    })
    public order_by?: string;

    @IsOptional()
    @Type(() => String)
    @IsString()
    @IsEnum(QUERY_SORT_ORDER, {
        message: `Value should be either desc or asc.`
    })
    public sort_order?: string;

    @IsOptional()
    @Type(() => String)
    @IsString()
    public from?: string;

    @IsOptional()
    @Type(() => String)
    @IsString()
    public to?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    public subject?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    public role?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    public timetable?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    public status?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    public rating?: string;

    @IsOptional()
    @IsString()
    @Type(() => String)
    public price?: string;




}

