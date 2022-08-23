import {Controller, Get, Post, Param, Patch, Body, UseGuards} from '@nestjs/common';
import {PurchaseService} from './purchase.service';
import {UpdateSessionPayPurchaseDto} from "./dto/update-session-purchase.dto";
import {ApiCookieAuth, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import RoleGuard from "../authentication/role.guard";
import {RoleEnum} from "../authentication/role.enum";


@ApiCookieAuth('in-app-cookie-name')
@ApiTags('Purchase')
@Controller('purchase')
export class PurchaseController {
    constructor(private readonly purchaseService: PurchaseService) {}

    @Post('session')
    @UseGuards(RoleGuard(RoleEnum.STUDENT))
    @UseGuards(JwtAuthenticationGuard)
    @ApiOperation({ summary: 'Purchase' })
    @ApiOkResponse({
        type: UpdateSessionPayPurchaseDto,
        description: 'Purchase'
    })
    createAndUpdateSession(@Body() updateSessionPayPurchaseDto: UpdateSessionPayPurchaseDto) {
        return this.purchaseService.createAndUpdateSession(updateSessionPayPurchaseDto);
    }


}
